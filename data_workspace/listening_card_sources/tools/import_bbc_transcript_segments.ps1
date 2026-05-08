param(
  [string]$GroupPath = "data_workspace/listening_card_sources/groups/bbc-learning-english.csv",
  [string]$OutputRoot = "data_workspace/listening_card_sources/segments/bbc-learning-english",
  [string]$TempPath = "data_workspace/listening_card_sources/.tmp/captions",
  [int]$Skip = 0,
  [int]$MaxVideos = 5,
  [string]$Status = "candidate",
  [string]$SubLangs = "en-GB,en",
  [double]$MinDurationSeconds = 4,
  [double]$TargetMaxDurationSeconds = 12,
  [double]$HardMaxDurationSeconds = 18,
  [int]$MinWords = 5,
  [int]$TargetMaxWords = 24,
  [double]$SkipIntroSeconds = 0,
  [double]$EndTrimSeconds = 0.18,
  [switch]$RefreshCaptions,
  [switch]$Overwrite
)

$ErrorActionPreference = "Stop"

if ($Status -notin @("candidate", "approved")) {
  throw "Status must be 'candidate' or 'approved'."
}

if (-not (Get-Command yt-dlp -ErrorAction SilentlyContinue)) {
  throw "yt-dlp is required but was not found on PATH."
}

function Get-FieldValue([object]$row, [string]$fieldName) {
  $value = $row.$fieldName

  if ($null -eq $value) {
    return ""
  }

  return ([string]$value).Trim()
}

function New-Slug([string]$value, [int]$maxLength = 44) {
  $slug = $value.ToLowerInvariant()
  $slug = $slug -replace "[^a-z0-9]+", "-"
  $slug = $slug.Trim("-")

  if ($slug.Length -gt $maxLength) {
    $slug = $slug.Substring(0, $maxLength).Trim("-")
  }

  if (-not $slug) {
    return "lesson"
  }

  return $slug
}

function New-LessonId([object]$row) {
  $title = Get-FieldValue $row "source_title"
  $videoId = Get-FieldValue $row "youtube_video_id"
  $shortVideoId = $videoId.Substring(0, [Math]::Min(6, $videoId.Length)).ToLowerInvariant()

  return "bbc-6min-$(New-Slug $title)-$shortVideoId"
}

function ConvertTo-CleanCaptionText([string]$value) {
  if (-not $value) {
    return ""
  }

  $text = [System.Net.WebUtility]::HtmlDecode($value)
  $text = $text -replace "<[^>]+>", " "
  $text = $text -replace "\s+", " "
  $text = $text.Trim()

  if ($text -match "^\[[^\]]+\]$") {
    return ""
  }

  return $text
}

function Get-WordCount([string]$value) {
  if (-not $value) {
    return 0
  }

  return @($value -split "\s+" | Where-Object { $_.Trim() }).Count
}

function Split-CaptionTextBySpeaker([string]$value) {
  if (-not $value) {
    return @()
  }

  return @(
    [regex]::Split($value, "\s+(?=[A-Z][A-Za-z]+:)") |
      ForEach-Object { $_.Trim() } |
      Where-Object { $_ }
  )
}

function Test-IsSentenceEnd([string]$value) {
  if (-not $value) {
    return $false
  }

  $text = $value.Trim()
  $text = $text -replace '[)"''\]]+$', ''

  if (-not $text) {
    return $false
  }

  if ($text -match "\.{2,}$") {
    return $false
  }

  return $text -match "([!?]|(?<!\.)\.)$"
}

function Test-IsSpeakerStart([string]$value) {
  return $value -match "^[A-Z][A-Za-z]+:"
}

function Test-IsPromotionalTranscript([string]$value) {
  return $value -match "(?i)\b(visit us|follow us|facebook|twitter|instagram|youtube|bbclearningenglish\.com|our website|subscribe)\b"
}

function ConvertTo-InvariantNumber([double]$value) {
  return $value.ToString("0.###", [System.Globalization.CultureInfo]::InvariantCulture)
}

function Escape-CsvValue([object]$value) {
  if ($null -eq $value) {
    return '""'
  }

  $text = [string]$value
  $text = $text -replace '"', '""'

  return '"' + $text + '"'
}

function Write-SegmentCsv([object[]]$segments, [string]$path, [string]$status) {
  $lines = New-Object System.Collections.Generic.List[string]

  $lines.Add("lesson_id,segment_order,start_seconds,end_seconds,speaker,transcript,prompt_vi,prompt_en,target_phrases,hint_phrase,hint_type,hint_vi,hint_en,vocabulary_terms,vocabulary_vi,vocabulary_en,status")

  foreach ($segment in $segments) {
    $values = @(
      $segment.lesson_id,
      $segment.segment_order,
      (ConvertTo-InvariantNumber $segment.start_seconds),
      (ConvertTo-InvariantNumber $segment.end_seconds),
      $segment.speaker,
      $segment.transcript,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      $status
    ) | ForEach-Object { Escape-CsvValue $_ }

    $lines.Add(($values -join ","))
  }

  $directory = Split-Path -Parent $path

  if (-not (Test-Path $directory)) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
  }

  $lines | Set-Content -Encoding UTF8 -Path $path
}

function Get-CaptionEvents([string]$captionPath, [double]$skipIntroSeconds) {
  $json = Get-Content -Raw -Encoding UTF8 -Path $captionPath | ConvertFrom-Json
  $events = New-Object System.Collections.Generic.List[object]

  foreach ($event in $json.events) {
    if ($null -eq $event.tStartMs -or $null -eq $event.segs) {
      continue
    }

    $text = (($event.segs | ForEach-Object { $_.utf8 }) -join "")
    $text = ConvertTo-CleanCaptionText $text

    if (-not $text) {
      continue
    }

    $startSeconds = [double]$event.tStartMs / 1000
    $durationMs = if ($null -ne $event.dDurationMs) { [double]$event.dDurationMs } else { 1200 }
    $endSeconds = ([double]$event.tStartMs + $durationMs) / 1000

    if ($endSeconds -le $skipIntroSeconds) {
      continue
    }

    if ($startSeconds -lt $skipIntroSeconds) {
      $startSeconds = $skipIntroSeconds
    }

    $parts = @(Split-CaptionTextBySpeaker $text)
    $totalWords = [Math]::Max(1, (Get-WordCount $text))
    $cursor = $startSeconds

    for ($partIndex = 0; $partIndex -lt $parts.Count; $partIndex += 1) {
      $part = $parts[$partIndex]
      $partWords = [Math]::Max(1, (Get-WordCount $part))
      $partDuration = ([double]$partWords / [double]$totalWords) * ($endSeconds - $startSeconds)
      $partEnd = if ($partIndex -eq ($parts.Count - 1)) { $endSeconds } else { $cursor + $partDuration }

      $events.Add([pscustomobject]@{
        start = $cursor
        end = $partEnd
        text = $part
      })

      $cursor = $partEnd
    }
  }

  return $events.ToArray()
}

function New-SegmentsFromCaptions([object[]]$captions, [string]$lessonId) {
  $segments = New-Object System.Collections.Generic.List[object]
  $buffer = New-Object System.Collections.Generic.List[string]
  $segmentStart = $null
  $segmentEnd = $null

  $flush = {
    if ($buffer.Count -eq 0 -or $null -eq $segmentStart -or $null -eq $segmentEnd) {
      return
    }

    $transcript = (($buffer.ToArray()) -join " ").Trim()

    if (-not $transcript) {
      $buffer.Clear()
      return
    }

    $order = $segments.Count + 1
    $safeEndSeconds = [Math]::Max([double]$segmentStart + 0.55, [double]$segmentEnd - $EndTrimSeconds)
    $segments.Add([pscustomobject]@{
      lesson_id = $lessonId
      segment_order = $order
      start_seconds = [double]$segmentStart
      end_seconds = $safeEndSeconds
      speaker = "Speaker"
      transcript = $transcript
    })

    $buffer.Clear()
    Set-Variable -Name segmentStart -Value $null -Scope 1
    Set-Variable -Name segmentEnd -Value $null -Scope 1
  }

  foreach ($caption in $captions) {
    if ($buffer.Count -gt 0 -and (Test-IsSpeakerStart ([string]$caption.text))) {
      $bufferTextBeforeSpeaker = (($buffer.ToArray()) -join " ").Trim()

      if (Test-IsSentenceEnd $bufferTextBeforeSpeaker) {
        & $flush
      }
    }

    if ($null -eq $segmentStart) {
      $segmentStart = [double]$caption.start
    }

    $segmentEnd = [double]$caption.end
    $buffer.Add([string]$caption.text)

    $currentText = (($buffer.ToArray()) -join " ").Trim()
    $duration = [double]$segmentEnd - [double]$segmentStart
    $wordCount = Get-WordCount $currentText
    $sentenceEnd = Test-IsSentenceEnd $currentText

    $shouldFlush =
      ($sentenceEnd -and (
        ($duration -ge $MinDurationSeconds -and $wordCount -ge $MinWords) -or
        ($duration -ge $TargetMaxDurationSeconds) -or
        ($wordCount -ge $TargetMaxWords)
      ))

    if ($shouldFlush) {
      & $flush
    }
  }

  & $flush

  if ($segments.Count -le 1) {
    return $segments.ToArray()
  }

  $merged = New-Object System.Collections.Generic.List[object]

  foreach ($segment in $segments) {
    $duration = [double]$segment.end_seconds - [double]$segment.start_seconds
    $wordCount = Get-WordCount $segment.transcript

    if ($merged.Count -gt 0 -and ($duration -lt 2 -or $wordCount -lt 3)) {
      $previous = $merged[$merged.Count - 1]
      $previous.end_seconds = $segment.end_seconds
      $previous.transcript = "$($previous.transcript) $($segment.transcript)".Trim()
      continue
    }

    $merged.Add($segment)
  }

  while (
    $merged.Count -gt 0 -and
    (Test-IsPromotionalTranscript ($merged[$merged.Count - 1].transcript))
  ) {
    $merged.RemoveAt($merged.Count - 1)
  }

  for ($index = 0; $index -lt $merged.Count; $index += 1) {
    $merged[$index].segment_order = $index + 1
  }

  return $merged.ToArray()
}

function Save-SubtitleJson([object]$row, [string]$videoTempPath) {
  $sourceUrl = Get-FieldValue $row "source_url"
  $videoId = Get-FieldValue $row "youtube_video_id"

  if (-not (Test-Path $videoTempPath)) {
    New-Item -ItemType Directory -Path $videoTempPath -Force | Out-Null
  }

  if (-not $RefreshCaptions) {
    $cachedCaptionFile = Get-ChildItem -Path $videoTempPath -Filter "$videoId*.json3" -File |
      Sort-Object Name |
      Select-Object -First 1

    if ($cachedCaptionFile) {
      return $cachedCaptionFile.FullName
    }
  }

  & yt-dlp `
    --skip-download `
    --write-subs `
    --write-auto-subs `
    --sub-langs $SubLangs `
    --sub-format json3 `
    --output "$videoTempPath\%(id)s.%(ext)s" `
    --no-warnings `
    $sourceUrl | Out-Null

  $captionFile = Get-ChildItem -Path $videoTempPath -Filter "$videoId*.json3" -File |
    Sort-Object Name |
    Select-Object -First 1

  if (-not $captionFile) {
    return $null
  }

  return $captionFile.FullName
}

if (-not (Test-Path $GroupPath)) {
  throw "Group CSV not found: $GroupPath"
}

if (-not (Test-Path $TempPath)) {
  New-Item -ItemType Directory -Path $TempPath -Force | Out-Null
}

$rows = @(
  Import-Csv $GroupPath |
    Where-Object { (Get-FieldValue $_ "curation_status") -eq "approved" } |
    Select-Object -Skip $Skip -First $MaxVideos
)

$written = 0
$skipped = 0
$failed = 0

foreach ($row in $rows) {
  $lessonId = New-LessonId $row
  $outputPath = Join-Path $OutputRoot "$lessonId.csv"

  if ((Test-Path $outputPath) -and -not $Overwrite) {
    Write-Output "skip=exists lesson=$lessonId path=$outputPath"
    $skipped += 1
    continue
  }

  $videoId = Get-FieldValue $row "youtube_video_id"
  $videoTempPath = Join-Path $TempPath $videoId

  if ($RefreshCaptions -and (Test-Path $videoTempPath)) {
    Remove-Item -LiteralPath $videoTempPath -Recurse -Force
  }

  New-Item -ItemType Directory -Path $videoTempPath -Force | Out-Null

  try {
    $captionPath = Save-SubtitleJson $row $videoTempPath

    if (-not $captionPath) {
      Write-Output "skip=no-caption lesson=$lessonId video=$videoId"
      $skipped += 1
      continue
    }

    $captions = Get-CaptionEvents $captionPath $SkipIntroSeconds
    $segments = New-SegmentsFromCaptions $captions $lessonId

    if ($segments.Count -eq 0) {
      Write-Output "skip=no-segments lesson=$lessonId video=$videoId"
      $skipped += 1
      continue
    }

    Write-SegmentCsv $segments $outputPath $Status
    Write-Output "wrote=$outputPath lesson=$lessonId segments=$($segments.Count) status=$Status"
    $written += 1
  } catch {
    $position = $_.InvocationInfo.PositionMessage -replace "\r?\n", " "
    Write-Output "failed lesson=$lessonId video=$videoId error=$($_.Exception.Message) at=$position"
    $failed += 1
  }
}

Write-Output "summary written=$written skipped=$skipped failed=$failed"

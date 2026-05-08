param(
  [string]$GroupsPath = "data_workspace/listening_card_sources/groups",
  [string]$SegmentsPath = "data_workspace/listening_card_sources/segments",
  [string]$OutputPath = "frontend/web_app/src/server/modules/listening/listening.generated.ts"
)

$ErrorActionPreference = "Stop"

$allowedCategories = @(
  "bbc-learning-english",
  "business",
  "health-medicine",
  "job-interview",
  "technology-science",
  "travel-culture",
  "daily-conversations",
  "ielts",
  "toeic"
)

$allowedLevels = @("A1", "A2", "B1", "B2", "C1")
$allowedStatuses = @("approved")
$allowedHintTypes = @(
  "WEAK_SOUND",
  "LINKING",
  "SIMILAR_SOUND",
  "EXACT_WORDING",
  "UNKNOWN_PHRASE"
)

$topicLabels = @{
  "health-wellbeing" = @{ vi = "S\u1ee9c kh\u1ecfe v\u00e0 tinh th\u1ea7n"; en = "Health and wellbeing" }
  "learning-memory" = @{ vi = "Ghi nh\u1edb v\u00e0 h\u1ecdc t\u1eadp"; en = "Learning and memory" }
  "lifestyle-growth" = @{ vi = "\u0110\u1eddi s\u1ed1ng v\u00e0 ph\u00e1t tri\u1ec3n b\u1ea3n th\u00e2n"; en = "Lifestyle and growth" }
  "society-culture" = @{ vi = "X\u00e3 h\u1ed9i v\u00e0 v\u0103n h\u00f3a"; en = "Society and culture" }
  "food-consumer" = @{ vi = "Th\u1ef1c ph\u1ea9m v\u00e0 ti\u00eau d\u00f9ng"; en = "Food and consumer life" }
  "work-future" = @{ vi = "C\u00f4ng vi\u1ec7c v\u00e0 t\u01b0\u01a1ng lai"; en = "Work and the future" }
}

$topicSkillFocus = @{
  "health-wellbeing" = @(
    @{ vi = "Nghe \u00fd ch\u00ednh"; en = "Catch the main idea" },
    @{ vi = "T\u1eeb v\u1ef1ng s\u1ee9c kh\u1ecfe"; en = "Health vocabulary" }
  )
  "learning-memory" = @(
    @{ vi = "Nghe gi\u1ea3i th\u00edch"; en = "Follow explanations" },
    @{ vi = "C\u1ee5m h\u1ecdc t\u1eadp"; en = "Learning phrases" }
  )
  "lifestyle-growth" = @(
    @{ vi = "C\u1ee5m \u0111\u1eddi s\u1ed1ng"; en = "Lifestyle phrases" },
    @{ vi = "Nh\u1ecbp h\u1ed9i tho\u1ea1i t\u1ef1 nhi\u00ean"; en = "Natural speaking rhythm" }
  )
  "society-culture" = @(
    @{ vi = "Ch\u1ee7 \u0111\u1ec1 x\u00e3 h\u1ed9i"; en = "Social topics" },
    @{ vi = "T\u1eeb v\u1ef1ng v\u0103n h\u00f3a"; en = "Culture vocabulary" }
  )
  "food-consumer" = @(
    @{ vi = "T\u1eeb v\u1ef1ng th\u1ef1c ph\u1ea9m"; en = "Food vocabulary" },
    @{ vi = "V\u00ed d\u1ee5 \u0111\u1eddi th\u01b0\u1eddng"; en = "Everyday examples" }
  )
  "work-future" = @(
    @{ vi = "C\u1ee5m c\u00f4ng vi\u1ec7c"; en = "Work phrases" },
    @{ vi = "D\u1ef1 \u0111o\u00e1n v\u00e0 xu h\u01b0\u1edbng"; en = "Predictions and trends" }
  )
}

function Get-FieldValue([object]$row, [string]$fieldName) {
  $value = $row.$fieldName

  if ($null -eq $value) {
    return ""
  }

  return ([string]$value).Trim()
}

function Assert-Field([object]$row, [string]$fieldName, [string]$sourceFile) {
  if (-not (Get-FieldValue $row $fieldName)) {
    throw "Missing required field '$fieldName' in $sourceFile"
  }
}

function ConvertTo-PositiveInt([object]$row, [string]$fieldName, [string]$sourceFile) {
  $raw = Get-FieldValue $row $fieldName
  $value = 0

  if (-not [int]::TryParse($raw, [ref]$value) -or $value -lt 1) {
    throw "Invalid integer '$raw' for '$fieldName' in $sourceFile"
  }

  return $value
}

function ConvertTo-Number([object]$row, [string]$fieldName, [string]$sourceFile) {
  $raw = Get-FieldValue $row $fieldName

  try {
    return [double]::Parse($raw, [System.Globalization.CultureInfo]::InvariantCulture)
  } catch {
    throw "Invalid number '$raw' for '$fieldName' in $sourceFile"
  }
}

function Split-PipeList([string]$value) {
  if (-not $value -or -not $value.Trim()) {
    return @()
  }

  return @(
    $value -split "\|" |
      ForEach-Object { $_.Trim() } |
      Where-Object { $_ }
  )
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

function New-Description([string]$title, [string]$topicBucket, [bool]$hasSegments) {
  $topic = $topicLabels[$topicBucket]

  if (-not $topic) {
    $topic = @{ vi = "Luy\u1ec7n nghe"; en = "Listening practice" }
  }

  if ($hasSegments) {
    return @{
      vi = "B\u00e0i nghe BBC 6 Minute English v\u1ec1 $($topic.vi). N\u1ed9i dung \u0111\u00e3 c\u00f3 transcript v\u00e0 timestamp \u0111\u1ec3 luy\u1ec7n dictation theo t\u1eebng \u0111o\u1ea1n."
      en = "A BBC 6 Minute English listening card about $($topic.en). Transcript and timestamps are ready for segment-by-segment dictation practice."
    }
  }

  return @{
    vi = "B\u00e0i nghe BBC 6 Minute English v\u1ec1 $($topic.vi). N\u1ed9i dung \u0111ang \u1edf d\u1ea1ng metadata \u0111\u1ec3 chu\u1ea9n b\u1ecb transcript v\u00e0 b\u00e0i t\u1eadp dictation."
    en = "A BBC 6 Minute English listening card about $($topic.en). This lesson is metadata-only while transcript and dictation practice are prepared."
  }
}

function New-SegmentPrompt([int]$order, [string]$promptVi, [string]$promptEn) {
  $fallbackVi = "Nghe \u0111o\u1ea1n #$order v\u00e0 g\u00f5 l\u1ea1i ch\u00ednh x\u00e1c."
  $fallbackEn = "Listen to segment #$order and type it exactly."

  if (-not $promptVi) {
    $promptVi = $fallbackVi
  }

  if (-not $promptEn) {
    $promptEn = $fallbackEn
  }

  return @{ vi = $promptVi; en = $promptEn }
}

function New-SegmentId([int]$order) {
  return "seg-{0:D2}" -f $order
}

function New-Hints([object]$row, [string]$sourceFile) {
  $phrase = Get-FieldValue $row "hint_phrase"
  $type = Get-FieldValue $row "hint_type"
  $vi = Get-FieldValue $row "hint_vi"
  $en = Get-FieldValue $row "hint_en"
  $hasAnyHintField = $phrase -or $type -or $vi -or $en

  if (-not $hasAnyHintField) {
    return @()
  }

  if (-not $phrase -or -not $type -or -not $vi -or -not $en) {
    throw "Incomplete hint fields in $sourceFile. Fill hint_phrase, hint_type, hint_vi, and hint_en together."
  }

  if ($type -notin $allowedHintTypes) {
    throw "Invalid hint_type '$type' in $sourceFile"
  }

  return @(
    @{
      phrase = $phrase
      type = $type
      explanation = @{ vi = $vi; en = $en }
    }
  )
}

function New-Vocabulary([object]$row, [string]$sourceFile, [string]$transcript) {
  $terms = Split-PipeList (Get-FieldValue $row "vocabulary_terms")
  $meaningsVi = Split-PipeList (Get-FieldValue $row "vocabulary_vi")
  $meaningsEn = Split-PipeList (Get-FieldValue $row "vocabulary_en")

  if ($terms.Count -eq 0) {
    return @()
  }

  if ($terms.Count -ne $meaningsVi.Count -or $terms.Count -ne $meaningsEn.Count) {
    throw "Vocabulary columns must have the same item count in $sourceFile"
  }

  $items = @()

  for ($index = 0; $index -lt $terms.Count; $index += 1) {
    $items += @{
      term = $terms[$index]
      meaning = @{ vi = $meaningsVi[$index]; en = $meaningsEn[$index] }
      context = $transcript
    }
  }

  return @($items)
}

function New-Segment([object]$row, [string]$sourceFile) {
  Assert-Field $row "lesson_id" $sourceFile
  Assert-Field $row "segment_order" $sourceFile
  Assert-Field $row "start_seconds" $sourceFile
  Assert-Field $row "end_seconds" $sourceFile
  Assert-Field $row "transcript" $sourceFile

  $order = ConvertTo-PositiveInt $row "segment_order" $sourceFile
  $startSeconds = ConvertTo-Number $row "start_seconds" $sourceFile
  $endSeconds = ConvertTo-Number $row "end_seconds" $sourceFile
  $transcript = Get-FieldValue $row "transcript"

  if ($endSeconds -le $startSeconds) {
    throw "Segment #$order has end_seconds <= start_seconds in $sourceFile"
  }

  return [pscustomobject]@{
    lessonId = Get-FieldValue $row "lesson_id"
    segment = [pscustomobject]@{
      id = New-SegmentId $order
      order = $order
      speaker = if (Get-FieldValue $row "speaker") { Get-FieldValue $row "speaker" } else { "Speaker" }
      startSeconds = $startSeconds
      endSeconds = $endSeconds
      transcript = $transcript
      prompt = New-SegmentPrompt $order (Get-FieldValue $row "prompt_vi") (Get-FieldValue $row "prompt_en")
      targetPhrases = @(Split-PipeList (Get-FieldValue $row "target_phrases"))
      hints = @(New-Hints $row $sourceFile)
      vocabulary = @(New-Vocabulary $row $sourceFile $transcript)
    }
  }
}

function Get-SegmentsByLessonId([string]$path) {
  $index = @{}

  if (-not (Test-Path $path)) {
    return $index
  }

  foreach ($file in Get-ChildItem $path -Recurse -Filter "*.csv") {
    $categoryId = $file.Directory.Name

    if ($categoryId -notin $allowedCategories) {
      throw "Unknown segment category folder: $categoryId"
    }

    foreach ($row in Import-Csv $file.FullName) {
      $status = Get-FieldValue $row "status"

      if ($status -notin $allowedStatuses) {
        continue
      }

      $entry = New-Segment $row $file.Name

      if (-not $index.ContainsKey($entry.lessonId)) {
        $index[$entry.lessonId] = New-Object System.Collections.Generic.List[object]
      }

      $index[$entry.lessonId].Add($entry.segment)
    }
  }

  foreach ($lessonId in @($index.Keys)) {
    $segments = @($index[$lessonId] | Sort-Object order)
    $expectedOrder = 1
    $lastEndSeconds = -1
    $seenOrders = New-Object System.Collections.Generic.HashSet[int]

    foreach ($segment in $segments) {
      if (-not $seenOrders.Add([int]$segment.order)) {
        throw "Duplicate segment_order '$($segment.order)' for lesson '$lessonId'"
      }

      if ([int]$segment.order -ne $expectedOrder) {
        throw "Segment order must be continuous from 1 for lesson '$lessonId'"
      }

      if ([double]$segment.startSeconds -lt $lastEndSeconds) {
        throw "Segment timestamps overlap for lesson '$lessonId'"
      }

      $lastEndSeconds = [double]$segment.endSeconds
      $expectedOrder += 1
    }

    $index[$lessonId] = @($segments)
  }

  return $index
}

function Get-ExistingIds {
  $sourceFiles = @(
    "frontend/web_app/src/server/modules/listening/listening.fixtures.ts",
    "frontend/web_app/src/server/modules/listening/listening.imported.ts"
  )

  $ids = New-Object System.Collections.Generic.HashSet[string]

  foreach ($sourceFile in $sourceFiles) {
    if (-not (Test-Path $sourceFile)) {
      continue
    }

    $content = Get-Content -Raw $sourceFile
    $matches = [regex]::Matches($content, 'id:\s*"([^"]+)"')

    foreach ($match in $matches) {
      [void]$ids.Add($match.Groups[1].Value)
    }
  }

  return $ids
}

$segmentsByLessonId = Get-SegmentsByLessonId $SegmentsPath
$rows = New-Object System.Collections.Generic.List[object]

foreach ($file in Get-ChildItem $GroupsPath -Filter "*.csv") {
  $categoryId = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)

  if ($categoryId -notin $allowedCategories) {
    throw "Unknown category file: $($file.Name)"
  }

  foreach ($row in Import-Csv $file.FullName) {
    if ((Get-FieldValue $row "curation_status") -notin $allowedStatuses) {
      continue
    }

    Assert-Field $row "source_url" $file.Name
    Assert-Field $row "source_title" $file.Name
    Assert-Field $row "source_name" $file.Name
    Assert-Field $row "level_hint" $file.Name
    Assert-Field $row "duration_minutes_hint" $file.Name
    Assert-Field $row "youtube_video_id" $file.Name
    Assert-Field $row "thumbnail_url" $file.Name
    Assert-Field $row "topic_bucket" $file.Name

    $level = Get-FieldValue $row "level_hint"
    $topicBucket = Get-FieldValue $row "topic_bucket"

    if ($level -notin $allowedLevels) {
      throw "Invalid level '$level' for $(Get-FieldValue $row "source_title")"
    }

    if (-not $topicLabels.ContainsKey($topicBucket)) {
      throw "Unknown topic bucket '$topicBucket' for $(Get-FieldValue $row "source_title")"
    }

    $duration = ConvertTo-PositiveInt $row "duration_minutes_hint" $file.Name
    $sourceTitle = Get-FieldValue $row "source_title"
    $youtubeVideoId = Get-FieldValue $row "youtube_video_id"
    $shortVideoId = $youtubeVideoId.Substring(0, [Math]::Min(6, $youtubeVideoId.Length)).ToLowerInvariant()
    $lessonId = "bbc-6min-$(New-Slug $sourceTitle)-$shortVideoId"
    $segments = @()

    if ($segmentsByLessonId.ContainsKey($lessonId)) {
      $segments = @($segmentsByLessonId[$lessonId])
    }

    $hasSegments = $segments.Count -gt 0
    $description = New-Description $sourceTitle $topicBucket $hasSegments
    $topic = $topicLabels[$topicBucket]
    $skillFocus = $topicSkillFocus[$topicBucket]
    $tags = @("bbc-6min", $topicBucket, (Get-FieldValue $row "priority")) |
      Where-Object { $_ -and $_.Trim() } |
      Select-Object -Unique
    $youtubeStartSeconds = if ($hasSegments) { [double]$segments[0].startSeconds } else { 0 }
    $youtubeEndSeconds = if ($hasSegments) { [double]$segments[-1].endSeconds } else { $duration * 60 }

    $rows.Add([pscustomobject]@{
      id = $lessonId
      title = @{ vi = $sourceTitle; en = $sourceTitle }
      description = $description
      categoryId = $categoryId
      source = Get-FieldValue $row "source_name"
      level = $level
      durationMinutes = $duration
      youtubeVideoId = $youtubeVideoId
      thumbnailUrl = Get-FieldValue $row "thumbnail_url"
      contentStatus = if ($hasSegments) { "READY" } else { "METADATA_ONLY" }
      externalUrl = Get-FieldValue $row "source_url"
      isNew = (Get-FieldValue $row "priority") -eq "high"
      segmentCount = $segments.Count
      skillFocus = $skillFocus
      tags = @($tags)
      topic = $topic
      youtubeStartSeconds = $youtubeStartSeconds
      youtubeEndSeconds = $youtubeEndSeconds
      transcriptSourceUrl = Get-FieldValue $row "source_url"
      segments = @($segments)
    }) | Out-Null
  }
}

$existingIds = Get-ExistingIds
$seenIds = New-Object System.Collections.Generic.HashSet[string]
$seenVideoIds = New-Object System.Collections.Generic.HashSet[string]

foreach ($lesson in $rows) {
  if ($existingIds.Contains($lesson.id)) {
    throw "Generated lesson id duplicates existing lesson: $($lesson.id)"
  }

  if (-not $seenIds.Add($lesson.id)) {
    throw "Duplicate generated lesson id: $($lesson.id)"
  }

  if (-not $seenVideoIds.Add($lesson.youtubeVideoId)) {
    throw "Duplicate generated YouTube video id: $($lesson.youtubeVideoId)"
  }
}

$json = $rows | ConvertTo-Json -Depth 30
$json = $json -replace '\\\\u', '\u'
$output = @"
import type { ListeningLessonDetail } from "./listening.types";

export const generatedListeningLessons: ListeningLessonDetail[] = $json;
"@

Set-Content -Encoding UTF8 -Path $OutputPath -Value $output
$readyCount = @($rows | Where-Object { $_.contentStatus -eq "READY" }).Count
Write-Output "generated=$OutputPath rows=$($rows.Count) ready=$readyCount"

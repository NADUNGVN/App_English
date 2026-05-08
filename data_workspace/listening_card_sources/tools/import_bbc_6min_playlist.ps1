param(
  [int]$PlaylistStart = 1,
  [int]$PlaylistEnd = 60,
  [string]$BatchCode = "bbc-6min-001",
  [string]$OutputPath = "data_workspace/listening_card_sources/groups/bbc-learning-english.csv"
)

$ErrorActionPreference = "Stop"

$playlistUrl = "https://www.youtube.com/playlist?list=PLcetZ6gSk96-FECmH9l7Vlx5VDigvgZpt"
$jsonText = & yt-dlp `
  --flat-playlist `
  --playlist-start $PlaylistStart `
  --playlist-end $PlaylistEnd `
  --dump-single-json `
  --no-warnings `
  $playlistUrl 2>$null

$playlist = $jsonText | ConvertFrom-Json

function Clean-Title([string]$title) {
  $value = $title -replace "[^\x20-\x7E]", ""
  $value = $value -replace "\s*-?\s*6\s+Minute\s+English\s*$", ""
  $value = $value -replace "\s+", " "
  return $value.Trim(" ", "-", ":")
}

function Get-Topic([string]$title) {
  $t = $title.ToLowerInvariant()

  if ($t -match "coffee|apples|\bfood\b|\brice\b|sugar|snack|breakfast|\bmeal\b|buffet|bitter|\bsalt\b") {
    return "food-consumer"
  }

  if ($t -match "sleep|health|water|brain|exercise|mood|crying|lonely|happiness|happy|anxious|jealous|teenage brain") {
    return "health-wellbeing"
  }

  if ($t -match "memory|learn|language\?|forget|read|books|schools|speak english|babies learn|subtitling") {
    return "learning-memory"
  }

  if ($t -match "social media|body language|cultural|culture|dating|little italy|sad music|young people|doomscrolling|smartphone|conversation|talking|new people|pets|secret|kisses") {
    return "society-culture"
  }

  if ($t -match "work|job|prices|future|plastic|climate|productivity") {
    return "work-future"
  }

  return "lifestyle-growth"
}

function Get-Level([string]$title, [string]$topic) {
  $t = $title.ToLowerInvariant()

  if ($topic -eq "work-future") {
    return "B2"
  }

  if ($t -match "cultural|body language|social media|dating|subtitling|doomscrolling|future|climate|plastic|procrastinate") {
    return "B2"
  }

  return "B1"
}

function Get-Priority([int]$index, [string]$topic) {
  if ($index -le 20) {
    return "high"
  }

  if ($topic -in @("health-wellbeing", "learning-memory")) {
    return "high"
  }

  if ($index -le 40) {
    return "medium"
  }

  return "low"
}

$rows = @()
$index = $PlaylistStart - 1

foreach ($entry in $playlist.entries) {
  $index += 1
  $cleanTitle = Clean-Title $entry.title
  $topic = Get-Topic $cleanTitle

  $rows += [pscustomobject]@{
    source_url = "https://www.youtube.com/watch?v=$($entry.id)"
    source_title = $cleanTitle
    source_name = "BBC Learning English"
    level_hint = Get-Level $cleanTitle $topic
    duration_minutes_hint = [Math]::Max(1, [Math]::Floor([double]$entry.duration / 60))
    youtube_video_id = $entry.id
    thumbnail_url = "https://i.ytimg.com/vi/$($entry.id)/hqdefault.jpg"
    notes = "6 Minute English playlist metadata only; review before import."
    priority = Get-Priority $index $topic
    topic_bucket = $topic
    import_batch = $BatchCode
    curation_status = "candidate"
    sort_priority = $index
  }
}

$rows | ConvertTo-Csv -NoTypeInformation | Set-Content -Encoding UTF8 $OutputPath
Write-Output "wrote=$OutputPath rows=$($rows.Count)"

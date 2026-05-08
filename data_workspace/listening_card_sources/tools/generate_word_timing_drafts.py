#!/usr/bin/env python3
"""Generate internal word-timing review drafts for listening lessons.

This script downloads/caches YouTube audio, runs Faster Whisper with
word_timestamps=True, aligns model words to the existing segment transcript,
and writes review JSON files consumed by /internal/listening-review.
"""

from __future__ import annotations

import argparse
import csv
import difflib
import json
import re
import subprocess
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Callable, Iterable


ROOT = Path(__file__).resolve().parents[1]
GROUPS_ROOT = ROOT / "groups"
SEGMENTS_ROOT = ROOT / "segments"
REVIEW_ROOT = ROOT / "review"
TMP_AUDIO_ROOT = ROOT / ".tmp" / "audio"


@dataclass
class SourceRow:
    lesson_id: str
    category_id: str
    title: str
    source_name: str
    level: str
    duration_minutes: int
    youtube_video_id: str
    source_url: str


@dataclass
class SegmentRow:
    id: str
    order: int
    speaker: str
    start_seconds: float
    end_seconds: float
    transcript: str


@dataclass
class ModelWord:
    text: str
    normalized: str
    start_seconds: float
    end_seconds: float
    confidence: float | None


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def slug(value: str, max_length: int = 44) -> str:
    output = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    if len(output) > max_length:
        output = output[:max_length].strip("-")
    return output or "lesson"


def lesson_id_for(row: dict[str, str]) -> str:
    video_id = row["youtube_video_id"].strip()
    return f"bbc-6min-{slug(row['source_title'])}-{video_id[:6].lower()}"


def normalize_token(value: str) -> str:
    value = value.lower().replace("\u2018", "'").replace("\u2019", "'")
    return re.sub(r"[^a-z0-9']", "", value)


def split_words(value: str) -> list[str]:
    return re.findall(r"\S+", value)


def emit_progress(enabled: bool, stage: str, message: str, **details: object) -> None:
    if not enabled:
        return

    print(
        json.dumps(
            {
                "type": "timing-progress",
                "stage": stage,
                "message": message,
                **details,
            }
        ),
        flush=True,
    )


def read_sources(category_id: str) -> list[SourceRow]:
    source_path = GROUPS_ROOT / f"{category_id}.csv"
    rows: list[SourceRow] = []

    with source_path.open("r", encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            if row.get("curation_status", "").strip() != "approved":
                continue
            rows.append(
                SourceRow(
                    lesson_id=lesson_id_for(row),
                    category_id=category_id,
                    title=row["source_title"].strip(),
                    source_name=row["source_name"].strip(),
                    level=row["level_hint"].strip(),
                    duration_minutes=int(row["duration_minutes_hint"].strip()),
                    youtube_video_id=row["youtube_video_id"].strip(),
                    source_url=row["source_url"].strip(),
                )
            )

    return rows


def read_segments(category_id: str) -> dict[str, list[SegmentRow]]:
    index: dict[str, list[SegmentRow]] = {}
    root = SEGMENTS_ROOT / category_id

    for path in root.glob("*.csv"):
        with path.open("r", encoding="utf-8-sig", newline="") as handle:
            for row in csv.DictReader(handle):
                if row.get("status", "").strip() != "approved":
                    continue
                lesson_id = row["lesson_id"].strip()
                segment = SegmentRow(
                    id=f"seg-{int(row['segment_order']):02d}",
                    order=int(row["segment_order"]),
                    speaker=row.get("speaker", "").strip() or "Speaker",
                    start_seconds=float(row["start_seconds"]),
                    end_seconds=float(row["end_seconds"]),
                    transcript=row["transcript"].strip(),
                )
                index.setdefault(lesson_id, []).append(segment)

    for lesson_segments in index.values():
        lesson_segments.sort(key=lambda item: item.order)

    return index


def ensure_audio(source: SourceRow) -> Path:
    TMP_AUDIO_ROOT.mkdir(parents=True, exist_ok=True)
    audio_path = TMP_AUDIO_ROOT / f"{source.youtube_video_id}.wav"

    if audio_path.exists():
        return audio_path

    command = [
        "yt-dlp",
        "-f",
        "ba",
        "-x",
        "--audio-format",
        "wav",
        "--audio-quality",
        "0",
        "-o",
        str(audio_path.with_suffix(".%(ext)s")),
        source.source_url,
    ]
    subprocess.run(command, check=True)

    if not audio_path.exists():
        raise RuntimeError(f"yt-dlp did not create {audio_path}")

    return audio_path


def transcribe_words(
    audio_path: Path,
    model_name: str,
    device: str,
    progress: Callable[[str, str], None] | None = None,
) -> list[ModelWord]:
    try:
        from faster_whisper import WhisperModel
    except ImportError as exc:
        raise RuntimeError(
            "Missing faster-whisper. Install it in the project venv before running this script."
        ) from exc

    compute_type = "float16" if device == "cuda" else "int8"
    if progress:
        progress("LOADING_MODEL", f"Loading Faster Whisper model {model_name} on {device}.")
    model = WhisperModel(model_name, device=device, compute_type=compute_type)
    if progress:
        progress("TRANSCRIBING", "Transcribing audio and collecting word timestamps.")
    segments, _info = model.transcribe(str(audio_path), word_timestamps=True)
    words: list[ModelWord] = []

    for segment in segments:
        for word in segment.words or []:
            text = word.word.strip()
            normalized = normalize_token(text)
            if not text or not normalized:
                continue
            words.append(
                ModelWord(
                    text=text,
                    normalized=normalized,
                    start_seconds=float(word.start),
                    end_seconds=float(word.end),
                    confidence=float(word.probability)
                    if word.probability is not None
                    else None,
                )
            )

    return words


def interpolate_time(
    index: int,
    transcript_words: list[str],
    assigned: dict[int, ModelWord],
    segment: SegmentRow,
) -> tuple[float, float]:
    previous_indices = [item for item in assigned if item < index]
    next_indices = [item for item in assigned if item > index]
    previous_index = max(previous_indices) if previous_indices else None
    next_index = min(next_indices) if next_indices else None

    if previous_index is not None and next_index is not None:
        previous_word = assigned[previous_index]
        next_word = assigned[next_index]
        span = max(0.08, next_word.start_seconds - previous_word.end_seconds)
        steps = next_index - previous_index
        offset = index - previous_index - 1
        start = previous_word.end_seconds + (span * offset / steps)
        end = previous_word.end_seconds + (span * (offset + 1) / steps)
        return start, max(start + 0.04, end)

    word_count = max(1, len(transcript_words))
    duration = max(0.4, segment.end_seconds - segment.start_seconds)
    start = segment.start_seconds + (duration * index / word_count)
    end = segment.start_seconds + (duration * (index + 1) / word_count)
    return start, max(start + 0.04, end)


def align_segment_words(
    segment: SegmentRow,
    model_words: list[ModelWord],
) -> list[dict[str, object]]:
    transcript_words = split_words(segment.transcript)
    transcript_tokens = [normalize_token(word) for word in transcript_words]
    window_words = [
        word
        for word in model_words
        if word.end_seconds >= segment.start_seconds - 1.2
        and word.start_seconds <= segment.end_seconds + 1.2
    ]
    model_tokens = [word.normalized for word in window_words]
    assigned: dict[int, ModelWord] = {}
    matcher = difflib.SequenceMatcher(None, transcript_tokens, model_tokens, autojunk=False)

    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag == "equal":
            for offset, transcript_index in enumerate(range(i1, i2)):
                assigned[transcript_index] = window_words[j1 + offset]
        elif tag == "replace" and (i2 - i1) == (j2 - j1):
            for offset, transcript_index in enumerate(range(i1, i2)):
                assigned[transcript_index] = window_words[j1 + offset]

    output: list[dict[str, object]] = []

    for index, word in enumerate(transcript_words):
        matched = assigned.get(index)
        if matched:
            start_seconds = matched.start_seconds
            end_seconds = matched.end_seconds
            source = "MODEL"
            confidence = matched.confidence
        else:
            start_seconds, end_seconds = interpolate_time(
                index, transcript_words, assigned, segment
            )
            source = "INTERPOLATED"
            confidence = 0

        start_seconds = max(segment.start_seconds, start_seconds)
        end_seconds = min(max(start_seconds + 0.04, end_seconds), segment.end_seconds + 0.18)

        output.append(
            {
                "index": index,
                "text": word,
                "normalized": normalize_token(word),
                "startSeconds": round(start_seconds, 3),
                "endSeconds": round(end_seconds, 3),
                "confidence": confidence,
                "source": source,
            }
        )

    return output


def write_review_document(
    source: SourceRow,
    segments: list[SegmentRow],
    model_words: list[ModelWord],
    model_name: str,
) -> Path:
    output_path = REVIEW_ROOT / source.category_id / f"{source.lesson_id}.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    timestamp = now_iso()
    document = {
        "version": 1,
        "lessonId": source.lesson_id,
        "categoryId": source.category_id,
        "youtubeVideoId": source.youtube_video_id,
        "title": {"vi": source.title, "en": source.title},
        "status": "DRAFT",
        "source": "DRAFT",
        "updatedAt": timestamp,
        "updatedBy": f"faster-whisper:{model_name}",
        "segments": [
            {
                "id": segment.id,
                "order": segment.order,
                "speaker": segment.speaker,
                "startSeconds": segment.start_seconds,
                "endSeconds": segment.end_seconds,
                "transcript": segment.transcript,
                "approved": False,
                "words": align_segment_words(segment, model_words),
            }
            for segment in segments
        ],
    }
    output_path.write_text(json.dumps(document, indent=2) + "\n", encoding="utf-8")
    return output_path


def select_sources(
    sources: Iterable[SourceRow],
    available_segments: dict[str, list[SegmentRow]],
    lesson_id: str | None,
    limit: int,
) -> list[SourceRow]:
    selected = [source for source in sources if source.lesson_id in available_segments]
    if lesson_id:
        selected = [source for source in selected if source.lesson_id == lesson_id]
    if limit > 0:
        selected = selected[:limit]
    return selected


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--category", default="bbc-learning-english")
    parser.add_argument("--lesson-id")
    parser.add_argument("--limit", type=int, default=3)
    parser.add_argument("--model", default="large-v3")
    parser.add_argument("--device", default="cuda")
    parser.add_argument("--progress-json", action="store_true")
    args = parser.parse_args()

    emit_progress(args.progress_json, "QUEUED", "Reading approved source and segment CSV files.")
    sources = read_sources(args.category)
    segments_by_lesson = read_segments(args.category)
    selected = select_sources(sources, segments_by_lesson, args.lesson_id, args.limit)

    if not selected:
        raise SystemExit("No approved segmented lessons matched the request.")

    for source in selected:
        print(f"[timing] {source.lesson_id}")
        emit_progress(
            args.progress_json,
            "PREPARING_AUDIO",
            "Preparing cached YouTube audio for timing recognition.",
            lessonId=source.lesson_id,
        )
        audio_path = ensure_audio(source)
        model_words = transcribe_words(
            audio_path,
            args.model,
            args.device,
            lambda stage, message: emit_progress(
                args.progress_json,
                stage,
                message,
                lessonId=source.lesson_id,
            ),
        )
        emit_progress(
            args.progress_json,
            "ALIGNING",
            "Aligning recognized words to the canonical transcript.",
            lessonId=source.lesson_id,
            modelWordCount=len(model_words),
        )
        emit_progress(
            args.progress_json,
            "SAVING_DRAFT",
            "Writing timing draft for review.",
            lessonId=source.lesson_id,
        )
        output_path = write_review_document(
            source,
            segments_by_lesson[source.lesson_id],
            model_words,
            args.model,
        )
        print(f"[timing] wrote {output_path}")
        emit_progress(
            args.progress_json,
            "COMPLETED",
            "Timing draft written successfully.",
            lessonId=source.lesson_id,
            outputPath=str(output_path),
        )


if __name__ == "__main__":
    main()

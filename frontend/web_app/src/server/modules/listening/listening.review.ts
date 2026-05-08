import { existsSync } from "node:fs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { HttpError } from "../../lib/httpError";
import { supabaseAdmin } from "../../lib/supabase";
import { generatedListeningLessons } from "./listening.generated";
import { timingReviewDocumentSchema } from "./listening.schemas";
import type {
  ListeningLessonDetail,
  ListeningReviewLessonSummary,
  ListeningReviewStatus,
  ListeningSegment,
  ListeningTimingReviewDocument,
  ListeningTimingReviewSegment,
  ListeningTimingReviewWord,
} from "./listening.types";

const ACTIVE_REVIEW_CATEGORY_IDS = new Set(["bbc-learning-english"]);

function resolveDataWorkspaceRoot() {
  const appRoot = process.cwd();
  const repoRootCandidate = path.resolve(appRoot, "..", "..");
  const workspaceFromRepoRoot = path.join(
    repoRootCandidate,
    "data_workspace",
    "listening_card_sources",
  );

  if (existsSync(workspaceFromRepoRoot)) {
    return workspaceFromRepoRoot;
  }

  return path.join(appRoot, "data_workspace", "listening_card_sources");
}

export const listeningReviewWorkspaceRoot = resolveDataWorkspaceRoot();
const reviewRoot = path.join(listeningReviewWorkspaceRoot, "review");
const publishedRoot = path.join(listeningReviewWorkspaceRoot, "timings");
const TIMING_DOCUMENTS_TABLE = "listening_timing_documents";

function getReviewPath(categoryId: string, lessonId: string) {
  return path.join(reviewRoot, categoryId, `${lessonId}.json`);
}

function getPublishedPath(categoryId: string, lessonId: string) {
  return path.join(publishedRoot, categoryId, `${lessonId}.json`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeToken(value: string) {
  return value
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[^a-z0-9']/g, "");
}

function splitTranscriptWords(value: string) {
  return value.match(/\S+/g) ?? [];
}

function roundTimestamp(value: number) {
  return Number(value.toFixed(3));
}

function buildFallbackWords(segment: ListeningSegment): ListeningTimingReviewWord[] {
  const words = splitTranscriptWords(segment.transcript);
  const duration = Math.max(0.4, segment.endSeconds - segment.startSeconds);
  const weights = words.map((word) => Math.max(1, normalizeToken(word).length));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0) || words.length || 1;
  let cursor = segment.startSeconds;

  return words.map((word, index) => {
    const wordDuration = (duration * weights[index]) / totalWeight;
    const startSeconds = roundTimestamp(cursor);
    const isLast = index === words.length - 1;
    const endSeconds = roundTimestamp(isLast ? segment.endSeconds : cursor + wordDuration);
    cursor = endSeconds;

    return {
      index,
      text: word,
      normalized: normalizeToken(word),
      startSeconds,
      endSeconds,
      confidence: 0,
      source: "SEGMENT_FALLBACK" as const,
    };
  });
}

function buildReviewSegment(segment: ListeningSegment): ListeningTimingReviewSegment {
  return {
    id: segment.id,
    order: segment.order,
    speaker: segment.speaker,
    startSeconds: segment.startSeconds,
    endSeconds: segment.endSeconds,
    transcript: segment.transcript,
    approved: false,
    words: segment.words?.length
      ? segment.words.map((word) => ({
          ...word,
          source: word.source === "SEGMENT_FALLBACK" ? "MANUAL" : word.source,
        }))
      : buildFallbackWords(segment),
  };
}

function getReviewStatus(document: ListeningTimingReviewDocument | null) {
  if (!document) {
    return "NEEDS_TIMING" satisfies ListeningReviewStatus;
  }

  return document.status;
}

function getActiveLessons() {
  return generatedListeningLessons.filter((lesson) =>
    ACTIVE_REVIEW_CATEGORY_IDS.has(lesson.categoryId),
  );
}

type TimingDocumentRow = {
  document: unknown;
  lesson_id: string;
  stage: "DRAFT" | "APPROVED";
  status: ListeningReviewStatus;
  updated_at?: string;
};

function mapSupabaseTimingError(error: { message?: string } | null, action: string) {
  if (!error) {
    return null;
  }

  return new HttpError(503, `Unable to ${action} listening timing documents`, {
    message: error.message,
  });
}

async function fetchTimingDocumentFromDb(
  lesson: ListeningLessonDetail,
  stage: "DRAFT" | "APPROVED",
) {
  const { data, error } = await supabaseAdmin
    .from(TIMING_DOCUMENTS_TABLE)
    .select("document,lesson_id,stage,status,updated_at")
    .eq("lesson_id", lesson.id)
    .eq("stage", stage)
    .maybeSingle<TimingDocumentRow>();

  const mappedError = mapSupabaseTimingError(error, "read");

  if (mappedError) {
    throw mappedError;
  }

  if (!data?.document) {
    return null;
  }

  return timingReviewDocumentSchema.parse(data.document) as ListeningTimingReviewDocument;
}

async function fetchTimingDocumentRowsForCategory(categoryId: string) {
  const { data, error } = await supabaseAdmin
    .from(TIMING_DOCUMENTS_TABLE)
    .select("document,lesson_id,stage,status,updated_at")
    .eq("category_id", categoryId);

  const mappedError = mapSupabaseTimingError(error, "list");

  if (mappedError) {
    throw mappedError;
  }

  return (data ?? []) as TimingDocumentRow[];
}

async function writeTimingDocumentToDb(
  document: ListeningTimingReviewDocument,
  stage: "DRAFT" | "APPROVED",
) {
  const record = {
    lesson_id: document.lessonId,
    category_id: document.categoryId,
    youtube_video_id: document.youtubeVideoId,
    stage,
    status: document.status,
    document,
    updated_by: document.updatedBy,
    approved_by: document.approvedBy ?? null,
    approved_at: document.approvedAt ?? null,
  };
  const { data, error } = await supabaseAdmin
    .from(TIMING_DOCUMENTS_TABLE)
    .upsert(record, {
      onConflict: "lesson_id,stage",
    })
    .select("document")
    .single<{ document: unknown }>();

  const mappedError = mapSupabaseTimingError(error, "write");

  if (mappedError) {
    throw mappedError;
  }

  if (!data?.document) {
    throw new HttpError(503, "Unable to write listening timing documents");
  }

  return timingReviewDocumentSchema.parse(data.document) as ListeningTimingReviewDocument;
}

export function getBaseReviewLesson(lessonId: string) {
  const lesson = getActiveLessons().find((item) => item.id === lessonId);

  if (!lesson) {
    throw new HttpError(404, "Listening review lesson not found");
  }

  return lesson;
}

async function readJsonFile(filePath: string) {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as unknown;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return null;
    }

    throw error;
  }
}

async function readReviewDocumentAt(filePath: string) {
  const payload = await readJsonFile(filePath);

  if (!payload) {
    return null;
  }

  return timingReviewDocumentSchema.parse(payload) as ListeningTimingReviewDocument;
}

async function getFileUpdatedAt(filePath: string) {
  try {
    const fileStat = await stat(filePath);
    return fileStat.mtime.toISOString();
  } catch {
    return undefined;
  }
}

function buildSeedDocument(
  lesson: ListeningLessonDetail,
): ListeningTimingReviewDocument {
  const now = new Date().toISOString();

  return {
    version: 1,
    lessonId: lesson.id,
    categoryId: lesson.categoryId,
    youtubeVideoId: lesson.youtubeVideoId,
    title: lesson.title,
    status: "NEEDS_TIMING",
    source: "DRAFT",
    updatedAt: now,
    updatedBy: "system-seed",
    segments: lesson.segments.map(buildReviewSegment),
  };
}

function normalizeReviewDocument(
  lesson: ListeningLessonDetail,
  document: ListeningTimingReviewDocument,
  options: {
    forceApproved?: boolean;
    source: "DRAFT" | "APPROVED";
    updatedBy?: string;
  },
): ListeningTimingReviewDocument {
  const now = new Date().toISOString();
  const baseSegmentsById = new Map(lesson.segments.map((segment) => [segment.id, segment]));
  const segments = document.segments.map((segment, segmentIndex) => {
    const baseSegment = baseSegmentsById.get(segment.id);
    const safeStart = roundTimestamp(segment.startSeconds);
    const safeEnd = roundTimestamp(Math.max(safeStart + 0.25, segment.endSeconds));

    return {
      id: segment.id,
      order: baseSegment?.order ?? segment.order ?? segmentIndex + 1,
      speaker: segment.speaker || baseSegment?.speaker || "Speaker",
      startSeconds: safeStart,
      endSeconds: safeEnd,
      transcript: segment.transcript.trim(),
      approved: options.forceApproved ? true : Boolean(segment.approved),
      note: segment.note?.trim() || undefined,
      words: segment.words.map((word, wordIndex) => ({
        index: wordIndex,
        text: word.text.trim(),
        normalized: word.normalized?.trim() || normalizeToken(word.text),
        startSeconds: roundTimestamp(word.startSeconds),
        endSeconds: roundTimestamp(Math.max(word.startSeconds + 0.03, word.endSeconds)),
        confidence: word.confidence,
        source:
          options.forceApproved && word.source === "SEGMENT_FALLBACK"
            ? "MANUAL"
            : word.source,
        note: word.note?.trim() || undefined,
      })),
    };
  });
  const approved = segments.every((segment) => segment.approved);

  return {
    version: 1,
    lessonId: lesson.id,
    categoryId: lesson.categoryId,
    youtubeVideoId: lesson.youtubeVideoId,
    title: lesson.title,
    status: options.forceApproved ? "APPROVED" : approved ? "DRAFT" : "DRAFT",
    source: options.source,
    updatedAt: now,
    updatedBy: options.updatedBy?.trim() || document.updatedBy || "internal-review",
    approvedAt: options.forceApproved ? now : document.approvedAt,
    approvedBy: options.forceApproved
      ? options.updatedBy?.trim() || "internal-review"
      : document.approvedBy,
    segments,
  };
}

function validateDocumentForApproval(document: ListeningTimingReviewDocument) {
  const issues: string[] = [];

  document.segments.forEach((segment) => {
    if (!segment.approved) {
      issues.push(`Segment #${segment.order} has not been approved.`);
    }

    if (segment.endSeconds <= segment.startSeconds) {
      issues.push(`Segment #${segment.order} has an invalid segment range.`);
    }

    let lastEnd = segment.startSeconds;

    segment.words.forEach((word) => {
      if (!word.text.trim()) {
        issues.push(`Segment #${segment.order} has an empty word.`);
      }

      if (word.startSeconds < segment.startSeconds - 0.25) {
        issues.push(`Word "${word.text}" starts before segment #${segment.order}.`);
      }

      if (word.endSeconds > segment.endSeconds + 0.35) {
        issues.push(`Word "${word.text}" ends after segment #${segment.order}.`);
      }

      if (word.endSeconds <= word.startSeconds) {
        issues.push(`Word "${word.text}" has an invalid time range.`);
      }

      if (word.startSeconds < lastEnd - 0.2) {
        issues.push(`Word "${word.text}" overlaps a previous word in segment #${segment.order}.`);
      }

      lastEnd = Math.max(lastEnd, word.endSeconds);
    });
  });

  if (issues.length > 0) {
    throw new HttpError(422, "Timing review document is not ready for approval", {
      issues,
    });
  }
}

async function writeReviewDocument(filePath: string, document: ListeningTimingReviewDocument) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(document, null, 2)}\n`, "utf8");
}

export function assertInternalListeningReviewAccess() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.LISTENING_REVIEW_WORKSPACE !== "enabled"
  ) {
    throw new HttpError(404, "Listening review workspace is not available");
  }
}

export async function getApprovedTimingDocument(lessonId: string) {
  const lesson = getBaseReviewLesson(lessonId);

  return fetchTimingDocumentFromDb(lesson, "APPROVED");
}

export async function tryGetApprovedTimingDocument(lessonId: string) {
  try {
    return await getApprovedTimingDocument(lessonId);
  } catch (error) {
    console.warn("[listening-timing] unable to read approved timing document", {
      error: error instanceof Error ? error.message : String(error),
      lessonId,
    });
    return null;
  }
}

export async function getTimingReviewDocument(lessonId: string) {
  const lesson = getBaseReviewLesson(lessonId);
  const draft = await fetchTimingDocumentFromDb(lesson, "DRAFT");

  if (draft) {
    return draft;
  }

  const approved = await fetchTimingDocumentFromDb(lesson, "APPROVED");

  if (approved) {
    return approved;
  }

  return buildSeedDocument(lesson);
}

export async function listTimingReviewLessons(): Promise<ListeningReviewLessonSummary[]> {
  const lessons = getActiveLessons();
  const rows = await fetchTimingDocumentRowsForCategory("bbc-learning-english");
  const rowsByLessonId = new Map<string, TimingDocumentRow[]>();

  rows.forEach((row) => {
    const existing = rowsByLessonId.get(row.lesson_id) ?? [];
    existing.push(row);
    rowsByLessonId.set(row.lesson_id, existing);
  });

  return Promise.all(
    lessons.map(async (lesson) => {
      const lessonRows = rowsByLessonId.get(lesson.id) ?? [];
      const draftRow = lessonRows.find((row) => row.stage === "DRAFT");
      const approvedRow = lessonRows.find((row) => row.stage === "APPROVED");
      const draft = draftRow?.document
        ? (timingReviewDocumentSchema.parse(
            draftRow.document,
          ) as ListeningTimingReviewDocument)
        : null;
      const approved = approvedRow?.document
        ? (timingReviewDocumentSchema.parse(
            approvedRow.document,
          ) as ListeningTimingReviewDocument)
        : null;
      const document = draft ?? approved;
      const draftSegmentCount =
        draft?.segments.filter((segment) => segment.approved).length ?? 0;
      const approvedSegmentCount =
        approved?.segments.filter((segment) => segment.approved).length ?? 0;

      return {
        id: lesson.id,
        title: lesson.title,
        categoryId: lesson.categoryId,
        source: lesson.source,
        level: lesson.level,
        durationMinutes: lesson.durationMinutes,
        youtubeVideoId: lesson.youtubeVideoId,
        thumbnailUrl: lesson.thumbnailUrl,
        segmentCount: lesson.segments.length,
        reviewStatus: getReviewStatus(document),
        approvedSegmentCount,
        draftSegmentCount,
        updatedAt: document?.updatedAt ?? draftRow?.updated_at ?? approvedRow?.updated_at,
      };
    }),
  );
}

export async function saveTimingReviewDocument(
  lessonId: string,
  input: unknown,
  updatedBy = "internal-review",
) {
  const lesson = getBaseReviewLesson(lessonId);
  const parsed = timingReviewDocumentSchema.parse(input) as ListeningTimingReviewDocument;

  if (parsed.lessonId !== lesson.id) {
    throw new HttpError(400, "Review document lesson id does not match route lesson id");
  }

  const normalized = normalizeReviewDocument(lesson, parsed, {
    source: "DRAFT",
    updatedBy,
  });

  return writeTimingDocumentToDb(normalized, "DRAFT");
}

export async function approveTimingReviewDocument(
  lessonId: string,
  updatedBy = "internal-review",
) {
  const lesson = getBaseReviewLesson(lessonId);
  const draft =
    (await fetchTimingDocumentFromDb(lesson, "DRAFT")) ??
    (await readReviewDocumentAt(getReviewPath(lesson.categoryId, lesson.id)));
  const candidate = draft ?? buildSeedDocument(lesson);
  const reviewReadyDocument = normalizeReviewDocument(lesson, candidate, {
    source: "DRAFT",
    updatedBy,
  });

  validateDocumentForApproval(reviewReadyDocument);

  const normalized = normalizeReviewDocument(lesson, reviewReadyDocument, {
    forceApproved: true,
    source: "APPROVED",
    updatedBy,
  });

  await writeTimingDocumentToDb(normalized, "APPROVED");
  await writeTimingDocumentToDb(
    {
      ...normalized,
      source: "DRAFT",
    },
    "DRAFT",
  );

  return normalized;
}

export async function getTimingReviewLessonPayload(lessonId: string) {
  const lesson = getBaseReviewLesson(lessonId);
  const document = await getTimingReviewDocument(lesson.id);

  return {
    lesson,
    document,
  };
}

export function mergeApprovedTimingIntoLesson(
  lesson: ListeningLessonDetail,
  document: ListeningTimingReviewDocument | null,
): ListeningLessonDetail {
  if (!document || document.status !== "APPROVED") {
    return lesson;
  }

  const segmentsById = new Map(document.segments.map((segment) => [segment.id, segment]));
  const segments: ListeningSegment[] = lesson.segments.map((segment) => {
    const approvedSegment = segmentsById.get(segment.id);

    if (!approvedSegment) {
      return segment;
    }

    return {
      ...segment,
      speaker: approvedSegment.speaker,
      startSeconds: approvedSegment.startSeconds,
      endSeconds: approvedSegment.endSeconds,
      transcript: approvedSegment.transcript,
      words: approvedSegment.words,
      timingQuality: {
        status: "APPROVED" as const,
        reviewedAt: document.approvedAt ?? document.updatedAt,
        reviewedBy: document.approvedBy ?? document.updatedBy,
        issueCount: approvedSegment.words.filter((word) => word.source === "INTERPOLATED")
          .length,
        wordCount: approvedSegment.words.length,
      },
    };
  });

  const startSeconds = segments[0]?.startSeconds ?? lesson.youtubeStartSeconds;
  const endSeconds = segments[segments.length - 1]?.endSeconds ?? lesson.youtubeEndSeconds;

  return {
    ...lesson,
    segments,
    youtubeStartSeconds: startSeconds,
    youtubeEndSeconds: endSeconds,
  };
}

export function coerceTimingReviewDocument(value: unknown) {
  if (!isRecord(value)) {
    throw new HttpError(400, "Invalid timing review document");
  }

  return timingReviewDocumentSchema.parse(value);
}

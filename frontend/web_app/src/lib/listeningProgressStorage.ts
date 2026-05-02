import type { DictationCheckResult } from "../server/modules/listening/listening.types";

const STORAGE_KEY = "quackup:listening-progress:v1";
const STORAGE_VERSION = 1;

export type SavedListeningPhrase = {
  id: string;
  lessonId: string;
  segmentId: string;
  phrase: string;
  transcript: string;
  timestampLabel: string;
  savedAt: string;
};

export type ListeningHistoryEntry = {
  id: string;
  lessonId: string;
  segmentId: string;
  accuracy: number;
  checkedAt: string;
};

export type ListeningProgressState = {
  version: typeof STORAGE_VERSION;
  selectedLessonId: string | null;
  segmentResults: Record<string, DictationCheckResult>;
  savedPhrases: SavedListeningPhrase[];
  history: ListeningHistoryEntry[];
};

export function createEmptyListeningProgress(): ListeningProgressState {
  return {
    version: STORAGE_VERSION,
    selectedLessonId: null,
    segmentResults: {},
    savedPhrases: [],
    history: [],
  };
}

function canUseStorage() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return Boolean(window.localStorage);
  } catch {
    return false;
  }
}

export function segmentResultKey(lessonId: string, segmentId: string) {
  return `${lessonId}:${segmentId}`;
}

export function formatTimestampLabel(startSeconds: number, endSeconds: number) {
  const format = (value: number) => {
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  return `${format(startSeconds)}-${format(endSeconds)}`;
}

export function loadListeningProgress(): ListeningProgressState {
  if (!canUseStorage()) {
    return createEmptyListeningProgress();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return createEmptyListeningProgress();
    }

    const parsed = JSON.parse(raw) as Partial<ListeningProgressState>;

    if (parsed.version !== STORAGE_VERSION) {
      return createEmptyListeningProgress();
    }

    return {
      version: STORAGE_VERSION,
      selectedLessonId: parsed.selectedLessonId ?? null,
      segmentResults: parsed.segmentResults ?? {},
      savedPhrases: Array.isArray(parsed.savedPhrases) ? parsed.savedPhrases : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return createEmptyListeningProgress();
  }
}

export function saveListeningProgress(progress: ListeningProgressState) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Local progress is best-effort until server-side persistence is available.
  }
}

export function buildSavedPhraseId(
  lessonId: string,
  segmentId: string,
  phrase: string,
) {
  return `${lessonId}:${segmentId}:${phrase
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

export function upsertSegmentResult(
  progress: ListeningProgressState,
  result: DictationCheckResult,
): ListeningProgressState {
  const key = segmentResultKey(result.lessonId, result.segmentId);
  const historyEntry: ListeningHistoryEntry = {
    id: `${key}:${result.checkedAt}`,
    lessonId: result.lessonId,
    segmentId: result.segmentId,
    accuracy: result.accuracy,
    checkedAt: result.checkedAt,
  };

  return {
    ...progress,
    selectedLessonId: result.lessonId,
    segmentResults: {
      ...progress.segmentResults,
      [key]: result,
    },
    history: [historyEntry, ...progress.history].slice(0, 20),
  };
}

export function addSavedPhrase(
  progress: ListeningProgressState,
  phrase: SavedListeningPhrase,
): ListeningProgressState {
  const exists = progress.savedPhrases.some((item) => item.id === phrase.id);

  return {
    ...progress,
    selectedLessonId: phrase.lessonId,
    savedPhrases: exists
      ? progress.savedPhrases
      : [phrase, ...progress.savedPhrases].slice(0, 50),
  };
}

import { HttpError } from "../../lib/httpError";
import { listeningCategories, listeningLessons } from "./listening.fixtures";
import type {
  DictationCheckInput,
  DictationCheckResult,
  DictationTokenFeedback,
  ListeningCatalog,
  ListeningLessonDetail,
  ListeningLevel,
  ListeningLevelFilter,
  ListeningLessonSummary,
  ListeningSegment,
} from "./listening.types";

type AlignmentStep =
  | { type: "correct"; expected: string; actual: string }
  | { type: "wrong"; expected: string; actual: string }
  | { type: "missing"; expected: string }
  | { type: "extra"; actual: string };

const LEVEL_ORDER: ListeningLevel[] = ["A1", "A2", "B1", "B2", "C1"];

type CatalogFilters = {
  categoryId?: string;
  level?: ListeningLevelFilter;
};

function toSummary(lesson: ListeningLessonDetail): ListeningLessonSummary {
  const {
    segments: _segments,
    transcriptSourceUrl: _transcriptSourceUrl,
    youtubeEndSeconds: _youtubeEndSeconds,
    youtubeStartSeconds: _youtubeStartSeconds,
    ...summary
  } = lesson;

  return summary;
}

export function listListeningLessons() {
  return listeningLessons.map(toSummary);
}

function countBy<T extends string>(
  lessons: ListeningLessonDetail[],
  getKey: (lesson: ListeningLessonDetail) => T,
) {
  const counts = {} as Record<T, number>;

  lessons.forEach((lesson) => {
    const key = getKey(lesson);
    counts[key] = (counts[key] ?? 0) + 1;
  });

  return counts;
}

function applyCatalogFilters(
  lessons: ListeningLessonDetail[],
  filters: CatalogFilters = {},
) {
  const categoryId = filters.categoryId === "all" ? undefined : filters.categoryId;
  const level = filters.level === "ALL" ? undefined : filters.level;

  return lessons.filter((lesson) => {
    const categoryMatches = categoryId ? lesson.categoryId === categoryId : true;
    const levelMatches = level ? lesson.level === level : true;

    return categoryMatches && levelMatches;
  });
}

export function getListeningCatalog(filters: CatalogFilters = {}): ListeningCatalog {
  const categoryCounts = countBy(listeningLessons, (lesson) => lesson.categoryId);
  const levelCounts = countBy(listeningLessons, (lesson) => lesson.level);
  const filteredLessons = applyCatalogFilters(listeningLessons, filters);
  const selectedCategoryId =
    filters.categoryId && filters.categoryId !== "all" ? filters.categoryId : null;
  const hasActiveFilters = Boolean(selectedCategoryId) || filters.level !== "ALL";
  const selectedCategory = selectedCategoryId
    ? listeningCategories.find((category) => category.id === selectedCategoryId)
    : null;
  const filteredSummaries = filteredLessons.map(toSummary);
  const newLessons = hasActiveFilters
    ? []
    : filteredSummaries.filter((lesson) => lesson.isNew).slice(0, 8);
  const categorySections = listeningCategories
    .filter((category) => !selectedCategory || category.id === selectedCategory.id)
    .map((category) => {
      const lessons = filteredSummaries.filter(
        (lesson) => lesson.categoryId === category.id,
      );

      return {
        id: category.id,
        title: category.label,
        categoryId: category.id,
        count: lessons.length,
        lessons,
      };
    })
    .filter((section) => section.lessons.length > 0);

  return {
    categories: listeningCategories.map((category) => ({
      ...category,
      count: categoryCounts[category.id] ?? 0,
    })),
    levels: [
      {
        id: "ALL",
        label: "All levels",
        count: listeningLessons.length,
      },
      ...LEVEL_ORDER.map((level) => ({
        id: level,
        label: level,
        count: levelCounts[level] ?? 0,
      })),
    ],
    sections: [
      ...(newLessons.length > 0
        ? [
            {
              id: "new-lessons",
              title: {
                vi: "Bài học mới",
                en: "New lessons",
              },
              categoryId: null,
              count: newLessons.length,
              lessons: newLessons,
            },
          ]
        : []),
      ...categorySections,
    ],
    totalLessons: filteredSummaries.length,
  };
}

export function getListeningLesson(lessonId: string) {
  const lesson = listeningLessons.find((item) => item.id === lessonId);

  if (!lesson) {
    throw new HttpError(404, "Listening lesson not found");
  }

  return lesson;
}

function getListeningSegment(lessonId: string, segmentId: string) {
  const lesson = getListeningLesson(lessonId);
  const segment = lesson.segments.find((item) => item.id === segmentId);

  if (!segment) {
    throw new HttpError(404, "Listening segment not found");
  }

  return segment;
}

function normalizeTokens(value: string) {
  return value
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[^a-z0-9'\s]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function alignTokens(expected: string[], actual: string[]): AlignmentStep[] {
  const rows = expected.length + 1;
  const cols = actual.length + 1;
  const costs = Array.from({ length: rows }, () => Array<number>(cols).fill(0));

  for (let row = 0; row < rows; row += 1) {
    costs[row][0] = row;
  }

  for (let col = 0; col < cols; col += 1) {
    costs[0][col] = col;
  }

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const substitutionCost = expected[row - 1] === actual[col - 1] ? 0 : 1;
      costs[row][col] = Math.min(
        costs[row - 1][col] + 1,
        costs[row][col - 1] + 1,
        costs[row - 1][col - 1] + substitutionCost,
      );
    }
  }

  const steps: AlignmentStep[] = [];
  let row = expected.length;
  let col = actual.length;

  while (row > 0 || col > 0) {
    if (
      row > 0 &&
      col > 0 &&
      expected[row - 1] === actual[col - 1] &&
      costs[row][col] === costs[row - 1][col - 1]
    ) {
      steps.push({
        type: "correct",
        expected: expected[row - 1],
        actual: actual[col - 1],
      });
      row -= 1;
      col -= 1;
      continue;
    }

    if (
      row > 0 &&
      col > 0 &&
      costs[row][col] === costs[row - 1][col - 1] + 1
    ) {
      steps.push({
        type: "wrong",
        expected: expected[row - 1],
        actual: actual[col - 1],
      });
      row -= 1;
      col -= 1;
      continue;
    }

    if (row > 0 && costs[row][col] === costs[row - 1][col] + 1) {
      steps.push({
        type: "missing",
        expected: expected[row - 1],
      });
      row -= 1;
      continue;
    }

    if (col > 0) {
      steps.push({
        type: "extra",
        actual: actual[col - 1],
      });
      col -= 1;
    }
  }

  return steps.reverse();
}

function buildTokenFeedback(steps: AlignmentStep[]): DictationTokenFeedback[] {
  return steps.map((step, index) => {
    if (step.type === "correct") {
      return {
        id: `token-${index}`,
        status: "correct",
        expected: step.expected,
        actual: step.actual,
      };
    }

    if (step.type === "wrong") {
      return {
        id: `token-${index}`,
        status: "wrong",
        expected: step.expected,
        actual: step.actual,
      };
    }

    if (step.type === "missing") {
      return {
        id: `token-${index}`,
        status: "missing",
        expected: step.expected,
      };
    }

    return {
      id: `token-${index}`,
      status: "extra",
      actual: step.actual,
    };
  });
}

function phraseWasMissed(phrase: string, answerTokens: string[]) {
  const phraseTokens = normalizeTokens(phrase);

  if (phraseTokens.length === 0) {
    return false;
  }

  return !phraseTokens.every((token) => answerTokens.includes(token));
}

function collectErrorHints(segment: ListeningSegment, answerTokens: string[]) {
  const missedHints = segment.hints.filter((hint) =>
    phraseWasMissed(hint.phrase, answerTokens),
  );

  return missedHints.length > 0 ? missedHints : segment.hints.slice(0, 1);
}

function collectRecommendedPhrases(segment: ListeningSegment, answerTokens: string[]) {
  const missedPhrases = segment.targetPhrases.filter((phrase) =>
    phraseWasMissed(phrase, answerTokens),
  );

  return missedPhrases.length > 0 ? missedPhrases : segment.targetPhrases.slice(0, 2);
}

export function checkDictation(input: DictationCheckInput): DictationCheckResult {
  const segment = getListeningSegment(input.lessonId, input.segmentId);
  const expectedTokens = normalizeTokens(segment.transcript);
  const answerTokens = normalizeTokens(input.answer);
  const steps = alignTokens(expectedTokens, answerTokens);
  const correctCount = steps.filter((step) => step.type === "correct").length;
  const accuracy =
    expectedTokens.length === 0
      ? 0
      : Math.round((correctCount / expectedTokens.length) * 100);
  const missedWords = steps
    .filter((step): step is Extract<AlignmentStep, { type: "missing" | "wrong" }> =>
      step.type === "missing" || step.type === "wrong",
    )
    .map((step) => step.expected);
  const extraWords = steps
    .filter((step): step is Extract<AlignmentStep, { type: "extra" | "wrong" }> =>
      step.type === "extra" || step.type === "wrong",
    )
    .map((step) => step.actual);

  return {
    lessonId: input.lessonId,
    segmentId: input.segmentId,
    answer: input.answer,
    transcript: segment.transcript,
    accuracy,
    isComplete: accuracy >= 92,
    tokens: buildTokenFeedback(steps),
    missedWords: [...new Set(missedWords)],
    extraWords: [...new Set(extraWords)],
    errorTypes: collectErrorHints(segment, answerTokens),
    recommendedPhrases: collectRecommendedPhrases(segment, answerTokens),
    checkedAt: new Date().toISOString(),
  };
}

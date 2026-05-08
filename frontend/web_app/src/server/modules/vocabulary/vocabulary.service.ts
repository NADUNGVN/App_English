import { HttpError } from "../../lib/httpError";
import {
  findCollectionBySlug,
  findProgress,
  findSetBySlug,
  findWordById,
  insertReviewEvent,
  listAllPublishedCollections,
  listCollections,
  listProgressByWordIds,
  listSetsByCollectionIds,
  listWordsByCollectionIds,
  listWordsBySetId,
  upsertProgress,
  type CollectionRow,
  type ProgressRow,
  type SetRow,
  type WordRow,
} from "./vocabulary.repository";
import type {
  VocabularyCategory,
  VocabularyCollectionDetail,
  VocabularyCollectionList,
  VocabularyCollectionSummary,
  VocabularyLocale,
  VocabularyReviewAnswerResult,
  VocabularyReviewItem,
  VocabularyReviewQuality,
  VocabularyReviewQueue,
  VocabularySetDetail,
  VocabularySetSummary,
  VocabularyStats,
  VocabularyStatus,
  VocabularyWord,
  VocabularyWordProgress,
} from "./vocabulary.types";

const CATEGORY_LABELS: Record<"ALL" | VocabularyCategory, string> = {
  ACADEMIC: "Học thuật",
  ALL: "Tất cả",
  GENERAL: "Tổng quát",
  IELTS: "IELTS",
  OXFORD: "Oxford",
  TOEIC: "TOEIC",
};

function localized(locale: VocabularyLocale, row: {
  title_en?: string | null;
  title_vi?: string | null;
  description_en?: string | null;
  description_vi?: string | null;
}) {
  return {
    description:
      locale === "en"
        ? row.description_en ?? row.description_vi ?? ""
        : row.description_vi ?? row.description_en ?? "",
    title: locale === "en" ? row.title_en ?? row.title_vi ?? "" : row.title_vi ?? row.title_en ?? "",
  };
}

function groupBy<T>(items: T[], getKey: (item: T) => string) {
  return items.reduce<Record<string, T[]>>((result, item) => {
    const key = getKey(item);
    result[key] = result[key] ?? [];
    result[key].push(item);
    return result;
  }, {});
}

function defaultProgress(wordId: string): ProgressRow {
  const now = new Date().toISOString();

  return {
    due_at: now,
    ease_factor: 2.5,
    interval_days: 0,
    lapses: 0,
    last_quality: null,
    last_reviewed_at: null,
    repetitions: 0,
    status: "NEW",
    user_id: "",
    word_id: wordId,
  };
}

function toProgress(row: ProgressRow | null | undefined, wordId: string): VocabularyWordProgress {
  const progress = row ?? defaultProgress(wordId);

  return {
    dueAt: progress.due_at ?? null,
    intervalDays: progress.interval_days ?? 0,
    lapses: progress.lapses ?? 0,
    lastReviewedAt: progress.last_reviewed_at ?? null,
    repetitions: progress.repetitions ?? 0,
    status: progress.status ?? "NEW",
  };
}

function isLearned(progress: ProgressRow | null | undefined) {
  return Boolean(progress && progress.status !== "NEW");
}

function isMastered(progress: ProgressRow | null | undefined) {
  return progress?.status === "MASTERED";
}

function isDue(progress: ProgressRow | null | undefined, now = Date.now()) {
  return Boolean(
    progress &&
      progress.status !== "MASTERED" &&
      new Date(progress.due_at).getTime() <= now,
  );
}

function progressPercent(masteredCount: number, totalWordCount: number) {
  return totalWordCount ? Math.round((masteredCount / totalWordCount) * 100) : 0;
}

function toWord(row: WordRow, progress: ProgressRow | null | undefined): VocabularyWord {
  return {
    audioUrl: row.audio_url,
    collocations: row.collocations ?? [],
    definitionEn: row.definition_en,
    exampleEn: row.example_en,
    exampleVi: row.example_vi,
    id: row.id,
    ipaUk: row.ipa_uk,
    ipaUs: row.ipa_us,
    meaningVi: row.meaning_vi,
    normalized: row.normalized,
    partOfSpeech: row.part_of_speech,
    progress: toProgress(progress, row.id),
    synonyms: row.synonyms ?? [],
    tags: row.tags ?? [],
    word: row.word,
  };
}

function summarizeSet(
  locale: VocabularyLocale,
  row: SetRow,
  words: WordRow[],
  progressByWordId: Map<string, ProgressRow>,
): VocabularySetSummary {
  const totalWordCount = words.length;
  const learnedCount = words.filter((word) => isLearned(progressByWordId.get(word.id))).length;
  const masteredCount = words.filter((word) => isMastered(progressByWordId.get(word.id))).length;
  const dueToday = words.filter((word) => isDue(progressByWordId.get(word.id))).length;
  const text = localized(locale, row);

  return {
    description: text.description || null,
    dueToday,
    id: row.id,
    learnedCount,
    masteredCount,
    progressPercent: progressPercent(masteredCount, totalWordCount),
    slug: row.slug,
    title: text.title,
    totalWordCount,
  };
}

function summarizeCollection(
  locale: VocabularyLocale,
  row: CollectionRow,
  sets: SetRow[],
  words: WordRow[],
  progressByWordId: Map<string, ProgressRow>,
): VocabularyCollectionSummary {
  const totalWordCount = words.length;
  const learnedCount = words.filter((word) => isLearned(progressByWordId.get(word.id))).length;
  const masteredCount = words.filter((word) => isMastered(progressByWordId.get(word.id))).length;
  const dueToday = words.filter((word) => isDue(progressByWordId.get(word.id))).length;
  const text = localized(locale, row);

  return {
    category: row.category,
    coverImageUrl: row.cover_image_url,
    description: text.description,
    dueToday,
    id: row.id,
    isPremium: row.is_premium,
    learnedCount,
    level: row.level,
    masteredCount,
    progressPercent: progressPercent(masteredCount, totalWordCount),
    setCount: sets.length,
    slug: row.slug,
    title: text.title,
    totalWordCount,
  };
}

function computeStats(words: WordRow[], progressByWordId: Map<string, ProgressRow>): VocabularyStats {
  return {
    dueToday: words.filter((word) => isDue(progressByWordId.get(word.id))).length,
    mastered: words.filter((word) => isMastered(progressByWordId.get(word.id))).length,
    totalLearned: words.filter((word) => isLearned(progressByWordId.get(word.id))).length,
  };
}

async function buildCatalogBase(userId: string, category?: VocabularyCategory) {
  const collections = await listCollections(category);
  const collectionIds = collections.map((collection) => collection.id);
  const sets = await listSetsByCollectionIds(collectionIds);
  const words = await listWordsByCollectionIds(collectionIds);
  const progressRows = await listProgressByWordIds(
    userId,
    words.map((word) => word.id),
  );
  const progressByWordId = new Map(progressRows.map((row) => [row.word_id, row]));

  return {
    collections,
    progressByWordId,
    sets,
    setsByCollectionId: groupBy(sets, (set) => set.collection_id),
    words,
    wordsByCollectionId: groupBy(words, (word) => word.collection_id),
    wordsBySetId: groupBy(words, (word) => word.set_id),
  };
}

export async function getVocabularyCollections(
  userId: string,
  locale: VocabularyLocale,
  category?: "ALL" | VocabularyCategory,
): Promise<VocabularyCollectionList> {
  const selectedCategory = category && category !== "ALL" ? category : undefined;
  const base = await buildCatalogBase(userId, selectedCategory);
  const allCollections = await listAllPublishedCollections();
  const allWords = selectedCategory
    ? await listWordsByCollectionIds(allCollections.map((collection) => collection.id))
    : base.words;
  const allProgressRows = await listProgressByWordIds(
    userId,
    allWords.map((word) => word.id),
  );
  const allProgressByWordId = new Map(allProgressRows.map((row) => [row.word_id, row]));
  const categoryCounts = allCollections.reduce<Record<string, number>>((result, item) => {
    result[item.category] = (result[item.category] ?? 0) + 1;
    return result;
  }, {});

  return {
    categories: [
      { count: allCollections.length, id: "ALL", label: CATEGORY_LABELS.ALL },
      ...(["IELTS", "TOEIC", "ACADEMIC", "OXFORD", "GENERAL"] as VocabularyCategory[]).map(
        (id) => ({
          count: categoryCounts[id] ?? 0,
          id,
          label: CATEGORY_LABELS[id],
        }),
      ),
    ],
    collections: base.collections.map((collection) =>
      summarizeCollection(
        locale,
        collection,
        base.setsByCollectionId[collection.id] ?? [],
        base.wordsByCollectionId[collection.id] ?? [],
        base.progressByWordId,
      ),
    ),
    stats: computeStats(allWords, allProgressByWordId),
  };
}

export async function getVocabularyCollection(
  userId: string,
  locale: VocabularyLocale,
  collectionSlug: string,
): Promise<VocabularyCollectionDetail> {
  const collection = await findCollectionBySlug(collectionSlug);

  if (!collection) {
    throw new HttpError(404, "Vocabulary collection not found");
  }

  const sets = await listSetsByCollectionIds([collection.id]);
  const words = await listWordsByCollectionIds([collection.id]);
  const progressRows = await listProgressByWordIds(
    userId,
    words.map((word) => word.id),
  );
  const progressByWordId = new Map(progressRows.map((row) => [row.word_id, row]));
  const wordsBySetId = groupBy(words, (word) => word.set_id);

  return {
    ...summarizeCollection(locale, collection, sets, words, progressByWordId),
    sets: sets.map((set) =>
      summarizeSet(locale, set, wordsBySetId[set.id] ?? [], progressByWordId),
    ),
  };
}

export async function getVocabularySet(
  userId: string,
  locale: VocabularyLocale,
  collectionSlug: string,
  setSlug: string,
): Promise<VocabularySetDetail> {
  const collection = await findCollectionBySlug(collectionSlug);

  if (!collection) {
    throw new HttpError(404, "Vocabulary collection not found");
  }

  const set = await findSetBySlug(collection.id, setSlug);

  if (!set) {
    throw new HttpError(404, "Vocabulary set not found");
  }

  const sets = await listSetsByCollectionIds([collection.id]);
  const collectionWords = await listWordsByCollectionIds([collection.id]);
  const words = await listWordsBySetId(set.id);
  const progressRows = await listProgressByWordIds(
    userId,
    collectionWords.map((word) => word.id),
  );
  const progressByWordId = new Map(progressRows.map((row) => [row.word_id, row]));

  return {
    ...summarizeSet(locale, set, words, progressByWordId),
    collection: summarizeCollection(locale, collection, sets, collectionWords, progressByWordId),
    words: words.map((word) => toWord(word, progressByWordId.get(word.id))),
  };
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function nextProgress(
  current: ProgressRow | null,
  userId: string,
  wordId: string,
  quality: VocabularyReviewQuality,
): ProgressRow {
  const now = new Date();
  const base = current ?? {
    ...defaultProgress(wordId),
    user_id: userId,
  };
  const previousInterval = base.interval_days ?? 0;
  const previousEase = Number(base.ease_factor ?? 2.5);
  const repetitions = base.repetitions ?? 0;
  let status: VocabularyStatus = "LEARNING";
  let easeFactor = previousEase;
  let intervalDays = previousInterval;
  let dueAt = addDays(now, 1);
  let nextRepetitions = repetitions + 1;
  let lapses = base.lapses ?? 0;

  if (quality === "AGAIN") {
    status = "LEARNING";
    easeFactor = Math.max(1.3, previousEase - 0.2);
    intervalDays = 0;
    dueAt = addMinutes(now, 10);
    nextRepetitions = 0;
    lapses += 1;
  } else if (quality === "HARD") {
    status = repetitions >= 1 ? "REVIEW" : "LEARNING";
    easeFactor = Math.max(1.3, previousEase - 0.05);
    intervalDays = Math.max(1, Math.ceil(previousInterval * 1.2));
    dueAt = addDays(now, intervalDays);
  } else if (quality === "GOOD") {
    intervalDays = previousInterval === 0 ? 1 : Math.max(previousInterval + 1, Math.round(previousInterval * previousEase));
    status = intervalDays >= 21 || nextRepetitions >= 5 ? "MASTERED" : "REVIEW";
    dueAt = addDays(now, status === "MASTERED" ? Math.max(45, intervalDays) : intervalDays);
  } else {
    easeFactor = Math.min(3.5, previousEase + 0.15);
    intervalDays = previousInterval === 0 ? 3 : Math.round(previousInterval * (easeFactor + 0.3));
    status = intervalDays >= 14 || nextRepetitions >= 4 ? "MASTERED" : "REVIEW";
    dueAt = addDays(now, status === "MASTERED" ? Math.max(60, intervalDays) : intervalDays);
  }

  return {
    due_at: dueAt.toISOString(),
    ease_factor: Number(easeFactor.toFixed(2)),
    interval_days: intervalDays,
    lapses,
    last_quality: quality,
    last_reviewed_at: now.toISOString(),
    repetitions: nextRepetitions,
    status,
    user_id: userId,
    word_id: wordId,
  };
}

export async function getVocabularyReviewQueue(
  userId: string,
  locale: VocabularyLocale,
  params: {
    collectionSlug?: string;
    limit: number;
    setSlug?: string;
  },
): Promise<VocabularyReviewQueue> {
  const collection = params.collectionSlug
    ? await findCollectionBySlug(params.collectionSlug)
    : null;

  if (params.collectionSlug && !collection) {
    throw new HttpError(404, "Vocabulary collection not found");
  }

  const set =
    collection && params.setSlug
      ? await findSetBySlug(collection.id, params.setSlug)
      : null;

  if (collection && params.setSlug && !set) {
    throw new HttpError(404, "Vocabulary set not found");
  }

  const collections = collection ? [collection] : await listAllPublishedCollections();
  const sets = set
    ? [set]
    : await listSetsByCollectionIds(collections.map((item) => item.id));
  const words = set
    ? await listWordsBySetId(set.id)
    : await listWordsByCollectionIds(collections.map((item) => item.id));
  const progressRows = await listProgressByWordIds(
    userId,
    words.map((word) => word.id),
  );
  const progressByWordId = new Map(progressRows.map((row) => [row.word_id, row]));
  const collectionById = new Map(collections.map((item) => [item.id, item]));
  const setById = new Map(sets.map((item) => [item.id, item]));
  const now = Date.now();
  const dueWords = words.filter((word) => isDue(progressByWordId.get(word.id), now));
  const newWords = words.filter((word) => !progressByWordId.has(word.id));
  const reviewWords = [...dueWords, ...newWords].slice(0, params.limit);

  return {
    items: reviewWords.map((word): VocabularyReviewItem => {
      const itemCollection = collectionById.get(word.collection_id);
      const itemSet = setById.get(word.set_id);
      const collectionText = itemCollection ? localized(locale, itemCollection) : { title: "" };
      const setText = itemSet ? localized(locale, itemSet) : { title: "" };

      return {
        ...toWord(word, progressByWordId.get(word.id)),
        collectionSlug: itemCollection?.slug ?? "",
        collectionTitle: collectionText.title,
        setSlug: itemSet?.slug ?? "",
        setTitle: setText.title,
      };
    }),
    stats: computeStats(words, progressByWordId),
  };
}

export async function submitVocabularyReviewAnswer(
  userId: string,
  input: {
    quality: VocabularyReviewQuality;
    responseMs?: number;
    wordId: string;
  },
): Promise<VocabularyReviewAnswerResult> {
  const word = await findWordById(input.wordId);

  if (!word) {
    throw new HttpError(404, "Vocabulary word not found");
  }

  const current = await findProgress(userId, input.wordId);
  const next = nextProgress(current, userId, input.wordId, input.quality);
  const saved = await upsertProgress(next);

  await insertReviewEvent({
    next_status: saved.status,
    previous_status: current?.status ?? "NEW",
    quality: input.quality,
    response_ms: input.responseMs,
    user_id: userId,
    word_id: input.wordId,
  });

  const allCollections = await listAllPublishedCollections();
  const allWords = await listWordsByCollectionIds(allCollections.map((collection) => collection.id));
  const progressRows = await listProgressByWordIds(
    userId,
    allWords.map((item) => item.id),
  );
  const progressByWordId = new Map(progressRows.map((row) => [row.word_id, row]));

  return {
    progress: toProgress(saved, input.wordId),
    stats: computeStats(allWords, progressByWordId),
  };
}

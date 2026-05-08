export type VocabularyLocale = "vi" | "en";

export type VocabularyCategory =
  | "IELTS"
  | "TOEIC"
  | "ACADEMIC"
  | "OXFORD"
  | "GENERAL";

export type VocabularyStatus = "NEW" | "LEARNING" | "REVIEW" | "MASTERED";

export type VocabularyReviewQuality = "AGAIN" | "HARD" | "GOOD" | "EASY";

export type VocabularyCollectionSummary = {
  id: string;
  slug: string;
  category: VocabularyCategory;
  level: string | null;
  title: string;
  description: string;
  coverImageUrl: string | null;
  isPremium: boolean;
  setCount: number;
  totalWordCount: number;
  learnedCount: number;
  masteredCount: number;
  dueToday: number;
  progressPercent: number;
};

export type VocabularySetSummary = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  totalWordCount: number;
  learnedCount: number;
  masteredCount: number;
  dueToday: number;
  progressPercent: number;
};

export type VocabularyWordProgress = {
  status: VocabularyStatus;
  dueAt: string | null;
  intervalDays: number;
  repetitions: number;
  lapses: number;
  lastReviewedAt: string | null;
};

export type VocabularyWord = {
  id: string;
  word: string;
  normalized: string;
  ipaUs: string | null;
  ipaUk: string | null;
  partOfSpeech: string | null;
  meaningVi: string;
  definitionEn: string;
  exampleEn: string | null;
  exampleVi: string | null;
  synonyms: string[];
  collocations: string[];
  tags: string[];
  audioUrl: string | null;
  progress: VocabularyWordProgress;
};

export type VocabularyStats = {
  totalLearned: number;
  dueToday: number;
  mastered: number;
};

export type VocabularyCollectionList = {
  categories: Array<{
    id: "ALL" | VocabularyCategory;
    label: string;
    count: number;
  }>;
  collections: VocabularyCollectionSummary[];
  stats: VocabularyStats;
};

export type VocabularyCollectionDetail = VocabularyCollectionSummary & {
  sets: VocabularySetSummary[];
};

export type VocabularySetDetail = VocabularySetSummary & {
  collection: VocabularyCollectionSummary;
  words: VocabularyWord[];
};

export type VocabularyReviewItem = VocabularyWord & {
  collectionSlug: string;
  collectionTitle: string;
  setSlug: string;
  setTitle: string;
};

export type VocabularyReviewQueue = {
  items: VocabularyReviewItem[];
  stats: VocabularyStats;
};

export type VocabularyReviewAnswerResult = {
  progress: VocabularyWordProgress;
  stats: VocabularyStats;
};

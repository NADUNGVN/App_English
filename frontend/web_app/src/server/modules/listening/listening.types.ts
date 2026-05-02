export type Locale = "vi" | "en";

export type LocalizedText = {
  vi: string;
  en: string;
};

export type ListeningLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export type ListeningLevelFilter = "ALL" | ListeningLevel;

export type ListeningCategory = {
  id: string;
  label: LocalizedText;
  isHot?: boolean;
};

export type ListeningErrorType =
  | "WEAK_SOUND"
  | "LINKING"
  | "SIMILAR_SOUND"
  | "EXACT_WORDING"
  | "UNKNOWN_PHRASE";

export type ListeningSegmentHint = {
  phrase: string;
  type: ListeningErrorType;
  explanation: LocalizedText;
};

export type ListeningVocabularyItem = {
  term: string;
  meaning: LocalizedText;
  context: string;
};

export type ListeningSegment = {
  id: string;
  order: number;
  speaker: string;
  startSeconds: number;
  endSeconds: number;
  transcript: string;
  prompt: LocalizedText;
  targetPhrases: string[];
  hints: ListeningSegmentHint[];
  vocabulary: ListeningVocabularyItem[];
};

export type ListeningLessonSummary = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  categoryId: string;
  source: string;
  level: ListeningLevel;
  durationMinutes: number;
  youtubeVideoId: string;
  thumbnailUrl: string;
  isNew?: boolean;
  segmentCount: number;
  skillFocus: LocalizedText[];
};

export type ListeningLessonDetail = ListeningLessonSummary & {
  youtubeStartSeconds: number;
  youtubeEndSeconds: number;
  transcriptSourceUrl: string;
  segments: ListeningSegment[];
};

export type ListeningCatalogCategory = ListeningCategory & {
  count: number;
};

export type ListeningCatalogLevel = {
  id: ListeningLevelFilter;
  label: string;
  count: number;
};

export type ListeningCatalogSection = {
  id: string;
  title: LocalizedText;
  categoryId: string | null;
  count: number;
  lessons: ListeningLessonSummary[];
};

export type ListeningCatalog = {
  categories: ListeningCatalogCategory[];
  levels: ListeningCatalogLevel[];
  sections: ListeningCatalogSection[];
  totalLessons: number;
};

export type DictationTokenStatus = "correct" | "missing" | "extra" | "wrong";

export type DictationTokenFeedback = {
  id: string;
  status: DictationTokenStatus;
  expected?: string;
  actual?: string;
};

export type DictationCheckInput = {
  lessonId: string;
  segmentId: string;
  answer: string;
};

export type DictationCheckResult = {
  lessonId: string;
  segmentId: string;
  answer: string;
  transcript: string;
  accuracy: number;
  isComplete: boolean;
  tokens: DictationTokenFeedback[];
  missedWords: string[];
  extraWords: string[];
  errorTypes: ListeningSegmentHint[];
  recommendedPhrases: string[];
  checkedAt: string;
};

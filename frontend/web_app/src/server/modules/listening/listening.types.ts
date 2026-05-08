export type Locale = "vi" | "en";

export type LocalizedText = {
  vi: string;
  en: string;
};

export type ListeningLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export type ListeningLevelFilter = "ALL" | ListeningLevel;

export type ListeningLessonContentStatus = "READY" | "METADATA_ONLY";

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

export type ListeningWordTimingSource =
  | "MODEL"
  | "INTERPOLATED"
  | "MANUAL"
  | "SEGMENT_FALLBACK";

export type ListeningWordTiming = {
  index: number;
  text: string;
  normalized: string;
  startSeconds: number;
  endSeconds: number;
  confidence?: number;
  source: ListeningWordTimingSource;
};

export type ListeningTimingStatus = "NONE" | "DRAFT" | "APPROVED";

export type ListeningTimingQuality = {
  status: ListeningTimingStatus;
  reviewedAt?: string;
  reviewedBy?: string;
  issueCount?: number;
  modelName?: string;
  wordCount?: number;
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
  words?: ListeningWordTiming[];
  timingQuality?: ListeningTimingQuality;
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
  contentStatus?: ListeningLessonContentStatus;
  externalUrl?: string;
  isNew?: boolean;
  segmentCount: number;
  skillFocus: LocalizedText[];
  tags?: string[];
  topic?: LocalizedText;
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

export type ListeningReviewStatus = "NEEDS_TIMING" | "DRAFT" | "APPROVED";

export type ListeningReviewLessonSummary = {
  id: string;
  title: LocalizedText;
  categoryId: string;
  source: string;
  level: ListeningLevel;
  durationMinutes: number;
  youtubeVideoId: string;
  thumbnailUrl: string;
  segmentCount: number;
  reviewStatus: ListeningReviewStatus;
  approvedSegmentCount: number;
  draftSegmentCount: number;
  updatedAt?: string;
};

export type ListeningTimingReviewWord = ListeningWordTiming & {
  note?: string;
};

export type ListeningTimingReviewSegment = {
  id: string;
  order: number;
  speaker: string;
  startSeconds: number;
  endSeconds: number;
  transcript: string;
  approved: boolean;
  note?: string;
  words: ListeningTimingReviewWord[];
};

export type ListeningTimingReviewDocument = {
  version: 1;
  lessonId: string;
  categoryId: string;
  youtubeVideoId: string;
  title: LocalizedText;
  status: ListeningReviewStatus;
  source: "DRAFT" | "APPROVED";
  updatedAt: string;
  updatedBy: string;
  approvedAt?: string;
  approvedBy?: string;
  segments: ListeningTimingReviewSegment[];
};

export type TimingRecognitionJobStatus =
  | "QUEUED"
  | "PREPARING_AUDIO"
  | "DOWNLOADING_AUDIO"
  | "LOADING_MODEL"
  | "TRANSCRIBING"
  | "ALIGNING"
  | "SAVING_DRAFT"
  | "COMPLETED"
  | "FAILED";

export type TimingRecognitionStats = {
  interpolatedWordCount: number;
  modelWordCount: number;
  segmentFallbackWordCount: number;
  totalWordCount: number;
};

export type TimingRecognitionJob = {
  device: string;
  error?: string;
  finishedAt?: string;
  jobId: string;
  lessonId: string;
  message: string;
  model: string;
  progress: number;
  startedAt: string;
  status: TimingRecognitionJobStatus;
  stats?: TimingRecognitionStats;
  stdout?: string;
  updatedAt: string;
};

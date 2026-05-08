"use client";

import {
  ArrowRight,
  BookmarkSimple,
  CaretLeft,
  CheckCircle,
  ChatsCircle,
  ClockCounterClockwise,
  Eye,
  EyeSlash,
  FilmSlate,
  Keyboard,
  ListChecks,
  MagicWand,
  MusicNotes,
  Pause,
  Play,
  Repeat,
  Sparkle,
  SpinnerGap,
  TextAa,
  WarningCircle,
  YoutubeLogo,
} from "@phosphor-icons/react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import {
  WorkspaceCanvas,
  WorkspaceSection,
} from "../../components/app/WorkspaceCanvas";
import { ErrorState, LoadingPanel } from "../../components/common/StatePanels";
import {
  WordInsightPopover,
  type WordInsightPopoverData,
} from "../../components/common/WordInsightPopover";
import {
  YouTubeSegmentPlayer,
  type YouTubePlaybackState,
  type YouTubeSegmentPlayerHandle,
} from "../../components/listening/YouTubeSegmentPlayer";
import { dictionaryEntries } from "../../data/mockContent";
import { useAppContext } from "../../hooks/useAppContext";
import {
  addSavedPhrase,
  buildSavedPhraseId,
  createEmptyListeningProgress,
  formatTimestampLabel,
  loadListeningProgress,
  saveListeningProgress,
  segmentResultKey,
  upsertSegmentResult,
  type ListeningProgressState,
} from "../../lib/listeningProgressStorage";
import { listeningRepository } from "../../repositories/listeningRepository";
import type {
  DictationCheckResult,
  DictationTokenFeedback,
  ListeningLessonDetail,
  ListeningLessonSummary,
  ListeningSegment,
  ListeningVocabularyItem,
  ListeningWordTiming,
  LocalizedText,
} from "../../server/modules/listening/listening.types";

function pickText(value: LocalizedText, locale: "vi" | "en") {
  return value[locale] ?? value.vi;
}

function getSegmentKey(lessonId: string, segmentId: string) {
  return segmentResultKey(lessonId, segmentId);
}

function getResult(
  progress: ListeningProgressState,
  lessonId: string,
  segmentId: string,
) {
  return progress.segmentResults[getSegmentKey(lessonId, segmentId)];
}

function tokenClassName(status: DictationTokenFeedback["status"]) {
  if (status === "correct") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "missing") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  if (status === "extra") {
    return "border-slate-200 bg-slate-50 text-slate-500";
  }

  return "border-rose-200 bg-rose-50 text-rose-700";
}

function tokenLabel(token: DictationTokenFeedback) {
  if (token.status === "extra") {
    return token.actual ?? "";
  }

  return token.expected ?? token.actual ?? "";
}

function timestampForSegment(segment: ListeningSegment) {
  return formatTimestampLabel(segment.startSeconds, segment.endSeconds);
}

function splitTranscriptWords(value: string) {
  return value.match(/\S+/g) ?? [];
}

function normalizeTimingToken(value: string) {
  return value
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[^a-z0-9']/g, "");
}

function roundTiming(value: number) {
  return Number(value.toFixed(3));
}

function buildFallbackTimedWords(segment: ListeningSegment): ListeningWordTiming[] {
  const words = splitTranscriptWords(segment.transcript);
  const duration = Math.max(0.4, segment.endSeconds - segment.startSeconds);
  const weights = words.map((word) => Math.max(1, normalizeTimingToken(word).length));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0) || 1;
  let cursor = segment.startSeconds;

  return words.map((word, index) => {
    const wordDuration = (duration * weights[index]) / totalWeight;
    const startSeconds = roundTiming(cursor);
    const endSeconds = roundTiming(
      index === words.length - 1 ? segment.endSeconds : cursor + wordDuration,
    );
    cursor = endSeconds;

    return {
      index,
      text: word,
      normalized: normalizeTimingToken(word),
      startSeconds,
      endSeconds,
      confidence: 0,
      source: "SEGMENT_FALLBACK" as const,
    };
  });
}

function getTimedWordsForSegment(segment: ListeningSegment) {
  return segment.words && segment.words.length > 0
    ? segment.words
    : buildFallbackTimedWords(segment);
}

function getPlaybackBounds(segment: ListeningSegment) {
  const words = segment.words?.filter((word) => word.endSeconds > word.startSeconds) ?? [];

  if (words.length === 0) {
    return {
      startSeconds: segment.startSeconds,
      endSeconds: segment.endSeconds,
    };
  }

  return {
    startSeconds: Math.max(0, words[0].startSeconds - 0.08),
    endSeconds: Math.max(words[0].startSeconds + 0.45, words[words.length - 1].endSeconds + 0.14),
  };
}

function getActiveTimedWordIndex(words: ListeningWordTiming[], currentSeconds: number) {
  if (words.length === 0) {
    return -1;
  }

  const activeIndex = words.findIndex(
    (word) => currentSeconds >= word.startSeconds && currentSeconds <= word.endSeconds,
  );

  if (activeIndex >= 0) {
    return activeIndex;
  }

  for (let index = words.length - 1; index >= 0; index -= 1) {
    if (currentSeconds > words[index].endSeconds) {
      return index;
    }
  }

  return 0;
}

function findSegmentForPlaybackTime(
  segments: ListeningSegment[],
  currentSeconds: number,
) {
  const activeSegment = segments.find(
    (segment) =>
      currentSeconds >= segment.startSeconds - 0.08 &&
      currentSeconds < segment.endSeconds + 0.08,
  );

  if (activeSegment) {
    return activeSegment;
  }

  for (let index = segments.length - 1; index >= 0; index -= 1) {
    if (currentSeconds >= segments[index].startSeconds) {
      return segments[index];
    }
  }

  return segments[0] ?? null;
}

function findSegmentVocabulary(
  vocabulary: ListeningVocabularyItem[],
  normalized: string,
) {
  return vocabulary.find(
    (item) => normalizeTimingToken(item.term) === normalized,
  );
}

function buildWordInsight(
  word: ListeningWordTiming,
  segment: ListeningSegment,
  locale: "vi" | "en",
): WordInsightPopoverData {
  const normalized = word.normalized || normalizeTimingToken(word.text);
  const segmentVocabulary = findSegmentVocabulary(segment.vocabulary, normalized);

  if (segmentVocabulary) {
    return {
      example: segmentVocabulary.context,
      meaning: pickText(segmentVocabulary.meaning, locale),
      normalized,
      sourceLabel: "Segment vocabulary",
      term: word.text,
    };
  }

  const dictionaryEntry = dictionaryEntries.find(
    (entry) => normalizeTimingToken(entry.term) === normalized,
  );

  if (dictionaryEntry) {
    return {
      example: pickText(dictionaryEntry.example, locale),
      meaning: pickText(dictionaryEntry.meaning, locale),
      normalized,
      phonetic: dictionaryEntry.phonetic,
      sourceLabel: "Dictionary",
      synonyms: dictionaryEntry.synonyms,
      term: dictionaryEntry.term,
    };
  }

  return {
    normalized,
    sourceLabel: "No dictionary entry yet",
    term: word.text,
  };
}

function getWordPopoverPosition(rect: DOMRect) {
  const margin = 16;
  const popoverWidth = Math.min(352, window.innerWidth - margin * 2);
  const estimatedHeight = 260;
  const x = Math.min(
    Math.max(margin, rect.left),
    window.innerWidth - popoverWidth - margin,
  );
  const y =
    rect.bottom + margin + estimatedHeight > window.innerHeight
      ? Math.max(margin, rect.top - estimatedHeight - 8)
      : rect.bottom + 8;

  return { x, y };
}

function maskWord(value: string) {
  return Array.from(value)
    .map((character) => (/[A-Za-z0-9]/.test(character) ? "•" : character))
    .join("");
}

function revealFirstLetter(value: string) {
  let revealed = false;

  return Array.from(value)
    .map((character) => {
      if (!/[A-Za-z0-9]/.test(character)) {
        return character;
      }

      if (!revealed) {
        revealed = true;
        return character;
      }

      return "•";
    })
    .join("");
}

function maskedPreviewForSegment(segment: ListeningSegment) {
  return splitTranscriptWords(segment.transcript)
    .map((word) => maskWord(word))
    .join(" ");
}

function useListeningProgress() {
  const [progress, setProgress] = useState<ListeningProgressState>(() =>
    createEmptyListeningProgress(),
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProgress(loadListeningProgress());
    setLoaded(true);
  }, []);

  const updateProgress = useCallback(
    (updater: (current: ListeningProgressState) => ListeningProgressState) => {
      setProgress((current) => {
        const next = updater(current);
        saveListeningProgress(next);
        return next;
      });
    },
    [],
  );

  return { loaded, progress, updateProgress };
}

function useQueryLessonId() {
  const [queryLessonId, setQueryLessonId] = useState<string | null>(null);

  useEffect(() => {
    const syncQueryLessonId = () => {
      setQueryLessonId(new URLSearchParams(window.location.search).get("lessonId"));
    };

    syncQueryLessonId();
    window.addEventListener("popstate", syncQueryLessonId);

    return () => {
      window.removeEventListener("popstate", syncQueryLessonId);
    };
  }, []);

  return queryLessonId;
}

type SegmentStatus = "idle" | "review" | "complete";

function getSegmentStatus(result?: DictationCheckResult): SegmentStatus {
  if (!result) {
    return "idle";
  }

  return result.isComplete ? "complete" : "review";
}

function statusPillClassName(status: SegmentStatus) {
  if (status === "complete") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }

  if (status === "review") {
    return "bg-amber-50 text-amber-800 ring-amber-100";
  }

  return "bg-sand-100 text-slate-500 ring-sand-200";
}

function SegmentStatusIcon({ status }: { status: SegmentStatus }) {
  if (status === "complete") {
    return <CheckCircle className="text-emerald-600" size={17} weight="bold" />;
  }

  if (status === "review") {
    return <WarningCircle className="text-amber-700" size={17} weight="duotone" />;
  }

  return (
    <ClockCounterClockwise className="text-slate-400" size={17} weight="duotone" />
  );
}

type DictationPageProps = {
  initialLessonId?: string;
};

export function DictationPage({ initialLessonId }: DictationPageProps) {
  const appContext = useAppContext() as {
    isAuthenticated: boolean;
    locale: "vi" | "en";
  };
  const { isAuthenticated } = appContext;
  const locale: "vi" | "en" = appContext.locale === "en" ? "en" : "vi";
  const queryLessonId = useQueryLessonId();
  const requestedLessonId = initialLessonId ?? queryLessonId;
  const playerRef = useRef<YouTubeSegmentPlayerHandle | null>(null);
  const answerRef = useRef<HTMLTextAreaElement | null>(null);
  const autoNextTimerRef = useRef<number | null>(null);
  const developmentNoticeTimerRef = useRef<number | null>(null);
  const trackingListRef = useRef<HTMLDivElement | null>(null);
  const trackingSegmentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { loaded: progressLoaded, progress, updateProgress } = useListeningProgress();
  const [lessons, setLessons] = useState<ListeningLessonSummary[]>([]);
  const [lesson, setLesson] = useState<ListeningLessonDetail | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [checkError, setCheckError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [playerStatus, setPlayerStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [playerPlaybackState, setPlayerPlaybackState] =
    useState<YouTubePlaybackState>("idle");
  const [sidePanel, setSidePanel] = useState<"segments" | "related">("segments");
  const [studyMode, setStudyMode] = useState<"dictation" | "tracking">("dictation");
  const [currentPlaybackSeconds, setCurrentPlaybackSeconds] = useState(0);
  const [selectedRate, setSelectedRate] = useState(1);
  const [showAllWords, setShowAllWords] = useState(false);
  const [showFirstLetters, setShowFirstLetters] = useState(false);
  const [autoNextEnabled, setAutoNextEnabled] = useState(false);
  const [revealedWordCounts, setRevealedWordCounts] = useState<
    Record<string, number>
  >({});
  const [wordInsightPopover, setWordInsightPopover] = useState<{
    insight: WordInsightPopoverData;
    x: number;
    y: number;
  } | null>(null);
  const [developmentNotice, setDevelopmentNotice] = useState("");

  const copy = {
    vi: {
      actionBack: "Thư viện nghe",
      actionCheck: "Kiểm tra câu",
      actionNext: "Câu tiếp",
      actionSave: "Lưu phrase",
      accuracy: "Độ chính xác",
      answerPlaceholder: "Điền câu đã nghe...",
      demo: "Demo listening",
      demoDescription:
        "Bạn đang dùng dữ liệu local vì đăng nhập Supabase chưa sẵn sàng.",
      empty: "Chưa có lesson listening.",
      emptyAnswer: "Hãy gõ câu bạn nghe được trước khi kiểm tra.",
      emptyFeedback:
        "Phát đoạn nghe, gõ lại câu bạn nghe được, rồi kiểm tra để xem lỗi theo từng từ.",
      extra: "Từ thừa",
      feedback: "Feedback",
      missed: "Từ cần sửa",
      noExtra: "Không có từ thừa",
      noMissing: "Không có từ thiếu",
      phrases: "Phrase đã lưu",
      playerError: "Không tải được YouTube Player. Hãy kiểm tra kết nối hoặc thử lại.",
      playerLoading: "Đang tải video nghe",
      prompt: "Nhiệm vụ",
      saved: "Đã lưu",
      segment: "Segment",
      statusComplete: "Hoàn thành",
      statusIdle: "Chưa làm",
      statusReview: "Cần sửa",
      targetPhrases: "Phrase trọng tâm",
      transcript: "Transcript chuẩn",
      vocabulary: "Từ vựng trong câu",
    },
    en: {
      actionBack: "Listening library",
      actionCheck: "Check line",
      actionNext: "Next line",
      actionSave: "Save phrase",
      accuracy: "Accuracy",
      answerPlaceholder: "Type what you heard...",
      demo: "Listening demo",
      demoDescription:
        "You are using local data because Supabase sign-in is not ready.",
      empty: "No listening lessons yet.",
      emptyAnswer: "Type what you heard before checking the line.",
      emptyFeedback:
        "Play the segment, type what you hear, then check for word-level feedback.",
      extra: "Extra words",
      feedback: "Feedback",
      missed: "Words to fix",
      noExtra: "No extra words",
      noMissing: "No missing words",
      phrases: "Saved phrases",
      playerError: "The YouTube player could not load. Check the connection and try again.",
      playerLoading: "Loading video player",
      prompt: "Task",
      saved: "Saved",
      segment: "Segment",
      statusComplete: "Complete",
      statusIdle: "Not started",
      statusReview: "Needs review",
      targetPhrases: "Target phrases",
      transcript: "Reference transcript",
      vocabulary: "Vocabulary in this line",
    },
  }[locale];

  const studyCopy = {
    vi: {
      active: "Đang học",
      audio: "Audio",
      autoNext: "Tự động tiếp",
      backFirst: "Quay lại câu đầu",
      firstLetter: "Chữ cái đầu",
      hideAll: "Ẩn tất cả",
      hideHints: "Ẩn gợi ý",
      keyboardHint: "Ctrl + Enter để kiểm tra",
      lessonSuggestions: "Gợi ý bài học",
      noRelated: "Chưa có bài gợi ý phù hợp.",
      relatedExplore: "Khám phá",
      relatedNew: "Mới",
      relatedSame: "Cùng chủ đề",
      revealNext: "Xem từ",
      showAll: "Hiện tất cả",
      showHints: "Hiện gợi ý",
      subtitle: "Phụ đề",
      tracking: "Tracking",
      video: "Video",
      wordProgress: "từ",
    },
    en: {
      active: "Active",
      audio: "Audio",
      autoNext: "Auto next",
      backFirst: "Back to first line",
      firstLetter: "First letters",
      hideAll: "Hide all",
      hideHints: "Hide hints",
      keyboardHint: "Ctrl + Enter to check",
      lessonSuggestions: "Lesson suggestions",
      noRelated: "No related lessons yet.",
      relatedExplore: "Explore",
      relatedNew: "New",
      relatedSame: "Same topic",
      revealNext: "Reveal word",
      showAll: "Show all",
      showHints: "Show hints",
      subtitle: "Subtitles",
      tracking: "Tracking",
      video: "Video",
      wordProgress: "words",
    },
  }[locale];

  useEffect(() => {
    let cancelled = false;

    setLoadingLessons(true);
    setLoadError("");

    listeningRepository
      .listLessons()
      .then((payload) => {
        if (!cancelled) {
          setLessons(payload.lessons);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(error.message ?? "Unable to load listening lessons");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingLessons(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!progressLoaded || lessons.length === 0) {
      return;
    }

    const lessonExists = (lessonId: string | null | undefined) =>
      Boolean(lessonId && lessons.some((item) => item.id === lessonId));
    const nextLessonId = lessonExists(requestedLessonId)
      ? requestedLessonId
      : lessonExists(progress.selectedLessonId)
        ? progress.selectedLessonId
        : lessons[0].id;

    if (nextLessonId && nextLessonId !== selectedLessonId) {
      setSelectedLessonId(nextLessonId);
    }
  }, [
    lessons,
    progress.selectedLessonId,
    progressLoaded,
    requestedLessonId,
    selectedLessonId,
  ]);

  useEffect(() => {
    if (!selectedLessonId) {
      return;
    }

    let cancelled = false;

    setLoadingLesson(true);
    setLoadError("");

    listeningRepository
      .getLesson(selectedLessonId)
      .then((payload) => {
        if (!cancelled) {
          const firstOpenSegment =
            payload.lesson.segments.find(
              (segment) =>
                !getResult(progress, payload.lesson.id, segment.id)?.isComplete,
            ) ?? payload.lesson.segments[0];

          setLesson(payload.lesson);
          setActiveSegmentId(firstOpenSegment?.id ?? null);
          updateProgress((current) => ({
            ...current,
            selectedLessonId,
          }));
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(error.message ?? "Unable to load listening lesson");
          setLesson(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingLesson(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedLessonId, updateProgress]);

  const activeSegment = useMemo(() => {
    if (!lesson || !activeSegmentId) {
      return null;
    }

    return lesson.segments.find((segment) => segment.id === activeSegmentId) ?? null;
  }, [activeSegmentId, lesson]);

  const activeKey =
    lesson && activeSegment ? getSegmentKey(lesson.id, activeSegment.id) : "";
  const activeResult =
    lesson && activeSegment
      ? getResult(progress, lesson.id, activeSegment.id)
      : undefined;
  const hasDraftAnswer = activeKey
    ? Object.prototype.hasOwnProperty.call(answers, activeKey)
    : false;
  const activeAnswer = activeKey
    ? hasDraftAnswer
      ? answers[activeKey] ?? ""
      : activeResult?.answer ?? ""
    : "";
  const activeAnswerWordCount = activeAnswer.trim()
    ? activeAnswer.trim().split(/\s+/).length
    : 0;
  const canCheckAnswer = activeAnswer.trim().length > 0 && !isChecking;
  const canControlPlayer = playerReady && playerStatus === "ready";
  const playerIsPlaying =
    playerPlaybackState === "playing" || playerPlaybackState === "buffering";

  const activeSegmentIndex = useMemo(() => {
    if (!lesson || !activeSegment) {
      return -1;
    }

    return lesson.segments.findIndex((segment) => segment.id === activeSegment.id);
  }, [activeSegment, lesson]);

  const lessonResults = useMemo(() => {
    if (!lesson) {
      return [];
    }

    return lesson.segments
      .map((segment) => getResult(progress, lesson.id, segment.id))
      .filter((result): result is DictationCheckResult => Boolean(result));
  }, [lesson, progress]);

  const savedPhrasesForLesson = useMemo(() => {
    if (!lesson) {
      return [];
    }

    return progress.savedPhrases.filter((phrase) => phrase.lessonId === lesson.id);
  }, [lesson, progress.savedPhrases]);

  const completedCount = useMemo(
    () => lessonResults.filter((result) => result.isComplete).length,
    [lessonResults],
  );
  const checkedCount = lessonResults.length;
  const progressPercent =
    lesson && lesson.segments.length > 0
      ? Math.round((completedCount / lesson.segments.length) * 100)
      : 0;
  const activeTranscriptWords = useMemo(
    () => (activeSegment ? splitTranscriptWords(activeSegment.transcript) : []),
    [activeSegment],
  );
  const activeTimedWords = useMemo(
    () => (activeSegment ? getTimedWordsForSegment(activeSegment) : []),
    [activeSegment],
  );
  const activeTimedWordIndex = useMemo(
    () => getActiveTimedWordIndex(activeTimedWords, currentPlaybackSeconds),
    [activeTimedWords, currentPlaybackSeconds],
  );
  const activePlaybackBounds = useMemo(
    () =>
      activeSegment
        ? getPlaybackBounds(activeSegment)
        : {
            startSeconds: 0,
            endSeconds: 0,
          },
    [activeSegment],
  );
  const hasApprovedTiming = Boolean(activeSegment?.words?.length);
  const revealedWordCount = activeKey ? revealedWordCounts[activeKey] ?? 0 : 0;
  const canRevealMoreWords = revealedWordCount < activeTranscriptWords.length;
  const relatedLessons = useMemo(() => {
    if (!lesson) {
      return [];
    }

    const sameCategory = lessons.filter(
      (item) => item.id !== lesson.id && item.categoryId === lesson.categoryId,
    );
    const fallback = lessons.filter(
      (item) => item.id !== lesson.id && item.categoryId !== lesson.categoryId,
    );

    return [...sameCategory, ...fallback].slice(0, 8);
  }, [lesson, lessons]);

  useEffect(() => {
    setShowAllWords(false);
    setShowFirstLetters(false);
    if (studyMode === "tracking" && playerIsPlaying) {
      return;
    }
    setCurrentPlaybackSeconds(activePlaybackBounds.startSeconds);
  }, [activeKey]);

  useEffect(() => {
    setWordInsightPopover(null);
  }, [activeKey, studyMode]);

  useEffect(() => {
    if (
      studyMode !== "tracking" ||
      !lesson ||
      !playerIsPlaying ||
      lesson.segments.length === 0
    ) {
      return;
    }

    const playbackSegment = findSegmentForPlaybackTime(
      lesson.segments,
      currentPlaybackSeconds,
    );

    if (playbackSegment && playbackSegment.id !== activeSegmentId) {
      setActiveSegmentId(playbackSegment.id);
    }
  }, [
    activeSegmentId,
    currentPlaybackSeconds,
    lesson,
    playerIsPlaying,
    studyMode,
  ]);

  useEffect(
    () => () => {
      if (autoNextTimerRef.current !== null) {
        window.clearTimeout(autoNextTimerRef.current);
      }
      if (developmentNoticeTimerRef.current !== null) {
        window.clearTimeout(developmentNoticeTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (studyMode !== "tracking" || !activeSegmentId) {
      return;
    }

    const list = trackingListRef.current;
    const item = trackingSegmentRefs.current[activeSegmentId];

    if (!list || !item) {
      return;
    }

    const targetTop =
      item.offsetTop - list.offsetTop - list.clientHeight * 0.36 + item.clientHeight / 2;

    list.scrollTo({
      behavior: "smooth",
      top: Math.max(0, targetTop),
    });
  }, [activeSegmentId, studyMode]);

  const clearAutoNextTimer = () => {
    if (autoNextTimerRef.current !== null) {
      window.clearTimeout(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }
  };

  const showUnderDevelopment = () => {
    if (developmentNoticeTimerRef.current !== null) {
      window.clearTimeout(developmentNoticeTimerRef.current);
    }

    setDevelopmentNotice(
      locale === "vi"
        ? "Tính năng này đang được phát triển."
        : "This feature is currently in development.",
    );
    developmentNoticeTimerRef.current = window.setTimeout(() => {
      setDevelopmentNotice("");
      developmentNoticeTimerRef.current = null;
    }, 2200);
  };

  const handleSetRate = (rate: number) => {
    setSelectedRate(rate);
    playerRef.current?.setRate(rate);
  };

  const handleSelectStudyMode = (mode: "dictation" | "tracking") => {
    setStudyMode(mode);
    setWordInsightPopover(null);

    if (mode === "dictation") {
      playerRef.current?.pause();
      setCurrentPlaybackSeconds(activePlaybackBounds.startSeconds);
    }
  };

  const handleRepeatSegment = () => {
    playerRef.current?.playSegment(selectedRate);
  };

  const handleToggleSegment = () => {
    playerRef.current?.toggleSegment(selectedRate);
  };

  const handleRevealNextWord = () => {
    if (!activeKey) {
      return;
    }

    setRevealedWordCounts((current) => ({
      ...current,
      [activeKey]: Math.min(
        (current[activeKey] ?? 0) + 1,
        activeTranscriptWords.length,
      ),
    }));
  };

  const handleRevealWordAt = (wordIndex: number) => {
    if (!activeKey) {
      return;
    }

    setRevealedWordCounts((current) => ({
      ...current,
      [activeKey]: Math.max(current[activeKey] ?? 0, wordIndex + 1),
    }));
  };

  const handleOpenWordInsight = (
    word: ListeningWordTiming,
    segment: ListeningSegment,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    const position = getWordPopoverPosition(
      event.currentTarget.getBoundingClientRect(),
    );

    setWordInsightPopover({
      insight: buildWordInsight(word, segment, locale),
      ...position,
    });
  };

  const handleAnswerChange = (value: string) => {
    if (!activeKey) {
      return;
    }

    if (checkError) {
      setCheckError("");
    }

    setAnswers((current) => ({
      ...current,
      [activeKey]: value,
    }));
  };

  const handleCheck = () => {
    if (!lesson || !activeSegment) {
      return;
    }

    const answer = activeAnswer;
    clearAutoNextTimer();
    setCheckError("");

    if (!answer.trim()) {
      setCheckError(copy.emptyAnswer);
      return;
    }

    setIsChecking(true);

    listeningRepository
      .checkDictation({
        lessonId: lesson.id,
        segmentId: activeSegment.id,
        answer,
      })
      .then((payload) => {
        setAnswers((current) => ({
          ...current,
          [getSegmentKey(payload.result.lessonId, payload.result.segmentId)]:
            payload.result.answer,
        }));
        updateProgress((current) => upsertSegmentResult(current, payload.result));

        if (autoNextEnabled && payload.result.isComplete) {
          autoNextTimerRef.current = window.setTimeout(() => {
            handleNextSegment({ playAfterChange: true });
          }, 700);
        }
      })
      .catch((error) => {
        setCheckError(error.message ?? "Unable to check answer");
      })
      .finally(() => {
        setIsChecking(false);
      });
  };

  const handleSavePhrase = (phrase: string) => {
    if (!lesson || !activeSegment) {
      return;
    }

    const savedPhrase = {
      id: buildSavedPhraseId(lesson.id, activeSegment.id, phrase),
      lessonId: lesson.id,
      segmentId: activeSegment.id,
      phrase,
      transcript: activeSegment.transcript,
      timestampLabel: timestampForSegment(activeSegment),
      savedAt: new Date().toISOString(),
    };

    updateProgress((current) => addSavedPhrase(current, savedPhrase));
  };

  const handleAnswerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();

      if (canCheckAnswer) {
        handleCheck();
      }
    }
  };

  const handleSelectSegment = (segmentId: string) => {
    clearAutoNextTimer();
    setActiveSegmentId(segmentId);
    setCheckError("");
    playerRef.current?.pause();
  };

  const handleNextSegment = (options: { playAfterChange?: boolean } = {}) => {
    if (!lesson || !activeSegment) {
      return;
    }

    clearAutoNextTimer();
    const currentIndex = lesson.segments.findIndex(
      (segment) => segment.id === activeSegment.id,
    );
    const nextSegment = lesson.segments[currentIndex + 1] ?? lesson.segments[0];

    setActiveSegmentId(nextSegment.id);
    setCheckError("");
    playerRef.current?.pause();
    window.requestAnimationFrame(() => {
      answerRef.current?.focus({ preventScroll: true });
    });

    if (options.playAfterChange) {
      autoNextTimerRef.current = window.setTimeout(() => {
        playerRef.current?.playSegment(selectedRate);
      }, 420);
    }
  };

  const statusLabel = (status: SegmentStatus) => {
    if (status === "complete") {
      return copy.statusComplete;
    }

    if (status === "review") {
      return copy.statusReview;
    }

    return copy.statusIdle;
  };

  if (loadingLessons || !progressLoaded) {
    return <LoadingPanel className="min-h-[520px]" lines={10} />;
  }

  if (loadError && !lesson) {
    return (
      <ErrorState
        actionLabel=""
        description={loadError}
        onAction={null}
        title={locale === "vi" ? "Không tải được listening" : "Listening failed to load"}
      />
    );
  }

  if (lessons.length === 0) {
    return (
      <ErrorState
        actionLabel=""
        description={copy.empty}
        onAction={null}
        title={locale === "vi" ? "Chưa có dữ liệu" : "No data"}
      />
    );
  }

  if (loadingLesson || !lesson) {
    return <LoadingPanel className="min-h-[520px]" lines={10} />;
  }

  if (!activeSegment || lesson.segments.length === 0) {
    const title = pickText(lesson.title, locale);
    const description = pickText(lesson.description, locale);
    const topic = lesson.topic ? pickText(lesson.topic, locale) : lesson.source;

    return (
      <WorkspaceCanvas className="-mx-3 -mb-4 bg-[rgb(255,252,247)] sm:-mx-4 lg:-mx-5 lg:-mb-5 xl:-mx-6">
        <div className="sticky top-0 z-10 border-b border-sand-200 bg-[rgba(255,252,247,0.96)] backdrop-blur-xl">
          <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 px-3 py-2 sm:px-4 xl:px-5">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Link
                aria-label={copy.actionBack}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sand-200 bg-white text-slate-600 transition duration-300 hover:-translate-y-[1px] hover:border-brand-200 hover:text-ink-950 active:translate-y-[1px] active:scale-[0.98]"
                href="/dictation"
              >
                <CaretLeft size={18} weight="bold" />
              </Link>
              <span className="inline-flex h-6 shrink-0 items-center rounded-[0.55rem] bg-brand-500 px-2 text-[0.7rem] font-bold text-white">
                {lesson.level}
              </span>
              <div className="min-w-0">
                <h1 className="truncate text-[0.95rem] font-semibold tracking-[-0.02em] text-ink-950 sm:text-[1rem]">
                  {title}
                </h1>
                <p className="mt-0.5 truncate text-[0.72rem] font-medium text-slate-500">
                  {lesson.source} · {lesson.durationMinutes} min · {topic}
                </p>
              </div>
            </div>

            <span className="inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 text-[0.75rem] font-semibold text-brand-800">
              <ClockCounterClockwise size={15} weight="duotone" />
              {locale === "vi" ? "Đang chuẩn bị nội dung" : "Content in preparation"}
            </span>
          </div>
        </div>

        <WorkspaceSection className="border-b border-sand-200">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1fr)] lg:items-center">
            <div className="relative overflow-hidden rounded-[1.25rem] border border-sand-200 bg-sand-100 shadow-[0_24px_58px_-42px_rgba(120,53,15,0.28)]">
              <img
                alt={`${title} thumbnail`}
                className="aspect-video h-full w-full object-cover"
                decoding="async"
                src={lesson.thumbnailUrl}
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-950/60 to-transparent" />
              <span className="absolute left-3 top-3 rounded-[0.65rem] bg-brand-500 px-2.5 py-1 text-[0.75rem] font-bold text-white">
                {lesson.level}
              </span>
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1 text-[0.75rem] font-semibold text-red-700 shadow-[0_14px_28px_-20px_rgba(127,29,29,0.35)]">
                <YoutubeLogo size={14} weight="fill" />
                {lesson.source}
              </span>
            </div>

            <div className="min-w-0">
              <p className="type-eyebrow-label">
                {locale === "vi" ? "Không gian luyện nghe" : "Listening workspace"}
              </p>
              <h2 className="mt-3 max-w-2xl text-[2rem] font-bold leading-tight tracking-[-0.035em] text-ink-950 sm:text-[2.35rem]">
                {locale === "vi"
                  ? "Nội dung dictation đang được chuẩn bị."
                  : "This dictation lesson is being prepared."}
              </h2>
              <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-slate-600">
                {description}
              </p>
              <p className="mt-3 max-w-2xl text-[0.875rem] leading-relaxed text-slate-500">
                {locale === "vi"
                  ? "Card này đã có metadata để phân loại chủ đề, cấp độ và nguồn học. Transcript, timestamp và bài tập từng câu sẽ được nối vào khi có nguồn nội dung hợp lệ."
                  : "This card already has metadata for topic, level, and source. Transcript, timestamps, and line-by-line practice will be connected when a valid content source is available."}
              </p>

              {lesson.tags && lesson.tags.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {lesson.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-sand-200 bg-white px-3 py-1 text-[0.75rem] font-semibold text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-2">
                <Link className="button-primary min-h-10 rounded-[0.95rem] px-4" href="/dictation">
                  {copy.actionBack}
                </Link>
                {lesson.externalUrl ? (
                  <a
                    className="button-secondary min-h-10 rounded-[0.95rem] px-4"
                    href={lesson.externalUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {locale === "vi" ? "Mở nguồn tham khảo" : "Open reference"}
                    <ArrowRight size={17} weight="bold" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </WorkspaceSection>

        <WorkspaceSection>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="type-eyebrow-label">{studyCopy.lessonSuggestions}</p>
              <h3 className="type-title-card mt-2">
                {locale === "vi" ? "Bài có thể học ngay" : "Ready lessons to study"}
              </h3>
            </div>
            <Link
              className="text-[0.8125rem] font-semibold text-brand-700 transition duration-300 hover:text-brand-900"
              href="/dictation"
            >
              {locale === "vi" ? "Xem tất cả" : "View all"}
            </Link>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {relatedLessons.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                className="group overflow-hidden rounded-[1rem] border border-sand-200 bg-white transition duration-300 hover:-translate-y-[1px] hover:border-brand-200 active:translate-y-[1px] active:scale-[0.99]"
                href={`/dictation/${item.id}`}
              >
                <img
                  alt={`${pickText(item.title, locale)} thumbnail`}
                  className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.035]"
                  src={item.thumbnailUrl}
                />
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-[0.45rem] bg-brand-500 px-1.5 py-0.5 text-[0.62rem] font-bold text-white">
                      {item.level}
                    </span>
                    <span className="truncate text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
                      {item.source}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[0.88rem] font-semibold leading-snug text-ink-950">
                    {pickText(item.title, locale)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </WorkspaceSection>
      </WorkspaceCanvas>
    );
  }

  const activeStatus = getSegmentStatus(activeResult);
  const nextActionLabel =
    activeSegmentIndex === lesson.segments.length - 1
      ? studyCopy.backFirst
      : copy.actionNext;
  const isTrackingMode = studyMode === "tracking";
  const lessonHasApprovedTiming = lesson.segments.some((segment) =>
    Boolean(segment.words?.length),
  );
  const playerBoundaryMode = isTrackingMode ? "continuous" : "segment";
  const playerEndSeconds = isTrackingMode
    ? lesson.youtubeEndSeconds
    : activePlaybackBounds.endSeconds;

  return (
    <WorkspaceCanvas className="-mx-3 -mb-4 bg-[rgb(255,252,247)] sm:-mx-4 lg:-mx-5 lg:-mb-5 xl:-mx-6">
      <div className="sticky top-0 z-10 border-b border-sand-200 bg-[rgba(255,252,247,0.96)] backdrop-blur-xl">
        <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 px-3 py-2 sm:px-4 xl:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Link
              aria-label={copy.actionBack}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sand-200 bg-white text-slate-600 transition duration-300 hover:-translate-y-[1px] hover:border-brand-200 hover:text-ink-950 active:translate-y-[1px] active:scale-[0.98]"
              href="/dictation"
            >
              <CaretLeft size={18} weight="bold" />
            </Link>
            <span className="inline-flex h-6 shrink-0 items-center rounded-[0.55rem] bg-brand-500 px-2 text-[0.7rem] font-bold text-white">
              {lesson.level}
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-[0.95rem] font-semibold tracking-[-0.02em] text-ink-950 sm:text-[1rem]">
                {pickText(lesson.title, locale)}
              </h1>
              <p className="mt-0.5 truncate text-[0.72rem] font-medium text-slate-500">
                {lesson.source} · {lesson.durationMinutes} min ·{" "}
                {activeSegment.order}/{lesson.segments.length}
              </p>
            </div>
            <button
              aria-label={locale === "vi" ? "Lưu bài học" : "Save lesson"}
              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition duration-300 hover:bg-white hover:text-brand-600 sm:inline-flex"
              onClick={showUnderDevelopment}
              type="button"
            >
              <BookmarkSimple size={19} weight="duotone" />
            </button>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <div className="inline-flex rounded-[0.95rem] border border-sand-200 bg-sand-100/70 p-1">
              <button
                className="inline-flex min-h-8 items-center gap-1.5 rounded-[0.75rem] px-3 text-[0.8125rem] font-semibold text-slate-500 opacity-70 transition duration-300 hover:bg-white/70 hover:text-ink-950 active:scale-[0.98]"
                onClick={showUnderDevelopment}
                type="button"
              >
                <ChatsCircle size={15} weight="duotone" />
                Shadowing
              </button>
              <button
                className={`inline-flex min-h-8 items-center gap-1.5 rounded-[0.75rem] px-3 text-[0.8125rem] font-semibold transition duration-300 ${
                  studyMode === "dictation"
                    ? "bg-white text-ink-950 shadow-[0_10px_22px_-18px_rgba(15,23,42,0.35)]"
                    : "text-slate-500 hover:bg-white/70 hover:text-ink-950"
                }`}
                onClick={() => handleSelectStudyMode("dictation")}
                type="button"
              >
                <Keyboard size={15} weight="duotone" />
                Dictation
              </button>
              <button
                className={`inline-flex min-h-8 items-center gap-1.5 rounded-[0.75rem] px-3 text-[0.8125rem] font-semibold transition duration-300 ${
                  studyMode === "tracking"
                    ? "bg-white text-ink-950 shadow-[0_10px_22px_-18px_rgba(15,23,42,0.35)]"
                    : "text-slate-500 hover:bg-white/70 hover:text-ink-950"
                }`}
                onClick={() => handleSelectStudyMode("tracking")}
                type="button"
              >
                <TextAa size={15} weight="duotone" />
                {studyCopy.tracking}
              </button>
            </div>
            <div className="inline-flex rounded-[0.95rem] border border-sand-200 bg-white p-1">
              <button
                className="inline-flex min-h-8 items-center gap-1.5 rounded-[0.75rem] bg-ink-950 px-3 text-[0.8125rem] font-semibold text-white"
                type="button"
              >
                <FilmSlate size={15} weight="duotone" />
                {studyCopy.video}
              </button>
              <button
                className="inline-flex min-h-8 items-center gap-1.5 rounded-[0.75rem] px-3 text-[0.8125rem] font-semibold text-slate-400 transition duration-300 hover:bg-sand-100 hover:text-ink-950 active:scale-[0.98]"
                onClick={showUnderDevelopment}
                type="button"
              >
                <MusicNotes size={15} weight="duotone" />
                {studyCopy.audio}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`grid min-h-[calc(100dvh-1rem)] ${
          isTrackingMode ? "" : "xl:grid-cols-[minmax(0,1fr)_24.5rem]"
        }`}
      >
        <section
          className={`min-w-0 border-b border-sand-200 xl:border-b-0 ${
            isTrackingMode
              ? "lg:grid lg:max-h-[calc(100dvh-3.5rem)] lg:grid-cols-[minmax(20rem,0.44fr)_minmax(0,0.56fr)] lg:overflow-hidden"
              : "xl:border-r"
          }`}
        >
          <div
            className={`border-b border-sand-200 bg-white/50 px-3 py-3 sm:px-5 xl:px-6 ${
              isTrackingMode ? "lg:border-b-0 lg:border-r lg:py-5" : ""
            }`}
          >
            <div
              className={`mx-auto w-full ${
                isTrackingMode ? "max-w-[30rem]" : "max-w-[32rem]"
              }`}
            >
              <YouTubeSegmentPlayer
                ref={playerRef}
                boundaryMode={playerBoundaryMode}
                endSeconds={playerEndSeconds}
                errorLabel={copy.playerError}
                loadingLabel={copy.playerLoading}
                onCurrentTimeChange={setCurrentPlaybackSeconds}
                onPlaybackStateChange={setPlayerPlaybackState}
                onReadyChange={setPlayerReady}
                onStatusChange={setPlayerStatus}
                startSeconds={activePlaybackBounds.startSeconds}
                title={pickText(lesson.title, locale)}
                videoId={lesson.youtubeVideoId}
              />

              <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                <div className="flex items-center gap-2 text-[0.8125rem] font-semibold text-slate-500">
                  <span className="font-mono text-ink-950">
                    {timestampForSegment(activeSegment)}
                  </span>
                  <span className="rounded-full bg-brand-50 px-2 py-1 text-brand-800">
                    #{activeSegment.order}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    aria-label={
                      playerIsPlaying
                        ? locale === "vi"
                          ? "Tạm dừng đoạn nghe"
                          : "Pause segment"
                        : locale === "vi"
                          ? "Phát đoạn nghe"
                          : "Play segment"
                    }
                    aria-pressed={playerIsPlaying}
                    className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-ink-950 text-white shadow-[0_18px_34px_-24px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-[1px] hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-55"
                    disabled={!canControlPlayer}
                    onClick={handleToggleSegment}
                    type="button"
                  >
                    {playerIsPlaying ? (
                      <Pause size={19} weight="bold" />
                    ) : (
                      <Play size={19} weight="fill" />
                    )}
                  </button>
                  <button
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-sand-200 bg-white text-slate-600 transition duration-300 hover:-translate-y-[1px] hover:border-brand-200 hover:text-ink-950 disabled:pointer-events-none disabled:opacity-55"
                    disabled={!canControlPlayer}
                    onClick={handleRepeatSegment}
                    type="button"
                  >
                    <Repeat size={16} weight="bold" />
                  </button>
                  <div className="inline-flex rounded-full border border-sand-200 bg-white p-1">
                    {[0.5, 0.75, 1, 1.25, 1.5].map((rate) => (
                      <button
                        key={rate}
                        className={`min-h-7 rounded-full px-2.5 text-[0.72rem] font-semibold transition duration-300 ${
                          selectedRate === rate
                            ? "bg-brand-500 text-white"
                            : "text-slate-500 hover:bg-sand-100 hover:text-ink-950"
                        }`}
                        onClick={() => handleSetRate(rate)}
                        type="button"
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!isAuthenticated && !isTrackingMode ? (
            <div className="border-b border-brand-100 bg-brand-50 px-4 py-3 text-[0.8125rem] leading-relaxed text-brand-800">
              <p className="font-semibold text-brand-900">{copy.demo}</p>
              <p className="mt-1 text-brand-700">{copy.demoDescription}</p>
            </div>
          ) : null}

          <WorkspaceSection
            className={`border-b border-sand-200 bg-[rgb(255,252,247)] ${
              isTrackingMode ? "min-h-0 border-b-0 !p-0 lg:h-full" : ""
            }`}
          >
            {studyMode === "tracking" ? (
              <div className="flex h-full min-h-0 flex-col">
                <div className="border-b border-sand-200 px-4 py-3 sm:px-5">
                  <p className="type-eyebrow-label">Tracking</p>
                  <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-[1rem] font-semibold tracking-[-0.03em] text-ink-950">
                      {lessonHasApprovedTiming
                        ? locale === "vi"
                          ? "Theo dõi từng từ theo video"
                          : "Follow every word in sync"
                        : locale === "vi"
                          ? "Timing tạm từ phân đoạn"
                          : "Temporary segment timing"}
                    </h3>
                    <span className="rounded-full bg-sand-100 px-3 py-1 font-mono text-[0.75rem] font-semibold text-ink-950">
                      {currentPlaybackSeconds.toFixed(2)}s
                    </span>
                  </div>
                </div>

                <div
                  ref={trackingListRef}
                  className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 lg:max-h-[calc(100dvh-10.5rem)]"
                >
                  <div className="grid gap-3">
                    {lesson.segments.map((segment) => {
                      const segmentWords = getTimedWordsForSegment(segment);
                      const activeLine = segment.id === activeSegment.id;
                      const segmentActiveWordIndex = activeLine
                        ? getActiveTimedWordIndex(
                            segmentWords,
                            currentPlaybackSeconds,
                          )
                        : -1;
                      const pastLine = currentPlaybackSeconds > segment.endSeconds + 0.08;

                      return (
                        <div
                          key={segment.id}
                          ref={(node) => {
                            trackingSegmentRefs.current[segment.id] = node;
                          }}
                          className={`rounded-[1rem] border p-3.5 transition duration-300 ${
                            activeLine
                              ? "border-brand-300 bg-brand-50/85 shadow-[0_18px_34px_-30px_rgba(120,53,15,0.28)]"
                              : pastLine
                                ? "border-sand-200 bg-white/55 opacity-70"
                                : "border-sand-200 bg-white/78"
                          }`}
                        >
                          <div className="mb-2.5 flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-2">
                              <span
                                className={`h-3 w-3 shrink-0 rounded-full border ${
                                  activeLine
                                    ? "border-brand-500 bg-brand-500"
                                    : pastLine
                                      ? "border-slate-300 bg-slate-300"
                                      : "border-slate-300 bg-white"
                                }`}
                              />
                              <span className="font-mono text-[0.78rem] font-semibold text-ink-950">
                                #{segment.order}
                              </span>
                              <span className="truncate text-[0.72rem] font-semibold text-slate-400">
                                {timestampForSegment(segment)}
                              </span>
                              {activeLine ? (
                                <span className="rounded-[0.45rem] bg-white px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-brand-700">
                                  {studyCopy.active}
                                </span>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-x-2 gap-y-2">
                            {segmentWords.map((word, index) => {
                              const active =
                                activeLine && index === segmentActiveWordIndex;
                              const passed = activeLine
                                ? index < segmentActiveWordIndex
                                : pastLine;

                              return (
                                <button
                                  key={`${segment.id}-tracking-${word.index}-${word.text}`}
                                  className={`relative min-h-8 rounded-[0.7rem] border px-2.5 text-[0.88rem] font-semibold transition duration-300 active:scale-[0.98] ${
                                    active
                                      ? "border-brand-300 bg-white text-brand-950 shadow-[0_14px_28px_-24px_rgba(120,53,15,0.32)]"
                                      : passed
                                        ? "border-sand-200 bg-sand-100/72 text-slate-500"
                                        : "border-transparent bg-transparent text-ink-950 hover:bg-sand-100/70"
                                  }`}
                                  onClick={(event) =>
                                    handleOpenWordInsight(word, segment, event)
                                  }
                                  type="button"
                                >
                                  {active ? (
                                    <span className="absolute inset-x-2 bottom-1 h-0.5 rounded-full bg-brand-500" />
                                  ) : null}
                                  <span className="relative">{word.text}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!lessonHasApprovedTiming ? (
                    <p className="mt-4 rounded-[0.85rem] border border-amber-200 bg-amber-50 px-3 py-2 text-[0.75rem] font-semibold leading-relaxed text-amber-800">
                      {locale === "vi"
                        ? "Bài này chưa có word timing đã duyệt. Tracking đang dùng ước lượng từ phân đoạn."
                        : "This lesson has no approved word timing yet. Tracking is estimated from the segment range."}
                    </p>
                  ) : null}
                </div>

                <div className="hidden">
                <div className="hidden">
                  <div>
                    <p className="type-eyebrow-label">Karaoke tracking</p>
                    <h3 className="mt-1 text-[1.08rem] font-semibold tracking-[-0.03em] text-ink-950">
                      {hasApprovedTiming
                        ? locale === "vi"
                          ? "Theo dõi từng từ theo video"
                          : "Follow every word in sync"
                        : locale === "vi"
                          ? "Timing tạm từ segment"
                          : "Temporary segment timing"}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[0.78rem] font-semibold text-slate-500">
                    <span className="rounded-full bg-sand-100 px-3 py-1 font-mono text-ink-950">
                      {currentPlaybackSeconds.toFixed(2)}s
                    </span>
                    <button
                      className="button-secondary min-h-9 rounded-[0.85rem] px-3 disabled:pointer-events-none disabled:opacity-55"
                      disabled={!canControlPlayer}
                      onClick={handleRepeatSegment}
                      type="button"
                    >
                      <Repeat size={16} weight="bold" />
                      {locale === "vi" ? "Nghe lại" : "Replay"}
                    </button>
                    <button
                      className="button-primary min-h-9 rounded-[0.85rem] px-3"
                      onClick={() => handleNextSegment()}
                      type="button"
                    >
                      {nextActionLabel}
                      <ArrowRight size={17} weight="bold" />
                    </button>
                  </div>
                </div>

                <div className="rounded-[1.1rem] border border-sand-200 bg-white/76 p-4 shadow-[0_18px_34px_-32px_rgba(120,53,15,0.2)] sm:p-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    {activeTimedWords.map((word, index) => {
                      const active = index === activeTimedWordIndex;
                      const passed = index < activeTimedWordIndex;

                      return (
                        <button
                          key={`${activeKey}-tracking-${word.index}-${word.text}`}
                          className={`relative min-h-10 rounded-[0.85rem] border px-3 text-[0.95rem] font-semibold transition duration-300 active:scale-[0.98] ${
                            active
                              ? "border-brand-300 bg-brand-50 text-brand-950 shadow-[0_16px_34px_-28px_rgba(120,53,15,0.34)]"
                              : passed
                                ? "border-sand-200 bg-sand-100/72 text-slate-500"
                                : "border-transparent bg-transparent text-ink-950 hover:bg-sand-100/70"
                          }`}
                          onClick={(event) =>
                            handleOpenWordInsight(word, activeSegment, event)
                          }
                          type="button"
                        >
                          {active ? (
                            <span className="absolute inset-x-2 bottom-1 h-0.5 rounded-full bg-brand-500" />
                          ) : null}
                          <span className="relative">{word.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {!hasApprovedTiming ? (
                    <p className="mt-4 rounded-[0.85rem] border border-amber-200 bg-amber-50 px-3 py-2 text-[0.75rem] font-semibold leading-relaxed text-amber-800">
                      {locale === "vi"
                        ? "Bai nay chua co word timing da duyet. Tracking dang dung uoc luong tu segment."
                        : "This lesson has no approved word timing yet. Tracking is estimated from the segment range."}
                    </p>
                  ) : null}
                </div>
                </div>
              </div>
            ) : (
            <div className="grid gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-[0.8125rem] font-semibold text-slate-500">
                  <span className="inline-flex h-9 items-center rounded-full bg-sand-100 px-3 font-mono text-ink-950">
                    #{activeSegment.order}
                  </span>
                  <span>
                    {activeAnswerWordCount}/{activeTranscriptWords.length}{" "}
                    {studyCopy.wordProgress}
                  </span>
                  <span className="hidden rounded-[0.55rem] border border-sand-200 bg-white px-2 py-1 text-[0.72rem] text-slate-500 sm:inline-flex">
                    <Keyboard size={13} weight="duotone" />
                    <span className="ml-1">{studyCopy.keyboardHint}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    aria-pressed={autoNextEnabled}
                    className={`inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-[0.75rem] font-semibold transition duration-300 hover:border-brand-200 hover:text-ink-950 active:scale-[0.98] ${
                      autoNextEnabled
                        ? "border-brand-200 bg-brand-50 text-brand-800"
                        : "border-sand-200 bg-white text-slate-600"
                    }`}
                    onClick={() => {
                      clearAutoNextTimer();
                      setAutoNextEnabled((current) => !current);
                    }}
                    type="button"
                  >
                    <MagicWand size={14} weight="duotone" />
                    {studyCopy.autoNext}
                    <span
                      className={`relative h-4 w-7 rounded-full transition duration-300 ${
                        autoNextEnabled ? "bg-brand-500" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform duration-300 ${
                          autoNextEnabled ? "translate-x-3.5" : "translate-x-0.5"
                        }`}
                      />
                    </span>
                  </button>
                </div>
              </div>

              <label className="field-shell">
                <textarea
                  ref={answerRef}
                  className="field-input min-h-[6.25rem] resize-y rounded-[1rem] text-[1rem] font-medium"
                  onKeyDown={handleAnswerKeyDown}
                  onChange={(event) => handleAnswerChange(event.target.value)}
                  placeholder={copy.answerPlaceholder}
                  value={activeAnswer}
                />
              </label>

              {checkError ? (
                <div className="rounded-[1rem] bg-rose-50 px-3.5 py-3 text-[0.8125rem] leading-relaxed text-rose-700">
                  {checkError}
                </div>
              ) : null}

              <div className="grid gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-slate-500">
                    <Eye size={15} weight="duotone" />
                    {locale === "vi" ? "Nhấn để xem" : "Tap to reveal"}
                  </p>
                  <button
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] font-semibold text-slate-500 transition duration-300 hover:bg-white hover:text-ink-950"
                    onClick={() => setShowAllWords((current) => !current)}
                    type="button"
                  >
                    {showAllWords ? (
                      <EyeSlash size={14} weight="duotone" />
                    ) : (
                      <Eye size={14} weight="duotone" />
                    )}
                    {showAllWords ? studyCopy.hideAll : studyCopy.showAll}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeTranscriptWords.map((word, index) => {
                    const revealed = showAllWords || index < revealedWordCount;
                    const displayWord = revealed
                      ? word
                      : showFirstLetters
                        ? revealFirstLetter(word)
                        : maskWord(word);

                    return (
                      <button
                        key={`${activeKey}-${word}-${index}`}
                        className={`min-h-10 rounded-[0.7rem] border px-3 text-[0.9rem] font-semibold transition duration-300 active:scale-[0.98] ${
                          revealed
                            ? "border-brand-200 bg-white text-ink-950 shadow-[0_14px_28px_-24px_rgba(120,53,15,0.28)]"
                            : "border-sand-200 bg-sand-100/80 text-slate-500 hover:border-brand-200 hover:bg-white"
                        }`}
                        onClick={() => handleRevealWordAt(index)}
                        title={revealed ? word : undefined}
                        type="button"
                      >
                        {displayWord}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`button-secondary min-h-9 rounded-[0.85rem] px-3 ${
                        showFirstLetters ? "border-brand-200 text-ink-950" : ""
                      }`}
                      onClick={() => setShowFirstLetters((current) => !current)}
                      type="button"
                    >
                      <TextAa size={16} weight="duotone" />
                      {studyCopy.firstLetter}
                    </button>
                    <button
                      className="button-secondary min-h-9 rounded-[0.85rem] px-3 disabled:pointer-events-none disabled:opacity-55"
                      disabled={!canRevealMoreWords}
                      onClick={handleRevealNextWord}
                      type="button"
                    >
                      <Eye size={16} weight="duotone" />
                      {studyCopy.revealNext}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      className="button-secondary min-h-10 rounded-[0.95rem] px-3.5 disabled:pointer-events-none disabled:opacity-55"
                      disabled={!canCheckAnswer}
                      onClick={handleCheck}
                      type="button"
                    >
                      {isChecking ? (
                        <SpinnerGap className="animate-spin" size={18} weight="bold" />
                      ) : (
                        <CheckCircle size={18} weight="bold" />
                      )}
                      {copy.actionCheck}
                    </button>
                    <button
                      className="button-primary min-h-10 rounded-[0.95rem] px-4"
                      onClick={() => handleNextSegment()}
                      type="button"
                    >
                      {nextActionLabel}
                      <ArrowRight size={18} weight="bold" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}
          </WorkspaceSection>

          <WorkspaceSection
            className={activeResult && studyMode === "dictation" ? "" : "hidden"}
          >
            <div className="grid gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="type-eyebrow-label">{copy.feedback}</p>
                  <h3 className="type-title-card mt-2">
                    {activeResult
                      ? `${copy.accuracy}: ${activeResult.accuracy}%`
                      : locale === "vi"
                        ? "Nghe trước, kiểm tra sau"
                        : "Listen first, then check."}
                  </h3>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusPillClassName(
                    activeStatus,
                  )}`}
                >
                  {statusLabel(activeStatus)}
                </span>
              </div>

              {activeResult ? (
                <>
                  <div className="flex flex-wrap gap-2">
                    {activeResult.tokens.map((token) => (
                      <span
                        key={token.id}
                        className={`rounded-xl border px-3 py-1.5 text-sm font-semibold ${tokenClassName(
                          token.status,
                        )}`}
                        title={
                          token.status === "wrong" && token.actual
                            ? `${token.actual} -> ${token.expected}`
                            : token.status
                        }
                      >
                        {tokenLabel(token)}
                      </span>
                    ))}
                  </div>

                  <div className="grid gap-3 lg:grid-cols-3">
                    <div className="rounded-[1rem] border border-sand-200 bg-white/65 p-3.5">
                      <p className="type-eyebrow-muted">{copy.missed}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {activeResult.missedWords.length > 0 ? (
                          activeResult.missedWords.map((word) => (
                            <span
                              key={word}
                              className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-800"
                            >
                              {word}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-500">
                            {copy.noMissing}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="rounded-[1rem] border border-sand-200 bg-white/65 p-3.5">
                      <p className="type-eyebrow-muted">{copy.extra}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {activeResult.extraWords.length > 0 ? (
                          activeResult.extraWords.map((word) => (
                            <span
                              key={word}
                              className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600"
                            >
                              {word}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-500">
                            {copy.noExtra}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="rounded-[1rem] border border-sand-200 bg-white/65 p-3.5">
                      <p className="type-eyebrow-muted">{copy.transcript}</p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {activeResult.transcript}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[1rem] border border-sage-100 bg-sage-100/55 p-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="type-eyebrow-label text-sage-700">
                          Shadowing bridge
                        </p>
                        <p className="mt-2 text-[0.8125rem] leading-relaxed text-slate-600">
                          {activeResult.errorTypes
                            .map((hint) => pickText(hint.explanation, locale))
                            .join(" ")}
                        </p>
                      </div>
                      <button
                        className="button-secondary rounded-[0.95rem] bg-white disabled:pointer-events-none disabled:opacity-55"
                        disabled={!canControlPlayer}
                        onClick={() => playerRef.current?.playSegment(0.75)}
                        type="button"
                      >
                        <ChatsCircle size={18} weight="duotone" />
                        {locale === "vi" ? "Nghe chậm và nói theo" : "Play slow and speak"}
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {activeResult.recommendedPhrases.map((phrase) => {
                        const phraseId = buildSavedPhraseId(
                          lesson.id,
                          activeSegment.id,
                          phrase,
                        );
                        const isSaved = savedPhrasesForLesson.some(
                          (item) => item.id === phraseId,
                        );

                        return (
                          <button
                            key={phrase}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.8125rem] font-semibold transition duration-300 active:scale-[0.98] ${
                              isSaved
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-sand-200 bg-white text-slate-600 hover:border-brand-200 hover:text-ink-950"
                            }`}
                            onClick={() => handleSavePhrase(phrase)}
                            type="button"
                          >
                            <BookmarkSimple size={16} weight="bold" />
                            {isSaved ? copy.saved : copy.actionSave}: {phrase}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </WorkspaceSection>
        </section>

        {!isTrackingMode ? (
        <aside className="min-w-0 bg-white/40 xl:sticky xl:top-14 xl:max-h-[calc(100dvh-3.5rem)] xl:overflow-y-auto">
          <div className="border-b border-sand-200 px-4 py-3">
            <div className="flex gap-2">
              <button
                className={`inline-flex min-h-9 items-center gap-2 border-b-2 px-2 text-[0.8125rem] font-semibold transition duration-300 ${
                  sidePanel === "segments"
                    ? "border-brand-500 text-ink-950"
                    : "border-transparent text-slate-500 hover:text-ink-950"
                }`}
                onClick={() => setSidePanel("segments")}
                type="button"
              >
                <ListChecks size={16} weight="duotone" />
                {studyCopy.subtitle}
              </button>
              <button
                className={`inline-flex min-h-9 items-center gap-2 border-b-2 px-2 text-[0.8125rem] font-semibold transition duration-300 ${
                  sidePanel === "related"
                    ? "border-brand-500 text-ink-950"
                    : "border-transparent text-slate-500 hover:text-ink-950"
                }`}
                onClick={() => setSidePanel("related")}
                type="button"
              >
                <Sparkle size={16} weight="duotone" />
                {studyCopy.lessonSuggestions}
              </button>
            </div>
          </div>

          {sidePanel === "segments" ? (
            <div className="px-4 py-4">
              <div className="mb-4">
                <div className="flex items-center justify-between gap-3 text-[0.8125rem] font-semibold text-slate-500">
                  <span>
                    {checkedCount}/{lesson.segments.length}
                  </span>
                  <span className="text-ink-950">{progressPercent}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand-100">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-2.5">
                {lesson.segments.map((segment) => {
                  const result = getResult(progress, lesson.id, segment.id);
                  const status = getSegmentStatus(result);
                  const active = segment.id === activeSegment.id;

                  return (
                    <button
                      key={segment.id}
                      className={`rounded-[1rem] border p-3 text-left transition duration-300 active:scale-[0.99] ${
                        active
                          ? "border-brand-300 bg-brand-50 shadow-[0_18px_34px_-30px_rgba(120,53,15,0.35)]"
                          : "border-sand-200 bg-white/65 hover:border-brand-200"
                      }`}
                      onClick={() => handleSelectSegment(segment.id)}
                      type="button"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={`h-4 w-4 shrink-0 rounded-full border ${
                              active
                                ? "border-brand-500 bg-brand-500"
                                : "border-slate-300 bg-white"
                            }`}
                          />
                          <span className="font-mono text-[0.8125rem] font-semibold text-ink-950">
                            #{segment.order}
                          </span>
                          {active ? (
                            <span className="rounded-[0.45rem] bg-white px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-brand-700">
                              {studyCopy.active}
                            </span>
                          ) : null}
                        </div>
                        <SegmentStatusIcon status={status} />
                      </div>
                      <p className="mt-3 line-clamp-2 text-[0.78rem] font-semibold leading-relaxed text-slate-500">
                        {showAllWords ? segment.transcript : maskedPreviewForSegment(segment)}
                      </p>
                      {result ? (
                        <p className="mt-2 font-mono text-xs font-semibold text-slate-500">
                          {result.accuracy}% · {timestampForSegment(segment)}
                        </p>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="px-4 py-4">
              <div className="mb-4 flex flex-wrap gap-2">
                {[studyCopy.relatedSame, studyCopy.relatedExplore, studyCopy.relatedNew].map(
                  (label, index) => (
                    <span
                      key={label}
                      className={`rounded-full px-3 py-1.5 text-[0.75rem] font-semibold ${
                        index === 0
                          ? "bg-ink-950 text-white"
                          : "bg-sand-100 text-slate-500"
                      }`}
                    >
                      {label}
                    </span>
                  ),
                )}
              </div>

              <div className="grid gap-3">
                {relatedLessons.length > 0 ? (
                  relatedLessons.map((item) => {
                    const relationLabel =
                      item.categoryId === lesson.categoryId
                        ? studyCopy.relatedSame
                        : item.isNew
                          ? studyCopy.relatedNew
                          : studyCopy.relatedExplore;

                    return (
                      <Link
                        key={item.id}
                        className="group grid grid-cols-[5.8rem_minmax(0,1fr)] gap-3 rounded-[1rem] border border-sand-200 bg-white/72 p-2.5 transition duration-300 hover:-translate-y-[1px] hover:border-brand-200 hover:bg-white active:translate-y-[1px] active:scale-[0.99]"
                        href={`/dictation/${item.id}`}
                      >
                        <div className="relative overflow-hidden rounded-[0.7rem] bg-sand-100">
                          <img
                            alt={`${pickText(item.title, locale)} thumbnail`}
                            className="aspect-[16/9] h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                            src={item.thumbnailUrl}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="rounded-[0.45rem] bg-brand-500 px-1.5 py-0.5 text-[0.62rem] font-bold text-white">
                              {item.level}
                            </span>
                            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[0.62rem] font-semibold text-brand-800">
                              {relationLabel}
                            </span>
                          </div>
                          <p className="mt-1.5 line-clamp-2 text-[0.88rem] font-semibold leading-snug text-ink-950">
                            {pickText(item.title, locale)}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-[0.72rem] font-medium text-slate-500">
                            <YoutubeLogo size={12} weight="fill" />
                            {item.source} · {item.durationMinutes} min
                          </p>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="rounded-[1rem] border border-dashed border-sand-200 bg-white/55 p-4 text-[0.8125rem] leading-relaxed text-slate-500">
                    {studyCopy.noRelated}
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>
        ) : null}
      </div>
      {developmentNotice ? (
        <div className="fixed bottom-5 right-5 z-40 max-w-[20rem] rounded-[1rem] border border-sand-200 bg-white px-4 py-3 text-[0.85rem] font-semibold text-ink-950 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.35)]">
          {developmentNotice}
        </div>
      ) : null}
      {wordInsightPopover ? (
        <WordInsightPopover
          insight={wordInsightPopover.insight}
          onClose={() => setWordInsightPopover(null)}
          onSaveWord={showUnderDevelopment}
          x={wordInsightPopover.x}
          y={wordInsightPopover.y}
        />
      ) : null}
    </WorkspaceCanvas>
  );
}

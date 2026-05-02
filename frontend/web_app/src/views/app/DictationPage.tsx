"use client";

import {
  ArrowRight,
  BookmarkSimple,
  CaretLeft,
  CheckCircle,
  ChatsCircle,
  ClockCounterClockwise,
  Pause,
  Play,
  Repeat,
  SpeakerHigh,
  SpinnerGap,
  WarningCircle,
} from "@phosphor-icons/react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  WorkspaceCanvas,
  WorkspaceSection,
  WorkspaceSectionHeader,
} from "../../components/app/WorkspaceCanvas";
import { ErrorState, LoadingPanel } from "../../components/common/StatePanels";
import {
  YouTubeSegmentPlayer,
  type YouTubeSegmentPlayerHandle,
} from "../../components/listening/YouTubeSegmentPlayer";
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

  const copy = {
    vi: {
      actionCheck: "Kiểm tra câu",
      actionBack: "Thư viện nghe",
      actionNext: "Câu tiếp",
      actionNormal: "Tốc độ chuẩn",
      actionPause: "Tạm dừng",
      actionPlay: "Phát đoạn",
      actionRepeat: "Nghe lại",
      actionSave: "Lưu phrase",
      actionSlow: "Chậm 0.75x",
      actionShadow: "Nghe chậm và nói theo",
      accuracy: "Độ chính xác",
      answerLabel: "Câu bạn nghe được",
      answerPlaceholder: "Gõ toàn bộ câu sau khi nghe…",
      checked: "Đã kiểm tra",
      demo: "Demo listening",
      demoDescription:
        "Bạn đang dùng dữ liệu local vì đăng nhập Supabase chưa sẵn sàng.",
      empty: "Chưa có lesson listening.",
      emptyAnswer: "Hãy gõ câu bạn nghe được trước khi kiểm tra.",
      feedback: "Feedback",
      history: "Lịch sử gần đây",
      lesson: "Bài nghe",
      loading: "Đang tải module nghe",
      missed: "Từ cần sửa",
      phrases: "Phrase đã lưu",
      prompt: "Nhiệm vụ",
      saved: "Đã lưu",
      segment: "Segment",
      shadow: "Shadowing bridge",
      statusComplete: "Hoàn thành",
      statusIdle: "Chưa làm",
      statusReview: "Cần sửa",
      summary: "Tổng quan phiên",
      title: "Listening practice",
      transcript: "Transcript chuẩn",
    },
    en: {
      actionCheck: "Check line",
      actionBack: "Listening library",
      actionNext: "Next line",
      actionNormal: "Normal speed",
      actionPause: "Pause",
      actionPlay: "Play segment",
      actionRepeat: "Repeat",
      actionSave: "Save phrase",
      actionSlow: "Slow 0.75x",
      actionShadow: "Play slow and speak",
      accuracy: "Accuracy",
      answerLabel: "What you heard",
      answerPlaceholder: "Type the whole sentence after listening…",
      checked: "Checked",
      demo: "Listening demo",
      demoDescription:
        "You are using local data because Supabase sign-in is not ready.",
      empty: "No listening lessons yet.",
      emptyAnswer: "Type what you heard before checking the line.",
      feedback: "Feedback",
      history: "Recent history",
      lesson: "Lesson",
      loading: "Loading listening module",
      missed: "Words to fix",
      phrases: "Saved phrases",
      prompt: "Task",
      saved: "Saved",
      segment: "Segment",
      shadow: "Shadowing bridge",
      statusComplete: "Complete",
      statusIdle: "Not started",
      statusReview: "Needs review",
      summary: "Session summary",
      title: "Listening practice",
      transcript: "Reference transcript",
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
          setLesson(payload.lesson);
          setActiveSegmentId(payload.lesson.segments[0]?.id ?? null);
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
  const activeAnswer = activeKey ? answers[activeKey] ?? "" : "";
  const activeResult =
    lesson && activeSegment
      ? getResult(progress, lesson.id, activeSegment.id)
      : undefined;
  const canCheckAnswer = activeAnswer.trim().length > 0 && !isChecking;
  const canControlPlayer = playerReady && playerStatus === "ready";

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

  const historyForLesson = useMemo(() => {
    if (!lesson) {
      return [];
    }

    return progress.history.filter((entry) => entry.lessonId === lesson.id).slice(0, 5);
  }, [lesson, progress.history]);

  const averageAccuracy = useMemo(() => {
    if (lessonResults.length === 0) {
      return 0;
    }

    return Math.round(
      lessonResults.reduce((total, result) => total + result.accuracy, 0) /
        lessonResults.length,
    );
  }, [lessonResults]);

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
        updateProgress((current) => upsertSegmentResult(current, payload.result));
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

  const handleNextSegment = () => {
    if (!lesson || !activeSegment) {
      return;
    }

    const currentIndex = lesson.segments.findIndex(
      (segment) => segment.id === activeSegment.id,
    );
    const nextSegment = lesson.segments[currentIndex + 1] ?? lesson.segments[0];

    setActiveSegmentId(nextSegment.id);
    setCheckError("");
    playerRef.current?.pause();
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

  if (loadingLesson || !lesson || !activeSegment) {
    return <LoadingPanel className="min-h-[520px]" lines={10} />;
  }

  const activeStatus = getSegmentStatus(activeResult);

  return (
    <WorkspaceCanvas>
      <WorkspaceSection className="border-b border-sand-200">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr),340px] xl:items-end">
          <WorkspaceSectionHeader
            action={
              <Link
                className="button-secondary min-h-11 shrink-0 rounded-[1.1rem] px-4"
                href="/dictation"
              >
                <CaretLeft size={17} weight="bold" />
                {copy.actionBack}
              </Link>
            }
            eyebrow={copy.title}
            title={pickText(lesson.title, locale)}
            description={pickText(lesson.description, locale)}
          />

          {!isAuthenticated ? (
            <div className="rounded-[1.2rem] border border-brand-200 bg-brand-50 px-4 py-3 text-sm leading-relaxed text-brand-800">
              <p className="font-semibold text-brand-900">{copy.demo}</p>
              <p className="mt-1 text-brand-700">{copy.demoDescription}</p>
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {lessons.map((item) => {
            const selected = item.id === lesson.id;

            return (
              <Link
                key={item.id}
                aria-current={selected ? "page" : undefined}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 active:scale-[0.98] ${
                  selected
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-sand-200 bg-white/75 text-slate-600 hover:border-brand-200 hover:text-ink-950"
                }`}
                href={`/dictation/${item.id}`}
              >
                {pickText(item.title, locale)}
              </Link>
            );
          })}
        </div>
      </WorkspaceSection>

      <div className="grid xl:grid-cols-[minmax(0,1fr),360px]">
        <div className="min-w-0 border-b border-sand-200 xl:border-b-0 xl:border-r">
          <WorkspaceSection className="border-b border-sand-200">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr),260px]">
              <div className="min-w-0">
                <YouTubeSegmentPlayer
                  ref={playerRef}
                  endSeconds={activeSegment.endSeconds}
                  onReadyChange={setPlayerReady}
                  onStatusChange={setPlayerStatus}
                  startSeconds={activeSegment.startSeconds}
                  title={pickText(lesson.title, locale)}
                  videoId={lesson.youtubeVideoId}
                />

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className="button-primary min-h-11 rounded-[1.1rem] px-4 disabled:pointer-events-none disabled:opacity-55"
                    disabled={!canControlPlayer}
                    onClick={() => playerRef.current?.playSegment(1)}
                    type="button"
                  >
                    <Play size={17} weight="bold" />
                    {copy.actionPlay}
                  </button>
                  <button
                    className="button-secondary min-h-11 rounded-[1.1rem] px-4 disabled:pointer-events-none disabled:opacity-55"
                    disabled={!canControlPlayer}
                    onClick={() => playerRef.current?.pause()}
                    type="button"
                  >
                    <Pause size={17} weight="bold" />
                    {copy.actionPause}
                  </button>
                  <button
                    className="button-secondary min-h-11 rounded-[1.1rem] px-4 disabled:pointer-events-none disabled:opacity-55"
                    disabled={!canControlPlayer}
                    onClick={() => playerRef.current?.playSegment(1)}
                    type="button"
                  >
                    <Repeat size={17} weight="bold" />
                    {copy.actionRepeat}
                  </button>
                  <button
                    className="button-secondary min-h-11 rounded-[1.1rem] px-4 disabled:pointer-events-none disabled:opacity-55"
                    disabled={!canControlPlayer}
                    onClick={() => playerRef.current?.playSegment(0.75)}
                    type="button"
                  >
                    <SpeakerHigh size={17} weight="duotone" />
                    {copy.actionSlow}
                  </button>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="rounded-[1.25rem] border border-sand-200 bg-white/65 p-4">
                  <p className="type-eyebrow-muted">{copy.prompt}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {pickText(activeSegment.prompt, locale)}
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-sand-200 bg-white/65 p-4">
                  <p className="type-eyebrow-muted">{copy.segment}</p>
                  <p className="mt-2 font-mono text-[1.55rem] font-semibold tracking-[-0.04em] text-ink-950">
                    {activeSegment.order}/{lesson.segments.length}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {timestampForSegment(activeSegment)}
                  </p>
                </div>
              </div>
            </div>
          </WorkspaceSection>

          <WorkspaceSection className="border-b border-sand-200">
            <div className="grid gap-4">
              <label className="field-shell">
                <span className="field-label">{copy.answerLabel}</span>
                <textarea
                  className="field-input min-h-28 resize-y rounded-[1.25rem]"
                  onKeyDown={handleAnswerKeyDown}
                  onChange={(event) => handleAnswerChange(event.target.value)}
                  placeholder={copy.answerPlaceholder}
                  value={activeAnswer}
                />
              </label>

              {checkError ? (
                <div className="rounded-[1.2rem] bg-rose-50 px-4 py-3 text-sm leading-relaxed text-rose-700">
                  {checkError}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2.5">
                <button
                  className="button-primary rounded-[1.1rem] disabled:pointer-events-none disabled:opacity-55"
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
                  className="button-secondary rounded-[1.1rem]"
                  onClick={handleNextSegment}
                  type="button"
                >
                  <ArrowRight size={18} weight="bold" />
                  {copy.actionNext}
                </button>
              </div>
            </div>
          </WorkspaceSection>

          <WorkspaceSection>
            <div className="grid gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="type-eyebrow-label">{copy.feedback}</p>
                  <h3 className="type-title-card mt-2">
                    {activeResult
                      ? `${copy.accuracy}: ${activeResult.accuracy}%`
                      : locale === "vi"
                        ? "Nghe trước, kiểm tra sau."
                        : "Listen first, then check."}
                  </h3>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    activeStatus === "complete"
                      ? "bg-emerald-50 text-emerald-700"
                      : activeStatus === "review"
                        ? "bg-amber-50 text-amber-800"
                        : "bg-sand-100 text-slate-500"
                  }`}
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

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-[1.2rem] border border-sand-200 bg-white/65 p-4">
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
                            {locale === "vi" ? "Không có từ thiếu" : "No missing words"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="rounded-[1.2rem] border border-sand-200 bg-white/65 p-4">
                      <p className="type-eyebrow-muted">{copy.transcript}</p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {activeResult.transcript}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[1.2rem] border border-sage-100 bg-sage-100/55 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="type-eyebrow-label text-sage-700">
                          {copy.shadow}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                          {activeResult.errorTypes
                            .map((hint) => pickText(hint.explanation, locale))
                            .join(" ")}
                        </p>
                      </div>
                      <button
                        className="button-secondary rounded-[1.1rem] bg-white disabled:pointer-events-none disabled:opacity-55"
                        disabled={!canControlPlayer}
                        onClick={() => playerRef.current?.playSegment(0.75)}
                        type="button"
                      >
                        <ChatsCircle size={18} weight="duotone" />
                        {copy.actionShadow}
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
                            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition duration-300 active:scale-[0.98] ${
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
              ) : (
                <div className="rounded-[1.2rem] border border-dashed border-sand-200 bg-white/50 p-5 text-sm leading-relaxed text-slate-500">
                  {locale === "vi"
                    ? "Bấm phát đoạn, gõ câu bạn nghe được, rồi kiểm tra để xem lỗi theo từng từ."
                    : "Play the segment, type what you hear, then check for word-level feedback."}
                </div>
              )}
            </div>
          </WorkspaceSection>
        </div>

        <aside className="min-w-0">
          <WorkspaceSection className="border-b border-sand-200">
            <p className="type-eyebrow-label">{copy.summary}</p>
            <div className="mt-4 grid gap-3">
              {[
                {
                  label: copy.checked,
                  value: `${lessonResults.length}/${lesson.segments.length}`,
                },
                {
                  label: copy.accuracy,
                  value: `${averageAccuracy}%`,
                },
                {
                  label: copy.phrases,
                  value: String(savedPhrasesForLesson.length),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.25rem] border border-sand-200 bg-white/65 p-4"
                >
                  <p className="type-eyebrow-muted">{item.label}</p>
                  <p className="mt-2 font-mono text-[1.8rem] font-semibold tracking-[-0.04em] text-ink-950">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </WorkspaceSection>

          <WorkspaceSection className="border-b border-sand-200">
            <p className="type-eyebrow-label">{copy.segment}</p>
            <div className="mt-4 grid gap-2.5">
              {lesson.segments.map((segment) => {
                const result = getResult(progress, lesson.id, segment.id);
                const status = getSegmentStatus(result);
                const active = segment.id === activeSegment.id;

                return (
                  <button
                    key={segment.id}
                    className={`rounded-[1.2rem] border p-3 text-left transition duration-300 active:scale-[0.99] ${
                      active
                        ? "border-brand-300 bg-brand-50"
                        : "border-sand-200 bg-white/65 hover:border-brand-200"
                    }`}
                    onClick={() => {
                      setActiveSegmentId(segment.id);
                      setCheckError("");
                      playerRef.current?.pause();
                    }}
                    type="button"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-ink-950">
                        {segment.order}. {segment.speaker}
                      </span>
                      {status === "complete" ? (
                        <CheckCircle className="text-emerald-600" size={18} weight="bold" />
                      ) : status === "review" ? (
                        <WarningCircle className="text-amber-700" size={18} weight="duotone" />
                      ) : (
                        <ClockCounterClockwise className="text-slate-400" size={18} weight="duotone" />
                      )}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                      {pickText(segment.prompt, locale)}
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
          </WorkspaceSection>

          <WorkspaceSection className="border-b border-sand-200">
            <p className="type-eyebrow-label">{copy.phrases}</p>
            <div className="mt-4 grid gap-2.5">
              {savedPhrasesForLesson.length > 0 ? (
                savedPhrasesForLesson.slice(0, 5).map((phrase) => (
                  <div
                    key={phrase.id}
                    className="rounded-[1.1rem] border border-sand-200 bg-white/65 p-3"
                  >
                    <p className="font-semibold text-ink-950">{phrase.phrase}</p>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {phrase.timestampLabel}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-[1.1rem] border border-dashed border-sand-200 bg-white/50 p-4 text-sm leading-relaxed text-slate-500">
                  {locale === "vi"
                    ? "Các phrase bạn lưu sau khi kiểm tra sẽ nằm ở đây."
                    : "Phrases you save after checking will appear here."}
                </p>
              )}
            </div>
          </WorkspaceSection>

          <WorkspaceSection>
            <p className="type-eyebrow-label">{copy.history}</p>
            <div className="mt-4 grid gap-2.5">
              {historyForLesson.length > 0 ? (
                historyForLesson.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between gap-3 rounded-[1.1rem] border border-sand-200 bg-white/65 px-3 py-2.5"
                  >
                    <span className="text-sm font-medium text-slate-600">
                      {entry.segmentId.replace("seg-", "")}
                    </span>
                    <span className="font-mono text-sm font-semibold text-ink-950">
                      {entry.accuracy}%
                    </span>
                  </div>
                ))
              ) : (
                <p className="rounded-[1.1rem] border border-dashed border-sand-200 bg-white/50 p-4 text-sm leading-relaxed text-slate-500">
                  {locale === "vi"
                    ? "Chưa có lần kiểm tra nào trong phiên này."
                    : "No checked attempts in this session yet."}
                </p>
              )}
            </div>
          </WorkspaceSection>
        </aside>
      </div>
    </WorkspaceCanvas>
  );
}

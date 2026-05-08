"use client";

import {
  ArrowClockwise,
  CaretLeft,
  CaretRight,
  CheckCircle,
  Clock,
  FloppyDisk,
  ListChecks,
  MagicWand,
  SealCheck,
  SignOut,
  SpinnerGap,
  WarningCircle,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WorkspaceCanvas } from "../../components/app/WorkspaceCanvas";
import { ErrorState, LoadingPanel } from "../../components/common/StatePanels";
import {
  InternalWaveformReviewPlayer,
  type WaveformPlaybackCommand,
} from "../../components/internal/InternalWaveformReviewPlayer";
import { listeningReviewRepository } from "../../repositories/listeningReviewRepository";
import type { PointerEvent as ReactPointerEvent } from "react";
import type {
  ListeningLessonDetail,
  ListeningReviewLessonSummary,
  ListeningTimingReviewDocument,
  ListeningTimingReviewSegment,
  ListeningTimingReviewWord,
  LocalizedText,
  TimingRecognitionJob,
} from "../../server/modules/listening/listening.types";

function pickText(value: LocalizedText) {
  return value.en || value.vi;
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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatSeconds(value: number) {
  return value.toFixed(3);
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest("input, textarea, select, [contenteditable='true'], [role='textbox']"),
  );
}

function isTerminalTimingJob(job: TimingRecognitionJob | null) {
  return job?.status === "COMPLETED" || job?.status === "FAILED";
}

type ReviewPane = "left" | "right";

type ReviewPaneLayout = {
  leftCollapsed: boolean;
  leftWidth: number;
  rightCollapsed: boolean;
  rightWidth: number;
};

const reviewLayoutStorageKey = "internal-listening-review-layout:v1";
const defaultReviewPaneLayout: ReviewPaneLayout = {
  leftCollapsed: false,
  leftWidth: 288,
  rightCollapsed: false,
  rightWidth: 352,
};
const collapsedPaneWidth = 52;
const leftPaneMinWidth = 224;
const leftPaneMaxWidth = 416;
const rightPaneMinWidth = 256;
const rightPaneMaxWidth = 480;

function clampPaneWidth(pane: ReviewPane, width: number) {
  if (pane === "left") {
    return clamp(width, leftPaneMinWidth, leftPaneMaxWidth);
  }

  return clamp(width, rightPaneMinWidth, rightPaneMaxWidth);
}

function getInitialReviewPaneLayout(): ReviewPaneLayout {
  if (typeof window === "undefined") {
    return defaultReviewPaneLayout;
  }

  try {
    const stored = window.localStorage.getItem(reviewLayoutStorageKey);

    if (!stored) {
      return defaultReviewPaneLayout;
    }

    const parsed = JSON.parse(stored) as Partial<ReviewPaneLayout>;

    return {
      leftCollapsed: Boolean(parsed.leftCollapsed),
      leftWidth: clampPaneWidth("left", Number(parsed.leftWidth) || defaultReviewPaneLayout.leftWidth),
      rightCollapsed: Boolean(parsed.rightCollapsed),
      rightWidth: clampPaneWidth(
        "right",
        Number(parsed.rightWidth) || defaultReviewPaneLayout.rightWidth,
      ),
    };
  } catch {
    return defaultReviewPaneLayout;
  }
}

function buildWordsFromTranscript(
  segment: Pick<ListeningTimingReviewSegment, "startSeconds" | "endSeconds" | "transcript">,
): ListeningTimingReviewWord[] {
  const words = splitTranscriptWords(segment.transcript);
  const duration = Math.max(0.4, segment.endSeconds - segment.startSeconds);
  const weights = words.map((word) => Math.max(1, normalizeToken(word).length));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0) || 1;
  let cursor = segment.startSeconds;

  return words.map((word, index) => {
    const wordDuration = (duration * weights[index]) / totalWeight;
    const startSeconds = roundTimestamp(cursor);
    const endSeconds = roundTimestamp(
      index === words.length - 1 ? segment.endSeconds : cursor + wordDuration,
    );
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

function statusClassName(status: ListeningReviewLessonSummary["reviewStatus"]) {
  if (status === "APPROVED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "DRAFT") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  return "border-slate-200 bg-white text-slate-500";
}

function cloneDocument(document: ListeningTimingReviewDocument) {
  return structuredClone(document);
}

export function ListeningReviewWorkspacePage() {
  const [lessons, setLessons] = useState<ListeningReviewLessonSummary[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [lesson, setLesson] = useState<ListeningLessonDetail | null>(null);
  const [document, setDocument] = useState<ListeningTimingReviewDocument | null>(null);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);
  const [timingJob, setTimingJob] = useState<TimingRecognitionJob | null>(null);
  const [waveformCommand, setWaveformCommand] =
    useState<WaveformPlaybackCommand | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [paneLayout, setPaneLayout] = useState<ReviewPaneLayout>(
    getInitialReviewPaneLayout,
  );
  const [resizingPane, setResizingPane] = useState<ReviewPane | null>(null);
  const waveformCommandSequence = useRef(0);
  const wordButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const resizeSessionRef = useRef<{
    leftWidth: number;
    pane: ReviewPane;
    rightWidth: number;
    startX: number;
  } | null>(null);

  const selectedSegment = useMemo(() => {
    if (!document || !selectedSegmentId) {
      return null;
    }

    return document.segments.find((segment) => segment.id === selectedSegmentId) ?? null;
  }, [document, selectedSegmentId]);
  const selectedWord = selectedSegment?.words[selectedWordIndex] ?? null;
  const approvedSegmentCount =
    document?.segments.filter((segment) => segment.approved).length ?? 0;
  const canPublish = document
    ? document.segments.length > 0 && approvedSegmentCount === document.segments.length
    : false;
  const timingJobActive = timingJob ? !isTerminalTimingJob(timingJob) : false;
  const leftPaneWidth = paneLayout.leftCollapsed
    ? collapsedPaneWidth
    : paneLayout.leftWidth;
  const rightPaneWidth = paneLayout.rightCollapsed
    ? collapsedPaneWidth
    : paneLayout.rightWidth;
  const reviewGridTemplateColumns = `${leftPaneWidth}px 10px minmax(0,1fr) 10px ${rightPaneWidth}px`;
  const selectedLessonSummary =
    lessons.find((item) => item.id === selectedLessonId) ?? lessons[0] ?? null;

  useEffect(() => {
    wordButtonRefs.current = [];
  }, [selectedSegmentId]);

  useEffect(() => {
    const indexToReveal = activeWordIndex ?? selectedWordIndex;
    const button = wordButtonRefs.current[indexToReveal];

    if (!button) {
      return;
    }

    button.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeWordIndex, selectedSegmentId, selectedWordIndex]);

  const togglePaneCollapsed = useCallback((pane: ReviewPane) => {
    setPaneLayout((current) => ({
      ...current,
      leftCollapsed: pane === "left" ? !current.leftCollapsed : current.leftCollapsed,
      rightCollapsed: pane === "right" ? !current.rightCollapsed : current.rightCollapsed,
    }));
  }, []);

  const startPaneResize = useCallback(
    (pane: ReviewPane, event: ReactPointerEvent<HTMLButtonElement>) => {
      if (
        (pane === "left" && paneLayout.leftCollapsed) ||
        (pane === "right" && paneLayout.rightCollapsed)
      ) {
        return;
      }

      event.preventDefault();
      resizeSessionRef.current = {
        leftWidth: paneLayout.leftWidth,
        pane,
        rightWidth: paneLayout.rightWidth,
        startX: event.clientX,
      };
      setResizingPane(pane);
    },
    [paneLayout],
  );

  const refreshLessonList = () =>
    listeningReviewRepository
      .listLessons()
      .then((payload) => {
        setLessons(payload.lessons);
        setSelectedLessonId((current) => current ?? payload.lessons[0]?.id ?? null);
      })
      .catch((caughtError) => {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load review lessons",
        );
      });

  useEffect(() => {
    setLoadingList(true);
    setError("");

    fetch("/api/internal/auth/me", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((payload) => setAdminEmail(payload?.admin?.email ?? ""));

    refreshLessonList().finally(() => setLoadingList(false));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(reviewLayoutStorageKey, JSON.stringify(paneLayout));
  }, [paneLayout]);

  useEffect(() => {
    if (!resizingPane) {
      return;
    }

    window.document.body.style.cursor = "col-resize";
    window.document.body.style.userSelect = "none";

    const handlePointerMove = (event: PointerEvent) => {
      const session = resizeSessionRef.current;

      if (!session) {
        return;
      }

      if (session.pane === "left") {
        const nextWidth = session.leftWidth + event.clientX - session.startX;

        setPaneLayout((current) => ({
          ...current,
          leftWidth: clampPaneWidth("left", nextWidth),
        }));
        return;
      }

      const nextWidth = session.rightWidth + session.startX - event.clientX;

      setPaneLayout((current) => ({
        ...current,
        rightWidth: clampPaneWidth("right", nextWidth),
      }));
    };

    const stopResize = () => {
      resizeSessionRef.current = null;
      setResizingPane(null);
      window.document.body.style.cursor = "";
      window.document.body.style.userSelect = "";
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResize, { once: true });
    window.addEventListener("pointercancel", stopResize, { once: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResize);
      window.removeEventListener("pointercancel", stopResize);
      window.document.body.style.cursor = "";
      window.document.body.style.userSelect = "";
    };
  }, [resizingPane]);

  const handleLogout = async () => {
    await fetch("/api/internal/auth/logout", {
      credentials: "include",
      method: "POST",
    });
    window.location.href = "/internal/login";
  };

  useEffect(() => {
    if (!selectedLessonId) {
      return;
    }

    let cancelled = false;

    setLoadingDetail(true);
    setError("");
    setNotice("");
    setTimingJob(null);

    listeningReviewRepository
      .getLesson(selectedLessonId)
      .then((payload) => {
        if (cancelled) {
          return;
        }

        setLesson(payload.lesson);
        setDocument(payload.document);
        setSelectedSegmentId(payload.document.segments[0]?.id ?? null);
        setSelectedWordIndex(0);
        setActiveWordIndex(null);
      })
      .catch((caughtError) => {
        if (!cancelled) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Unable to load review document",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingDetail(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedLessonId]);

  const updateDocument = (
    updater: (current: ListeningTimingReviewDocument) => ListeningTimingReviewDocument,
  ) => {
    setNotice("");
    setDocument((current) => {
      if (!current) {
        return current;
      }

      return updater(cloneDocument(current));
    });
  };

  const updateSegment = (
    segmentId: string,
    updater: (segment: ListeningTimingReviewSegment) => ListeningTimingReviewSegment,
  ) => {
    updateDocument((current) => ({
      ...current,
      status: "DRAFT",
      source: "DRAFT",
      updatedAt: new Date().toISOString(),
      segments: current.segments.map((segment) =>
        segment.id === segmentId ? updater(segment) : segment,
      ),
    }));
  };

  const updateWord = (
    segmentId: string,
    wordIndex: number,
    patch: Partial<ListeningTimingReviewWord>,
  ) => {
    updateSegment(segmentId, (segment) => ({
      ...segment,
      approved: false,
      words: segment.words.map((word, index) => {
        if (index !== wordIndex) {
          return word;
        }

        const minWordLength = 0.03;
        const segmentEndLimit = segment.endSeconds + 0.18;
        const requestedStart = patch.startSeconds ?? word.startSeconds;
        const startSeconds = roundTimestamp(
          clamp(requestedStart, segment.startSeconds, segmentEndLimit - minWordLength),
        );
        const requestedEnd = patch.endSeconds ?? word.endSeconds;
        const endSeconds = roundTimestamp(
          clamp(requestedEnd, startSeconds + minWordLength, segmentEndLimit),
        );

        return {
          ...word,
          ...patch,
          endSeconds,
          normalized:
            patch.text !== undefined
              ? normalizeToken(patch.text)
              : patch.normalized ?? word.normalized,
          source: patch.source ?? "MANUAL",
          startSeconds,
        };
      }),
    }));
  };

  const handleSave = async () => {
    if (!document) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = await listeningReviewRepository.saveLesson(document.lessonId, document);
      setDocument(payload.document);
      setNotice("Draft saved.");
      await refreshLessonList();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to save draft");
    } finally {
      setSaving(false);
    }
  };

  const handleApproveLesson = async () => {
    if (!document || !canPublish) {
      return;
    }

    setApproving(true);
    setError("");

    try {
      await listeningReviewRepository.saveLesson(document.lessonId, document);
      const payload = await listeningReviewRepository.approveLesson(document.lessonId);
      setDocument(payload.document);
      setNotice("Approved data has been published to the learning app.");
      await refreshLessonList();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to approve review document",
      );
    } finally {
      setApproving(false);
    }
  };

  const sendWaveformCommand = useCallback(
    (action: WaveformPlaybackCommand["action"], wordIndex?: number) => {
      waveformCommandSequence.current += 1;
      setWaveformCommand({
        action,
        id: waveformCommandSequence.current,
        wordIndex,
      });
    },
    [],
  );

  const selectAdjacentWord = useCallback(
    (direction: -1 | 1) => {
      if (!selectedSegment) {
        return;
      }

      const nextIndex = clamp(
        selectedWordIndex + direction,
        0,
        Math.max(0, selectedSegment.words.length - 1),
      );

      setSelectedWordIndex(nextIndex);
      setActiveWordIndex(nextIndex);
      sendWaveformCommand("FOCUS_WORD", nextIndex);
    },
    [selectedSegment, selectedWordIndex, sendWaveformCommand],
  );

  const selectAdjacentSegment = useCallback(
    (direction: -1 | 1) => {
      if (!document || !selectedSegmentId) {
        return;
      }

      const currentIndex = document.segments.findIndex(
        (segment) => segment.id === selectedSegmentId,
      );

      if (currentIndex < 0) {
        return;
      }

      const nextIndex = clamp(currentIndex + direction, 0, document.segments.length - 1);
      const nextSegment = document.segments[nextIndex];

      if (nextSegment) {
        setSelectedSegmentId(nextSegment.id);
        setSelectedWordIndex(0);
        setActiveWordIndex(null);
        sendWaveformCommand("JUMP_START");
      }
    },
    [document, selectedSegmentId, sendWaveformCommand],
  );

  const nudgeSelectedWord = useCallback(
    (field: "endSeconds" | "startSeconds", delta: number) => {
      if (!selectedSegment || !selectedWord) {
        return;
      }

      updateWord(selectedSegment.id, selectedWordIndex, {
        [field]: roundTimestamp(selectedWord[field] + delta),
      });
    },
    [selectedSegment, selectedWord, selectedWordIndex],
  );

  const handleRecognizeTiming = async () => {
    if (!document) {
      return;
    }

    setError("");
    setNotice("");

    try {
      const payload = await listeningReviewRepository.startTimingJob(document.lessonId);
      setTimingJob(payload.job);
    } catch (caughtError) {
      setNotice("");
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to run timing recognition",
      );
    }
  };

  useEffect(() => {
    if (!timingJob || isTerminalTimingJob(timingJob)) {
      return;
    }

    let cancelled = false;

    const pollTimingJob = async () => {
      try {
        const payload = await listeningReviewRepository.getTimingJob(timingJob.jobId);

        if (cancelled) {
          return;
        }

        setTimingJob(payload.job);

        if (payload.job.status === "COMPLETED") {
          const nextPayload = await listeningReviewRepository.getLesson(payload.job.lessonId);

          if (cancelled) {
            return;
          }

          setLesson(nextPayload.lesson);
          setDocument(nextPayload.document);
          setSelectedSegmentId((current) => {
            const preserved =
              nextPayload.document.segments.find((segment) => segment.id === current)?.id ??
              nextPayload.document.segments[0]?.id ??
              null;

            return preserved;
          });
          setSelectedWordIndex(0);
          setActiveWordIndex(null);
          setNotice(
            `Timing draft completed with ${payload.job.model} on ${payload.job.device}. Review and approve before publishing.`,
          );
          await refreshLessonList();
        } else if (payload.job.status === "FAILED") {
          setError(payload.job.error ?? "Unable to run timing recognition");
        }
      } catch (caughtError) {
        if (!cancelled) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Unable to read timing job progress",
          );
        }
      }
    };

    void pollTimingJob();
    const interval = window.setInterval(() => {
      void pollTimingJob();
    }, 1400);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [timingJob?.jobId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!document || !selectedSegment || isEditableTarget(event.target)) {
        return;
      }

      if (event.code === "Space" && event.shiftKey) {
        event.preventDefault();
        sendWaveformCommand("PLAY_WORD", selectedWordIndex);
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        sendWaveformCommand("PLAY_PAUSE");
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        sendWaveformCommand("PLAY_LINE");
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        sendWaveformCommand("STOP");
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const direction = event.key === "ArrowLeft" ? -1 : 1;

        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          selectAdjacentSegment(direction);
          return;
        }

        if (event.altKey && event.shiftKey) {
          event.preventDefault();
          nudgeSelectedWord("endSeconds", direction * 0.05);
          return;
        }

        if (event.altKey) {
          event.preventDefault();
          nudgeSelectedWord("startSeconds", direction * 0.05);
          return;
        }

        event.preventDefault();
        selectAdjacentWord(direction);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    document,
    nudgeSelectedWord,
    selectAdjacentSegment,
    selectAdjacentWord,
    selectedWordIndex,
    selectedSegment,
    sendWaveformCommand,
  ]);

  return (
    <WorkspaceCanvas className="min-h-[100dvh] bg-[rgb(255,252,247)]">
      <div className="border-b border-sand-200 bg-white/78 px-4 py-2 lg:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-baseline gap-3">
            <p className="type-eyebrow-label text-[0.64rem]">Internal QA</p>
            <h1 className="text-[1.05rem] font-semibold tracking-[-0.03em] text-ink-950">
              Timing workspace
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {adminEmail ? (
              <span className="rounded-full border border-sand-200 bg-white px-3 py-1.5 text-[0.74rem] font-semibold text-slate-600">
                {adminEmail}
              </span>
            ) : null}
            <button
              className="button-secondary min-h-8 px-3 text-[0.76rem]"
              disabled={timingJobActive || !document}
              onClick={handleRecognizeTiming}
              type="button"
            >
              {timingJobActive ? (
                <SpinnerGap className="animate-spin" size={16} weight="bold" />
              ) : (
                <MagicWand size={16} weight="duotone" />
              )}
              {timingJobActive ? `${timingJob?.progress ?? 0}%` : "Run timing"}
            </button>
            <button
              className="button-secondary min-h-8 px-3 text-[0.76rem]"
              disabled={saving || !document}
              onClick={handleSave}
              type="button"
            >
              {saving ? (
                <SpinnerGap className="animate-spin" size={16} weight="bold" />
              ) : (
                <FloppyDisk size={16} weight="duotone" />
              )}
              Save draft
            </button>
            <button
              className="button-primary min-h-8 px-3 text-[0.76rem] disabled:pointer-events-none disabled:opacity-55"
              disabled={approving || timingJobActive || !canPublish}
              onClick={handleApproveLesson}
              type="button"
            >
              {approving ? (
                <SpinnerGap className="animate-spin" size={16} weight="bold" />
              ) : (
                <SealCheck size={16} weight="duotone" />
              )}
              Publish approved
            </button>
            <button
              className="button-secondary min-h-8 px-3 text-[0.76rem]"
              onClick={handleLogout}
              type="button"
            >
              <SignOut size={16} weight="duotone" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="border-b border-rose-100 bg-rose-50 px-4 py-3 text-[0.82rem] font-semibold text-rose-700 lg:px-6">
          {error}
        </div>
      ) : null}
      {timingJobActive && timingJob ? (
        <div className="border-b border-amber-100 bg-amber-50 px-4 py-2 lg:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[0.76rem] font-semibold text-amber-900">
            <span className="inline-flex items-center gap-2">
              <SpinnerGap className="animate-spin" size={16} weight="bold" />
              {timingJob.message}
            </span>
            <span className="font-mono text-[0.72rem] text-amber-800">
              {timingJob.status.replaceAll("_", " ")} - {timingJob.progress}%
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-brand-500 transition-[width] duration-500"
              style={{ width: `${timingJob.progress}%` }}
            />
          </div>
        </div>
      ) : null}
      {notice ? (
        <div className="border-b border-emerald-100 bg-emerald-50 px-4 py-3 text-[0.82rem] font-semibold text-emerald-700 lg:px-6">
          {notice}
        </div>
      ) : null}

      <div
        className="grid min-h-0 overflow-hidden lg:h-[calc(100dvh-4.6rem)]"
        style={{ gridTemplateColumns: reviewGridTemplateColumns }}
      >
        <aside className="min-w-0 border-b border-sand-200 bg-white/48 lg:border-b-0 lg:border-r">
          {paneLayout.leftCollapsed ? (
            <div className="flex h-full flex-col items-center gap-3 px-2 py-3">
              <button
                aria-label="Expand lesson list"
                className="grid size-9 place-items-center rounded-full border border-sand-200 bg-white text-slate-600 transition hover:border-brand-200 hover:text-brand-700"
                onClick={() => togglePaneCollapsed("left")}
                type="button"
              >
                <CaretRight size={17} weight="bold" />
              </button>
              <span className="rounded-full bg-brand-500 px-2 py-1 text-[0.62rem] font-bold text-white">
                {lessons.length}
              </span>
              {selectedLessonSummary ? (
                <span
                  className="rounded-full border border-sand-200 bg-white px-2 py-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-slate-500"
                  style={{ writingMode: "vertical-rl" }}
                >
                  {selectedLessonSummary.reviewStatus.replace("_", " ")}
                </span>
              ) : null}
            </div>
          ) : (
            <div className="sticky top-0 max-h-[calc(100dvh-4.6rem)] overflow-y-auto px-2.5 py-2.5">
              <div className="mb-2 flex items-center justify-between gap-2 px-1">
                <p className="type-eyebrow-muted text-[0.62rem]">Lessons</p>
                <button
                  aria-label="Collapse lesson list"
                  className="grid size-8 place-items-center rounded-full border border-sand-200 bg-white text-slate-500 transition hover:border-brand-200 hover:text-brand-700"
                  onClick={() => togglePaneCollapsed("left")}
                  type="button"
                >
                  <CaretLeft size={16} weight="bold" />
                </button>
              </div>
              {loadingList ? (
                <LoadingPanel className="min-h-[220px]" lines={6} />
              ) : (
                <div className="grid gap-2">
                  {lessons.map((item) => {
                    const active = item.id === selectedLessonId;

                    return (
                      <button
                        key={item.id}
                        className={`rounded-[0.9rem] border p-2.5 text-left transition duration-300 active:scale-[0.99] ${
                          active
                            ? "border-brand-300 bg-brand-50"
                            : "border-sand-200 bg-white/76 hover:border-brand-200"
                        }`}
                        onClick={() => setSelectedLessonId(item.id)}
                        type="button"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="rounded-[0.5rem] bg-brand-500 px-2 py-0.5 text-[0.64rem] font-bold text-white">
                            {item.level}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-bold ${statusClassName(
                              item.reviewStatus,
                            )}`}
                          >
                            {item.reviewStatus.replace("_", " ")}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-[0.8rem] font-semibold leading-snug text-ink-950">
                          {pickText(item.title)}
                        </p>
                        <p className="mt-1.5 text-[0.68rem] font-semibold text-slate-500">
                          {item.approvedSegmentCount}/{item.segmentCount} published
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </aside>

        <button
          aria-label="Resize lesson list"
          className={`hidden cursor-col-resize border-r border-sand-200 bg-white/32 transition hover:bg-brand-50 lg:block ${
            resizingPane === "left" ? "bg-brand-50" : ""
          } ${paneLayout.leftCollapsed ? "pointer-events-none opacity-40" : ""}`}
          disabled={paneLayout.leftCollapsed}
          onDoubleClick={() =>
            setPaneLayout((current) => ({
              ...current,
              leftWidth: defaultReviewPaneLayout.leftWidth,
            }))
          }
          onPointerDown={(event) => startPaneResize("left", event)}
          type="button"
        >
          <span className="mx-auto block h-full w-px bg-sand-300" />
        </button>

        <main className="min-h-0 min-w-0 overflow-hidden">
          {loadingDetail ? (
            <div className="p-4 lg:p-6">
              <LoadingPanel className="min-h-[420px]" lines={8} />
            </div>
          ) : !lesson || !document || !selectedSegment ? (
            <div className="p-4 lg:p-6">
              <ErrorState
                description="Select a lesson from the left rail to start reviewing."
                title="No review document selected"
              />
            </div>
          ) : (
            <section className="h-full min-h-0 min-w-0 overflow-x-hidden overflow-y-auto border-b border-sand-200 xl:border-b-0">
                <div className="grid gap-3 p-3 lg:p-4">
                  <InternalWaveformReviewPlayer
                    key={document.lessonId}
                    activeWordIndex={activeWordIndex}
                    audioUrl={listeningReviewRepository.getAudioUrl(document.lessonId)}
                    onActiveWordChange={setActiveWordIndex}
                    onSelectWord={setSelectedWordIndex}
                    onUpdateWordTiming={(wordIndex, patch) =>
                      updateWord(selectedSegment.id, wordIndex, patch)
                    }
                    playbackCommand={waveformCommand}
                    segmentEndSeconds={selectedSegment.endSeconds}
                    segmentOrder={selectedSegment.order}
                    segmentStartSeconds={selectedSegment.startSeconds}
                    selectedWordIndex={selectedWordIndex}
                    title={pickText(document.title)}
                    words={selectedSegment.words}
                  />

                  <div className="rounded-[1rem] border border-sand-200 bg-white/70 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-baseline gap-3">
                        <p className="type-eyebrow-muted text-[0.62rem]">Line editor</p>
                        <h3 className="text-[0.95rem] font-semibold text-ink-950">
                          Segment #{selectedSegment.order}
                        </h3>
                      </div>
                      <button
                        className={`inline-flex min-h-8 items-center gap-2 rounded-full border px-3 text-[0.74rem] font-bold transition duration-300 active:scale-[0.98] ${
                          selectedSegment.approved
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-sand-200 bg-white text-slate-600 hover:border-brand-200"
                        }`}
                        onClick={() =>
                          updateSegment(selectedSegment.id, (segment) => ({
                            ...segment,
                            approved: !segment.approved,
                          }))
                        }
                        type="button"
                      >
                        <CheckCircle size={16} weight="duotone" />
                        {selectedSegment.approved ? "Approved line" : "Approve line"}
                      </button>
                    </div>

                    <div className="mt-3 grid gap-2.5 md:grid-cols-[6.5rem_6.5rem_minmax(0,1fr)]">
                      <label className="field-shell">
                        <span className="field-label">Start</span>
                        <input
                          className="field-input min-h-9 rounded-[0.75rem] px-3 font-mono text-[0.82rem]"
                          min={0}
                          onChange={(event) =>
                            updateSegment(selectedSegment.id, (segment) => ({
                              ...segment,
                              approved: false,
                              startSeconds: Number(event.target.value),
                            }))
                          }
                          step="0.05"
                          type="number"
                          value={selectedSegment.startSeconds}
                        />
                      </label>
                      <label className="field-shell">
                        <span className="field-label">End</span>
                        <input
                          className="field-input min-h-9 rounded-[0.75rem] px-3 font-mono text-[0.82rem]"
                          min={0}
                          onChange={(event) =>
                            updateSegment(selectedSegment.id, (segment) => ({
                              ...segment,
                              approved: false,
                              endSeconds: Number(event.target.value),
                            }))
                          }
                          step="0.05"
                          type="number"
                          value={selectedSegment.endSeconds}
                        />
                      </label>
                      <label className="field-shell">
                        <span className="field-label">Transcript line</span>
                        <textarea
                          className="field-input min-h-16 resize-y rounded-[0.8rem] text-[0.82rem]"
                          onChange={(event) =>
                            updateSegment(selectedSegment.id, (segment) => ({
                              ...segment,
                              approved: false,
                              transcript: event.target.value,
                            }))
                          }
                          value={selectedSegment.transcript}
                        />
                      </label>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[0.74rem] font-semibold text-slate-500">
                        Select a word below, then adjust exact timing in the word panel.
                      </p>
                      <button
                        className="button-secondary min-h-8 px-3 text-[0.74rem]"
                        onClick={() =>
                          updateSegment(selectedSegment.id, (segment) => ({
                            ...segment,
                            approved: false,
                            words: buildWordsFromTranscript(segment),
                          }))
                        }
                        type="button"
                      >
                        <ArrowClockwise size={15} weight="duotone" />
                        Rebuild words
                      </button>
                    </div>

                    <div className="mt-3 flex max-h-[5.8rem] flex-wrap gap-2 overflow-y-auto pr-1">
                      {selectedSegment.words.map((word, index) => {
                        const selected = index === selectedWordIndex;
                        const active = index === activeWordIndex;

                        return (
                          <button
                            key={`${selectedSegment.id}-${word.index}-${word.text}`}
                            ref={(node) => {
                              wordButtonRefs.current[index] = node;
                            }}
                            className={`rounded-[0.68rem] border px-2.5 py-1.5 text-[0.74rem] font-semibold transition duration-300 active:scale-[0.98] ${
                              selected
                                ? "border-brand-300 bg-brand-50 text-brand-800"
                                : active
                                  ? "border-amber-300 bg-amber-100 text-amber-900 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.28)]"
                                  : word.source === "SEGMENT_FALLBACK"
                                    ? "border-amber-200 bg-amber-50 text-amber-800"
                                    : "border-sand-200 bg-white text-slate-600 hover:border-brand-200"
                            }`}
                            onClick={() => {
                              setSelectedWordIndex(index);
                              setActiveWordIndex(index);
                              sendWaveformCommand("PLAY_WORD", index);
                            }}
                            type="button"
                          >
                            {word.text}
                            <span className="ml-1 font-mono text-[0.65rem] opacity-70">
                              {formatSeconds(word.startSeconds)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedWord ? (
                    <div className="rounded-[1rem] border border-sand-200 bg-white/70 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-baseline gap-3">
                          <p className="type-eyebrow-muted text-[0.62rem]">Word timing</p>
                          <h3 className="text-[0.95rem] font-semibold text-ink-950">
                            #{selectedWordIndex + 1} {selectedWord.text}
                          </h3>
                        </div>
                        <span className="rounded-full bg-sand-100 px-3 py-1 text-[0.68rem] font-bold text-slate-600">
                          {selectedWord.source}
                        </span>
                      </div>

                      <div className="mt-3 grid gap-2.5 md:grid-cols-3">
                        <label className="field-shell">
                          <span className="field-label">Word</span>
                          <input
                            className="field-input min-h-9 rounded-[0.75rem] px-3 text-[0.82rem]"
                            onChange={(event) =>
                              updateWord(selectedSegment.id, selectedWordIndex, {
                                text: event.target.value,
                              })
                            }
                            value={selectedWord.text}
                          />
                        </label>
                        <label className="field-shell">
                          <span className="field-label">Start</span>
                          <input
                            className="field-input min-h-9 rounded-[0.75rem] px-3 font-mono text-[0.82rem]"
                            min={0}
                            onChange={(event) =>
                              updateWord(selectedSegment.id, selectedWordIndex, {
                                startSeconds: Number(event.target.value),
                              })
                            }
                            step="0.01"
                            type="number"
                            value={selectedWord.startSeconds}
                          />
                        </label>
                        <label className="field-shell">
                          <span className="field-label">End</span>
                          <input
                            className="field-input min-h-9 rounded-[0.75rem] px-3 font-mono text-[0.82rem]"
                            min={0}
                            onChange={(event) =>
                              updateWord(selectedSegment.id, selectedWordIndex, {
                                endSeconds: Number(event.target.value),
                              })
                            }
                            step="0.01"
                            type="number"
                            value={selectedWord.endSeconds}
                          />
                        </label>
                      </div>
                    </div>
                  ) : null}
                </div>
            </section>
          )}
        </main>

        <button
          aria-label="Resize segment list"
          className={`hidden cursor-col-resize border-l border-sand-200 bg-white/32 transition hover:bg-brand-50 lg:block ${
            resizingPane === "right" ? "bg-brand-50" : ""
          } ${paneLayout.rightCollapsed ? "pointer-events-none opacity-40" : ""}`}
          disabled={paneLayout.rightCollapsed}
          onDoubleClick={() =>
            setPaneLayout((current) => ({
              ...current,
              rightWidth: defaultReviewPaneLayout.rightWidth,
            }))
          }
          onPointerDown={(event) => startPaneResize("right", event)}
          type="button"
        >
          <span className="mx-auto block h-full w-px bg-sand-300" />
        </button>

        <aside className="relative min-w-0 border-l border-sand-200 bg-[rgb(255,252,247)]">
          {paneLayout.rightCollapsed ? (
            <div className="flex h-full flex-col items-center gap-3 px-2 py-3">
              <button
                aria-label="Expand segment list"
                className="grid size-9 place-items-center rounded-full border border-sand-200 bg-white text-slate-600 transition hover:border-brand-200 hover:text-brand-700"
                onClick={() => togglePaneCollapsed("right")}
                type="button"
              >
                <CaretLeft size={17} weight="bold" />
              </button>
              <ListChecks className="text-slate-500" size={20} weight="duotone" />
              {document ? (
                <span
                  className="rounded-full border border-sand-200 bg-white px-2 py-2 text-[0.62rem] font-bold tracking-[0.16em] text-slate-500"
                  style={{ writingMode: "vertical-rl" }}
                >
                  {approvedSegmentCount}/{document.segments.length} approved
                </span>
              ) : null}
            </div>
          ) : (
            <div className="sticky top-0 max-h-[calc(100dvh-4.6rem)] overflow-y-auto px-3 py-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="type-eyebrow-muted text-[0.62rem]">Segments</p>
                  <p className="mt-0.5 text-[0.8rem] font-semibold text-ink-950">
                    {document ? `${approvedSegmentCount}/${document.segments.length}` : "0/0"} approved
                  </p>
                </div>
                <button
                  aria-label="Collapse segment list"
                  className="grid size-8 place-items-center rounded-full border border-sand-200 bg-white text-slate-500 transition hover:border-brand-200 hover:text-brand-700"
                  onClick={() => togglePaneCollapsed("right")}
                  type="button"
                >
                  <CaretRight size={16} weight="bold" />
                </button>
              </div>

              {document && selectedSegment ? (
                <div className="grid gap-2">
                  {document.segments.map((segment) => {
                    const active = segment.id === selectedSegment.id;

                    return (
                      <button
                        key={segment.id}
                        className={`rounded-[0.9rem] border p-2.5 text-left transition duration-300 active:scale-[0.99] ${
                          active
                            ? "border-brand-300 bg-brand-50"
                            : "border-sand-200 bg-white/70 hover:border-brand-200"
                        }`}
                        onClick={() => {
                          setSelectedSegmentId(segment.id);
                          setSelectedWordIndex(0);
                          setActiveWordIndex(null);
                          sendWaveformCommand("JUMP_START");
                        }}
                        type="button"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-mono text-[0.74rem] font-bold text-ink-950">
                            #{segment.order}
                          </span>
                          {segment.approved ? (
                            <CheckCircle
                              className="text-emerald-600"
                              size={17}
                              weight="bold"
                            />
                          ) : (
                            <Clock className="text-slate-400" size={17} weight="duotone" />
                          )}
                        </div>
                        <p className="mt-1.5 line-clamp-2 text-[0.74rem] font-semibold leading-relaxed text-slate-500">
                          {segment.transcript}
                        </p>
                        {segment.words.some((word) => word.source === "SEGMENT_FALLBACK") ? (
                          <p className="mt-1.5 inline-flex items-center gap-1 text-[0.64rem] font-bold text-amber-700">
                            <WarningCircle size={13} weight="duotone" />
                            fallback timing
                          </p>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <ErrorState
                  description="Open a lesson to inspect each segment."
                  title="No segments"
                />
              )}
            </div>
          )}
        </aside>
      </div>
    </WorkspaceCanvas>
  );
}

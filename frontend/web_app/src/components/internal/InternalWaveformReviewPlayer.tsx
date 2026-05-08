"use client";

import {
  ArrowClockwise,
  ArrowsInSimple,
  ArrowsOutSimple,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  Pause,
  Play,
  SpinnerGap,
  Waveform,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { WheelEvent as ReactWheelEvent } from "react";
import type WaveSurfer from "wavesurfer.js";
import type RegionsPlugin from "wavesurfer.js/plugins/regions";
import type { Region } from "wavesurfer.js/plugins/regions";

type ReviewWord = {
  endSeconds: number;
  index: number;
  source?: string;
  startSeconds: number;
  text: string;
};

export type WaveformPlaybackCommand = {
  action: "FOCUS_WORD" | "JUMP_START" | "PLAY_LINE" | "PLAY_PAUSE" | "PLAY_WORD" | "STOP";
  id: number;
  wordIndex?: number;
};

type InternalWaveformReviewPlayerProps = {
  activeWordIndex?: number | null;
  audioUrl: string;
  playbackCommand?: WaveformPlaybackCommand | null;
  segmentEndSeconds: number;
  segmentOrder: number;
  segmentStartSeconds: number;
  selectedWordIndex: number;
  title: string;
  words: ReviewWord[];
  onActiveWordChange?: (index: number | null) => void;
  onSelectWord: (index: number) => void;
  onUpdateWordTiming: (
    index: number,
    patch: { endSeconds: number; startSeconds: number },
  ) => void;
};

type WaveformHeightMode = "compact" | "normal" | "tall";

type WaveformReviewView = {
  heightMode: WaveformHeightMode;
  zoomPxPerSecond: number;
};

const waveformReviewViewStorageKey = "internal-waveform-review-view:v1";
const waveformHeightByMode: Record<WaveformHeightMode, number> = {
  compact: 58,
  normal: 86,
  tall: 128,
};
const minWaveformZoom = 24;
const maxWaveformZoom = 560;
const defaultWaveformView: WaveformReviewView = {
  heightMode: "normal",
  zoomPxPerSecond: 125,
};

function formatRangeValue(value: number) {
  return `${value.toFixed(2)}s`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getInitialWaveformReviewView(): WaveformReviewView {
  if (typeof window === "undefined") {
    return defaultWaveformView;
  }

  try {
    const stored = window.localStorage.getItem(waveformReviewViewStorageKey);

    if (!stored) {
      return defaultWaveformView;
    }

    const parsed = JSON.parse(stored) as Partial<WaveformReviewView>;
    const heightMode =
      parsed.heightMode === "compact" || parsed.heightMode === "tall"
        ? parsed.heightMode
        : "normal";
    const zoomPxPerSecond = clamp(
      Number(parsed.zoomPxPerSecond) || defaultWaveformView.zoomPxPerSecond,
      minWaveformZoom,
      maxWaveformZoom,
    );

    return { heightMode, zoomPxPerSecond };
  } catch {
    return defaultWaveformView;
  }
}

function getRegionColor(
  index: number,
  selectedWordIndex: number,
  activeWordIndex: number | null | undefined,
  source?: string,
) {
  if (index === selectedWordIndex) {
    return "rgba(245, 158, 11, 0.38)";
  }

  if (index === activeWordIndex) {
    return "rgba(245, 158, 11, 0.24)";
  }

  if (source === "MODEL") {
    return "rgba(16, 185, 129, 0.18)";
  }

  if (source === "INTERPOLATED") {
    return "rgba(59, 130, 246, 0.16)";
  }

  return "rgba(100, 116, 139, 0.12)";
}

function hasTiming(word: ReviewWord) {
  return word.endSeconds > word.startSeconds && word.startSeconds >= 0;
}

function getWaveformHeight(mode: WaveformHeightMode) {
  return waveformHeightByMode[mode] ?? waveformHeightByMode.normal;
}

function getNextHeightMode(mode: WaveformHeightMode): WaveformHeightMode {
  if (mode === "compact") {
    return "normal";
  }

  if (mode === "normal") {
    return "tall";
  }

  return "compact";
}

function findWordIndexAtTime(words: ReviewWord[], currentTime: number) {
  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];

    if (
      word &&
      hasTiming(word) &&
      currentTime >= word.startSeconds - 0.025 &&
      currentTime <= word.endSeconds + 0.025
    ) {
      return index;
    }
  }

  return null;
}

export function InternalWaveformReviewPlayer({
  activeWordIndex = null,
  audioUrl,
  onActiveWordChange,
  onSelectWord,
  onUpdateWordTiming,
  playbackCommand,
  segmentEndSeconds,
  segmentOrder,
  segmentStartSeconds,
  selectedWordIndex,
  title,
  words,
}: InternalWaveformReviewPlayerProps) {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const regionsRef = useRef<RegionsPlugin | null>(null);
  const onActiveWordChangeRef = useRef(onActiveWordChange);
  const onSelectWordRef = useRef(onSelectWord);
  const onUpdateWordTimingRef = useRef(onUpdateWordTiming);
  const suppressRegionUpdatesRef = useRef(false);
  const wordsRef = useRef(words);
  const activeWordIndexRef = useRef<number | null>(activeWordIndex);
  const selectedWordIndexRef = useRef(selectedWordIndex);
  const waveformViewRef = useRef<WaveformReviewView>(defaultWaveformView);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const centerSelectedWordRef = useRef(() => {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState(false);
  const [waveformView, setWaveformView] = useState<WaveformReviewView>(
    getInitialWaveformReviewView,
  );
  const selectedWord = words[selectedWordIndex] ?? null;
  const activeWord = activeWordIndex !== null ? words[activeWordIndex] ?? null : null;
  const waveformHeight = getWaveformHeight(waveformView.heightMode);
  const segmentRange = useMemo(
    () => `${formatRangeValue(segmentStartSeconds)} - ${formatRangeValue(segmentEndSeconds)}`,
    [segmentEndSeconds, segmentStartSeconds],
  );
  const wordStructureSignature = useMemo(
    () =>
      words
        .map(
          (word) =>
            `${word.index}:${word.text}:${word.source ?? ""}:${hasTiming(word) ? 1 : 0}`,
        )
        .join("|"),
    [words],
  );

  const clearStopTimer = () => {
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
  };

  const emitActiveWord = (index: number | null) => {
    if (activeWordIndexRef.current === index) {
      return;
    }

    activeWordIndexRef.current = index;
    onActiveWordChangeRef.current?.(index);
  };

  const centerTime = (seconds: number) => {
    const wavesurfer = wavesurferRef.current;

    if (!wavesurfer) {
      return;
    }

    const duration = wavesurfer.getDuration();

    if (!Number.isFinite(duration) || duration <= 0) {
      return;
    }

    const visibleSeconds = Math.max(
      0.2,
      wavesurfer.getWidth() / Math.max(1, waveformViewRef.current.zoomPxPerSecond),
    );
    const leftEdgeSeconds = clamp(
      seconds - visibleSeconds / 2,
      0,
      Math.max(0, duration - visibleSeconds),
    );

    wavesurfer.setScrollTime(leftEdgeSeconds);
  };

  const centerWord = (index: number | null | undefined) => {
    if (index === null || index === undefined) {
      return;
    }

    const word = wordsRef.current[index];

    if (!word || !hasTiming(word)) {
      return;
    }

    window.requestAnimationFrame(() => {
      centerTime((word.startSeconds + word.endSeconds) / 2);
    });
  };

  const applyWaveformZoom = (zoomPxPerSecond: number) => {
    const wavesurfer = wavesurferRef.current;

    if (!wavesurfer) {
      return;
    }

    try {
      wavesurfer.zoom(zoomPxPerSecond);
    } catch {
      return;
    }
  };

  const focusWord = (index: number, shouldPlay: boolean) => {
    const word = wordsRef.current[index];

    if (!word || !hasTiming(word)) {
      return;
    }

    onSelectWordRef.current(index);
    emitActiveWord(index);
    centerWord(index);

    if (shouldPlay) {
      playRange(word.startSeconds, word.endSeconds, index);
    }
  };

  const playRange = (startSeconds: number, endSeconds: number, nextActiveIndex?: number) => {
    const wavesurfer = wavesurferRef.current;

    if (!wavesurfer || endSeconds <= startSeconds) {
      return;
    }

    clearStopTimer();
    wavesurfer.pause();
    centerTime((startSeconds + Math.min(endSeconds, startSeconds + 2)) / 2);

    if (nextActiveIndex !== undefined) {
      emitActiveWord(nextActiveIndex);
    }

    void wavesurfer.play(startSeconds, endSeconds);
  };

  const stopPlayback = () => {
    clearStopTimer();
    wavesurferRef.current?.pause();
  };

  const updateWaveformView = (patch: Partial<WaveformReviewView>) => {
    setWaveformView((current) => ({
      ...current,
      ...patch,
      zoomPxPerSecond: clamp(
        patch.zoomPxPerSecond ?? current.zoomPxPerSecond,
        minWaveformZoom,
        maxWaveformZoom,
      ),
    }));
  };

  centerSelectedWordRef.current = () => {
    centerWord(activeWordIndexRef.current ?? selectedWordIndexRef.current);
  };

  useEffect(() => {
    onActiveWordChangeRef.current = onActiveWordChange;
    onSelectWordRef.current = onSelectWord;
    onUpdateWordTimingRef.current = onUpdateWordTiming;
  }, [onActiveWordChange, onSelectWord, onUpdateWordTiming]);

  useEffect(() => {
    wordsRef.current = words;
  }, [words]);

  useEffect(() => {
    activeWordIndexRef.current = activeWordIndex;
  }, [activeWordIndex]);

  useEffect(() => {
    selectedWordIndexRef.current = selectedWordIndex;
    centerWord(selectedWordIndex);
  }, [selectedWordIndex, segmentOrder]);

  useEffect(() => {
    waveformViewRef.current = waveformView;
    window.localStorage.setItem(waveformReviewViewStorageKey, JSON.stringify(waveformView));

    const wavesurfer = wavesurferRef.current;

    if (!wavesurfer) {
      return;
    }

    wavesurfer.setOptions({ height: waveformHeight });
    applyWaveformZoom(waveformView.zoomPxPerSecond);
    window.requestAnimationFrame(() => centerSelectedWordRef.current());
  }, [waveformHeight, waveformView]);

  useEffect(() => {
    const target = waveformRef.current;

    if (!target || typeof ResizeObserver === "undefined") {
      return;
    }

    let animationFrame = 0;
    const resizeObserver = new ResizeObserver(() => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        centerSelectedWordRef.current();
      });
    });

    resizeObserver.observe(target);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [audioUrl]);

  useEffect(() => {
    if (!waveformRef.current || !timelineRef.current) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.all([
      import("wavesurfer.js"),
      import("wavesurfer.js/plugins/regions"),
      import("wavesurfer.js/plugins/timeline"),
    ])
      .then(([{ default: WaveSurferModule }, { default: Regions }, { default: Timeline }]) => {
        if (cancelled || !waveformRef.current || !timelineRef.current) {
          return;
        }

        const currentView = waveformViewRef.current;
        const regions = Regions.create();
        const wavesurfer = WaveSurferModule.create({
          autoCenter: false,
          autoScroll: false,
          barGap: 2,
          barRadius: 2,
          barWidth: 2,
          container: waveformRef.current,
          cursorColor: "#c05621",
          cursorWidth: 2,
          dragToSeek: true,
          height: getWaveformHeight(currentView.heightMode),
          hideScrollbar: false,
          interact: true,
          minPxPerSec: currentView.zoomPxPerSecond,
          normalize: true,
          progressColor: "#f59e0b",
          url: audioUrl,
          waveColor: "#94a3b8",
        });

        wavesurfer.registerPlugin(regions);
        wavesurfer.registerPlugin(
          Timeline.create({
            container: timelineRef.current,
            height: 18,
            style: {
              color: "#64748b",
              fontSize: "11px",
              fontWeight: "700",
            },
          }),
        );

        wavesurfer.on("ready", () => {
          setLoading(false);
          wavesurfer.setTime(segmentStartSeconds);
          applyWaveformZoom(waveformViewRef.current.zoomPxPerSecond);
          window.requestAnimationFrame(() => centerTime(segmentStartSeconds));
        });
        wavesurfer.on("play", () => setPlaying(true));
        wavesurfer.on("pause", () => setPlaying(false));
        wavesurfer.on("finish", () => setPlaying(false));
        wavesurfer.on("timeupdate", (currentTime) => {
          const nextActiveIndex = findWordIndexAtTime(wordsRef.current, currentTime);

          if (nextActiveIndex !== activeWordIndexRef.current) {
            emitActiveWord(nextActiveIndex);

            if (nextActiveIndex !== null && wavesurfer.isPlaying()) {
              centerWord(nextActiveIndex);
            }
          }
        });
        wavesurfer.on("error", (caughtError) => {
          setLoading(false);
          setError(caughtError.message || "Unable to load audio waveform");
        });

        regions.on("region-clicked", (region, event) => {
          event.stopPropagation();
          const index = Number(region.id.replace("word-", ""));

          if (Number.isFinite(index)) {
            focusWord(index, true);
          }
        });
        regions.on("region-updated", (region) => {
          if (suppressRegionUpdatesRef.current) {
            return;
          }

          const index = Number(region.id.replace("word-", ""));

          if (!Number.isFinite(index)) {
            return;
          }

          const existingWord = wordsRef.current[index];
          const nextStartSeconds = Number(region.start.toFixed(3));
          const nextEndSeconds = Number(region.end.toFixed(3));

          if (
            existingWord &&
            Math.abs(existingWord.startSeconds - nextStartSeconds) < 0.001 &&
            Math.abs(existingWord.endSeconds - nextEndSeconds) < 0.001
          ) {
            return;
          }

          onUpdateWordTimingRef.current(index, {
            endSeconds: nextEndSeconds,
            startSeconds: nextStartSeconds,
          });
        });

        wavesurferRef.current = wavesurfer;
        regionsRef.current = regions;

        suppressRegionUpdatesRef.current = true;
        regions.clearRegions();
        wordsRef.current.forEach((word, index) => {
          if (!hasTiming(word)) {
            return;
          }

          regions.addRegion({
            color: getRegionColor(
              index,
              selectedWordIndexRef.current,
              activeWordIndexRef.current,
              word.source,
            ),
            content: index === selectedWordIndexRef.current ? word.text : "",
            drag: index === selectedWordIndexRef.current,
            end: word.endSeconds,
            id: `word-${index}`,
            minLength: 0.03,
            resize: index === selectedWordIndexRef.current,
            start: word.startSeconds,
          });
        });
        window.setTimeout(() => {
          suppressRegionUpdatesRef.current = false;
        }, 0);
      })
      .catch((caughtError) => {
        setLoading(false);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to initialize waveform editor",
        );
      });

    return () => {
      cancelled = true;
      clearStopTimer();
      regionsRef.current = null;
      wavesurferRef.current?.destroy();
      wavesurferRef.current = null;
    };
  }, [audioUrl]);

  useEffect(() => {
    const regions = regionsRef.current;
    const wavesurfer = wavesurferRef.current;

    if (!regions || !wavesurfer) {
      return;
    }

    suppressRegionUpdatesRef.current = true;
    regions.clearRegions();
    words.forEach((word, index) => {
      if (!hasTiming(word)) {
        return;
      }

      regions.addRegion({
        color: getRegionColor(
          index,
          selectedWordIndex,
          activeWordIndexRef.current,
          word.source,
        ),
        content: index === selectedWordIndex ? word.text : "",
        drag: index === selectedWordIndex,
        end: word.endSeconds,
        id: `word-${index}`,
        minLength: 0.03,
        resize: index === selectedWordIndex,
        start: word.startSeconds,
      });
    });
    wavesurfer.setTime(segmentStartSeconds);
    window.setTimeout(() => {
      suppressRegionUpdatesRef.current = false;
    }, 0);
  }, [segmentOrder, segmentStartSeconds, wordStructureSignature]);

  useEffect(() => {
    const regions = regionsRef.current;

    if (!regions) {
      return;
    }

    suppressRegionUpdatesRef.current = true;
    regions.getRegions().forEach((region: Region) => {
      const index = Number(region.id.replace("word-", ""));
      const word = words[index];

      if (!word || !hasTiming(word)) {
        return;
      }

      region.setOptions({
        color: getRegionColor(index, selectedWordIndex, activeWordIndex, word?.source),
        content: index === selectedWordIndex ? word.text : "",
        drag: index === selectedWordIndex,
        end: word.endSeconds,
        resize: index === selectedWordIndex,
        start: word.startSeconds,
      });
    });
    window.setTimeout(() => {
      suppressRegionUpdatesRef.current = false;
    }, 0);
  }, [activeWordIndex, selectedWordIndex, words]);

  useEffect(() => {
    if (!playbackCommand) {
      return;
    }

    if (playbackCommand.action === "PLAY_PAUSE") {
      clearStopTimer();
      void wavesurferRef.current?.playPause();
      return;
    }

    if (playbackCommand.action === "PLAY_LINE") {
      playRange(segmentStartSeconds, segmentEndSeconds);
      return;
    }

    if (playbackCommand.action === "FOCUS_WORD") {
      const targetIndex = playbackCommand.wordIndex ?? selectedWordIndex;
      emitActiveWord(targetIndex);
      centerWord(targetIndex);
      return;
    }

    if (playbackCommand.action === "PLAY_WORD") {
      const targetIndex = playbackCommand.wordIndex ?? selectedWordIndex;
      const targetWord = words[targetIndex];

      if (targetWord) {
        playRange(targetWord.startSeconds, targetWord.endSeconds, targetIndex);
      }
      return;
    }

    if (playbackCommand.action === "JUMP_START") {
      clearStopTimer();
      wavesurferRef.current?.setTime(segmentStartSeconds);
      centerTime(segmentStartSeconds);
      return;
    }

    if (playbackCommand.action === "STOP") {
      stopPlayback();
    }
  }, [playbackCommand]);

  const zoomOut = () => {
    updateWaveformView({
      zoomPxPerSecond: waveformView.zoomPxPerSecond / 1.35,
    });
  };

  const zoomIn = () => {
    updateWaveformView({
      zoomPxPerSecond: waveformView.zoomPxPerSecond * 1.35,
    });
  };

  const fitWaveform = () => {
    const wavesurfer = wavesurferRef.current;

    if (!wavesurfer) {
      return;
    }

    const duration = wavesurfer.getDuration();
    const width = wavesurfer.getWidth();

    if (!Number.isFinite(duration) || duration <= 0 || width <= 0) {
      return;
    }

    updateWaveformView({
      zoomPxPerSecond: Math.ceil(width / duration),
    });
  };

  const handleWaveformWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (event.ctrlKey) {
      return;
    }

    const wavesurfer = wavesurferRef.current;

    if (!wavesurfer) {
      return;
    }

    const scrollWidth = wavesurfer.getWrapper().scrollWidth;
    const viewportWidth = wavesurfer.getWidth();
    const maxScroll = Math.max(0, scrollWidth - viewportWidth);

    if (maxScroll <= 1) {
      return;
    }

    const dominantDelta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    const deltaMultiplier =
      event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? viewportWidth : 1;

    event.preventDefault();
    wavesurfer.setScroll(
      clamp(wavesurfer.getScroll() + dominantDelta * deltaMultiplier, 0, maxScroll),
    );
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-[1rem] border border-sand-200 bg-white/82 p-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 md:flex md:items-baseline md:gap-3">
          <p className="type-eyebrow-muted text-[0.62rem]">Audio waveform</p>
          <h3 className="line-clamp-1 text-[0.95rem] font-semibold text-ink-950">
            {title}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[0.72rem] font-bold text-slate-500">
          <span className="rounded-full bg-sand-100 px-2.5 py-1 font-mono text-ink-950">
            #{segmentOrder}
          </span>
          <span className="rounded-full bg-sand-100 px-2.5 py-1 font-mono">
            {segmentRange}
          </span>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            aria-label="Zoom waveform out"
            className="grid min-h-7 min-w-8 place-items-center rounded-full border border-sand-200 bg-white text-slate-600 transition duration-300 hover:border-brand-200 hover:text-brand-700 active:scale-[0.98]"
            disabled={loading || Boolean(error)}
            onClick={zoomOut}
            type="button"
          >
            <MagnifyingGlassMinus size={15} weight="duotone" />
          </button>
          <button
            className="min-h-7 rounded-full border border-sand-200 bg-white px-2.5 text-[0.68rem] font-bold text-slate-600 transition duration-300 hover:border-brand-200 hover:text-brand-700 active:scale-[0.98]"
            disabled={loading || Boolean(error)}
            onClick={fitWaveform}
            type="button"
          >
            Fit
          </button>
          <button
            aria-label="Zoom waveform in"
            className="grid min-h-7 min-w-8 place-items-center rounded-full border border-sand-200 bg-white text-slate-600 transition duration-300 hover:border-brand-200 hover:text-brand-700 active:scale-[0.98]"
            disabled={loading || Boolean(error)}
            onClick={zoomIn}
            type="button"
          >
            <MagnifyingGlassPlus size={15} weight="duotone" />
          </button>
          <button
            className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-sand-200 bg-white px-2.5 text-[0.68rem] font-bold text-slate-600 transition duration-300 hover:border-brand-200 hover:text-brand-700 active:scale-[0.98]"
            onClick={() =>
              updateWaveformView({
                heightMode: getNextHeightMode(waveformView.heightMode),
              })
            }
            type="button"
          >
            {waveformView.heightMode === "tall" ? (
              <ArrowsInSimple size={14} weight="duotone" />
            ) : (
              <ArrowsOutSimple size={14} weight="duotone" />
            )}
            {waveformView.heightMode}
          </button>
        </div>
        <span className="rounded-full bg-sand-50 px-2.5 py-1 text-[0.66rem] font-bold text-slate-500">
          {Math.round(waveformView.zoomPxPerSecond)} px/s
        </span>
      </div>

      <div className="relative mt-2.5 min-w-0 overflow-hidden rounded-[0.85rem] border border-sand-200 bg-slate-950 p-2">
        {loading ? (
          <div className="absolute inset-0 z-10 grid place-items-center bg-slate-950/82 text-white">
            <span className="inline-flex items-center gap-2 text-[0.82rem] font-bold">
              <SpinnerGap className="animate-spin" size={18} weight="bold" />
              Loading waveform
            </span>
          </div>
        ) : null}
        {error ? (
          <div className="absolute inset-0 z-10 grid place-items-center bg-rose-950/88 px-6 text-center text-[0.82rem] font-bold text-white">
            {error}
          </div>
        ) : null}
        <div
          onWheel={handleWaveformWheel}
          ref={waveformRef}
          title="Scroll to move the waveform"
          className="internal-waveform-host min-w-0 max-w-full overflow-hidden overscroll-contain"
          style={{ minHeight: waveformHeight }}
        />
        <div
          onWheel={handleWaveformWheel}
          ref={timelineRef}
          title="Scroll to move the waveform"
          className="internal-waveform-timeline min-w-0 max-w-full overflow-hidden overscroll-contain border-t border-white/10 pt-1"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="button-primary min-h-8 px-3 text-[0.78rem]"
            disabled={loading || Boolean(error)}
            onClick={() => playRange(segmentStartSeconds, segmentEndSeconds)}
            type="button"
          >
            <Play size={16} weight="fill" />
            Line
          </button>
          <button
            className="button-secondary min-h-8 px-3 text-[0.78rem]"
            disabled={loading || Boolean(error)}
            onClick={() => {
              clearStopTimer();
              void wavesurferRef.current?.playPause();
            }}
            type="button"
          >
            {playing ? (
              <Pause size={16} weight="duotone" />
            ) : (
              <Waveform size={16} weight="duotone" />
            )}
            {playing ? "Pause" : "Audio"}
          </button>
          <button
            className="button-secondary min-h-8 px-3 text-[0.78rem]"
            disabled={loading || Boolean(error)}
            onClick={() => {
              wavesurferRef.current?.setTime(segmentStartSeconds);
              centerTime(segmentStartSeconds);
            }}
            type="button"
          >
            <ArrowClockwise size={16} weight="duotone" />
            Jump
          </button>
        </div>
        {selectedWord ? (
          <button
            className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-[0.74rem] font-bold text-brand-800 transition duration-300 hover:border-brand-300"
            onClick={() =>
              playRange(selectedWord.startSeconds, selectedWord.endSeconds, selectedWordIndex)
            }
            type="button"
          >
            "{selectedWord.text}" {formatRangeValue(selectedWord.startSeconds)}
          </button>
        ) : activeWord ? (
          <span className="rounded-full border border-sand-200 bg-sand-50 px-3 py-1.5 text-[0.74rem] font-bold text-slate-500">
            "{activeWord.text}" {formatRangeValue(activeWord.startSeconds)}
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5 text-[0.64rem] font-semibold text-slate-400">
        <span className="rounded-full bg-sand-50 px-2 py-1">Space play/pause</span>
        <span className="rounded-full bg-sand-50 px-2 py-1">Enter line</span>
        <span className="rounded-full bg-sand-50 px-2 py-1">Shift+Space word</span>
        <span className="rounded-full bg-sand-50 px-2 py-1">Wheel scroll waveform</span>
      </div>
    </div>
  );
}

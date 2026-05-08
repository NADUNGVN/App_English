"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useId,
  useRef,
  useState,
} from "react";

type YouTubePlayerState = {
  BUFFERING: number;
  CUED: number;
  ENDED: number;
  PAUSED: number;
  PLAYING: number;
  UNSTARTED: number;
};

type YouTubePlayer = {
  destroy?: () => void;
  getCurrentTime?: () => number;
  getPlayerState?: () => number;
  pauseVideo?: () => void;
  playVideo?: () => void;
  seekTo?: (seconds: number, allowSeekAhead: boolean) => void;
  setPlaybackRate?: (rate: number) => void;
};

type ControllableYouTubePlayer = YouTubePlayer & {
  getCurrentTime: () => number;
  getPlayerState: () => number;
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setPlaybackRate: (rate: number) => void;
};

type YouTubeConstructor = new (
  elementId: string,
  options: {
    videoId: string;
    height: string;
    width: string;
    playerVars: Record<string, number | string>;
    events: {
      onReady: () => void;
      onStateChange?: (event: { data: number }) => void;
    };
  },
) => YouTubePlayer;

declare global {
  interface Window {
    YT?: {
      Player: YouTubeConstructor;
      PlayerState: YouTubePlayerState;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<void> | null = null;
const SEGMENT_END_GUARD_SECONDS = 0.32;

type PlayerBoundaryMode = "segment" | "continuous";

export type YouTubePlaybackState =
  | "idle"
  | "buffering"
  | "ended"
  | "paused"
  | "playing";

function canControlPlayer(
  player: YouTubePlayer | null,
): player is ControllableYouTubePlayer {
  return Boolean(
    player &&
      typeof player.getCurrentTime === "function" &&
      typeof player.getPlayerState === "function" &&
      typeof player.pauseVideo === "function" &&
      typeof player.playVideo === "function" &&
      typeof player.seekTo === "function" &&
      typeof player.setPlaybackRate === "function",
  );
}

function loadYouTubeIframeApi() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.YT?.Player) {
    return Promise.resolve();
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve();
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      youtubeApiPromise = null;
      reject(new Error("Unable to load the YouTube player"));
    };
    document.body.appendChild(script);
  });

  return youtubeApiPromise;
}

export type YouTubeSegmentPlayerHandle = {
  getCurrentTime(): number;
  isPlaying(): boolean;
  playFrom(seconds: number, rate?: number): void;
  pause(): void;
  playSegment(rate?: number): void;
  setRate(rate: number): void;
  toggleSegment(rate?: number): void;
};

type YouTubeSegmentPlayerProps = {
  boundaryMode?: PlayerBoundaryMode;
  endSeconds: number;
  errorLabel?: string;
  loadingLabel?: string;
  onCurrentTimeChange?: (seconds: number) => void;
  onPlaybackStateChange?: (state: YouTubePlaybackState) => void;
  onReadyChange?: (ready: boolean) => void;
  onStatusChange?: (status: "loading" | "ready" | "error") => void;
  startSeconds: number;
  title: string;
  videoId: string;
};

export const YouTubeSegmentPlayer = forwardRef<
  YouTubeSegmentPlayerHandle,
  YouTubeSegmentPlayerProps
>(function YouTubeSegmentPlayer(
  {
    boundaryMode = "segment",
    endSeconds,
    errorLabel,
    loadingLabel,
    onCurrentTimeChange,
    onPlaybackStateChange,
    onReadyChange,
    onStatusChange,
    startSeconds,
    title,
    videoId,
  },
  ref,
) {
  const reactId = useId();
  const elementId = `youtube-player-${reactId.replace(/:/g, "")}`;
  const playerRef = useRef<YouTubePlayer | null>(null);
  const boundaryModeRef = useRef<PlayerBoundaryMode>(boundaryMode);
  const endSecondsRef = useRef(endSeconds);
  const playbackStateRef = useRef<YouTubePlaybackState>("idle");
  const readyRef = useRef(false);
  const startSecondsRef = useRef(startSeconds);
  const lastCurrentTimeRef = useRef(-1);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  const emitPlaybackState = useCallback(
    (nextState: YouTubePlaybackState) => {
      if (playbackStateRef.current === nextState) {
        return;
      }

      playbackStateRef.current = nextState;
      onPlaybackStateChange?.(nextState);
    },
    [onPlaybackStateChange],
  );

  const updateReady = (nextReady: boolean) => {
    readyRef.current = nextReady;
    if (nextReady) {
      setError("");
    }
    setReady(nextReady);
    onReadyChange?.(nextReady);
    onStatusChange?.(nextReady ? "ready" : "loading");
    if (!nextReady) {
      emitPlaybackState("idle");
    }
  };

  const markError = (message: string) => {
    setError(message);
    readyRef.current = false;
    setReady(false);
    onReadyChange?.(false);
    onStatusChange?.("error");
    emitPlaybackState("idle");
  };

  useImperativeHandle(
    ref,
    () => ({
      getCurrentTime() {
        if (canControlPlayer(playerRef.current)) {
          return playerRef.current.getCurrentTime();
        }

        return startSecondsRef.current;
      },
      isPlaying() {
        return playbackStateRef.current === "playing";
      },
      playFrom(seconds: number, rate = 1) {
        const player = playerRef.current;

        if (!canControlPlayer(player)) {
          return;
        }

        player.setPlaybackRate?.(rate);
        player.seekTo?.(seconds, true);
        player.playVideo?.();
        emitPlaybackState("playing");
      },
      pause() {
        if (canControlPlayer(playerRef.current)) {
          playerRef.current.pauseVideo?.();
          emitPlaybackState("paused");
        }
      },
      playSegment(rate = 1) {
        const player = playerRef.current;

        if (!canControlPlayer(player)) {
          return;
        }

        player.setPlaybackRate?.(rate);
        player.seekTo?.(startSecondsRef.current, true);
        player.playVideo?.();
        emitPlaybackState("playing");
      },
      setRate(rate: number) {
        if (canControlPlayer(playerRef.current)) {
          playerRef.current.setPlaybackRate?.(rate);
        }
      },
      toggleSegment(rate = 1) {
        const player = playerRef.current;

        if (!canControlPlayer(player) || !window.YT?.PlayerState) {
          return;
        }

        if (player.getPlayerState() === window.YT.PlayerState.PLAYING) {
          player.pauseVideo?.();
          emitPlaybackState("paused");
          return;
        }

        const currentTime = player.getCurrentTime();
        const shouldSeekToStart =
          boundaryModeRef.current === "segment" ||
          currentTime < startSecondsRef.current - 0.35 ||
          currentTime >= endSecondsRef.current - SEGMENT_END_GUARD_SECONDS;

        player.setPlaybackRate?.(rate);
        if (shouldSeekToStart) {
          player.seekTo?.(startSecondsRef.current, true);
        }
        player.playVideo?.();
        emitPlaybackState("playing");
      },
    }),
    [emitPlaybackState],
  );

  useEffect(() => {
    boundaryModeRef.current = boundaryMode;
    endSecondsRef.current = endSeconds;
    startSecondsRef.current = startSeconds;
    if (boundaryMode === "segment" && canControlPlayer(playerRef.current)) {
      playerRef.current.pauseVideo?.();
      playerRef.current.seekTo?.(startSeconds, true);
      emitPlaybackState("paused");
    }
  }, [boundaryMode, emitPlaybackState, endSeconds, startSeconds]);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | undefined;

    setError("");
    updateReady(false);

    timeoutId = window.setTimeout(() => {
      if (!cancelled && !readyRef.current) {
        markError("The YouTube player did not become ready in time.");
      }
    }, 12000);

    loadYouTubeIframeApi()
      .then(() => {
        if (cancelled || !window.YT?.Player) {
          return;
        }

        playerRef.current = new window.YT.Player(elementId, {
          videoId,
          height: "100%",
          width: "100%",
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            start: Math.floor(startSecondsRef.current),
          },
          events: {
            onReady: () => {
              const player = playerRef.current;

              if (cancelled) {
                return;
              }

              if (!canControlPlayer(player)) {
                markError("The YouTube player is not controllable in this browser.");
                return;
              }

              if (timeoutId) {
                window.clearTimeout(timeoutId);
              }

              player.seekTo?.(startSecondsRef.current, true);
              updateReady(true);
              emitPlaybackState("paused");
            },
            onStateChange: (event) => {
              const playerState = window.YT?.PlayerState;

              if (!playerState) {
                return;
              }

              if (event.data === playerState.PLAYING) {
                emitPlaybackState("playing");
                return;
              }

              if (event.data === playerState.BUFFERING) {
                emitPlaybackState("buffering");
                return;
              }

              if (event.data === playerState.ENDED) {
                emitPlaybackState("ended");
                return;
              }

              if (
                event.data === playerState.PAUSED ||
                event.data === playerState.CUED ||
                event.data === playerState.UNSTARTED
              ) {
                emitPlaybackState("paused");
              }
            },
          },
        });
      })
      .catch((caughtError) => {
        if (!cancelled) {
          markError(
            caughtError instanceof Error
              ? caughtError.message
              : "Unable to load the YouTube player.",
          );
        }
      });

    return () => {
      cancelled = true;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      if (typeof playerRef.current?.destroy === "function") {
        playerRef.current.destroy();
      }
      playerRef.current = null;
      onReadyChange?.(false);
      emitPlaybackState("idle");
    };
  }, [elementId, emitPlaybackState, videoId]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const player = playerRef.current;

      if (!ready || !canControlPlayer(player) || !window.YT?.PlayerState) {
        return;
      }

      const stopAt = Math.max(
        startSecondsRef.current + 0.45,
        endSecondsRef.current - SEGMENT_END_GUARD_SECONDS,
      );
      const currentTime = player.getCurrentTime?.() ?? startSecondsRef.current;

      if (
        onCurrentTimeChange &&
        Math.abs(currentTime - lastCurrentTimeRef.current) >= 0.045
      ) {
        lastCurrentTimeRef.current = currentTime;
        onCurrentTimeChange(currentTime);
      }

      const shouldStopAtBoundary =
        boundaryModeRef.current === "segment" ||
        currentTime >= endSecondsRef.current - SEGMENT_END_GUARD_SECONDS;

      if (
        shouldStopAtBoundary &&
        player.getPlayerState?.() === window.YT.PlayerState.PLAYING &&
        currentTime >= stopAt
      ) {
        player.pauseVideo?.();
        emitPlaybackState("paused");
      }
    }, 90);

    return () => {
      window.clearInterval(interval);
    };
  }, [emitPlaybackState, onCurrentTimeChange, ready]);

  return (
    <div className="overflow-hidden rounded-[1.4rem] border border-sand-200 bg-slate-950">
      <div className="relative aspect-video w-full">
        <div id={elementId} className="absolute inset-0 h-full w-full" title={title} />
        {!ready && !error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-sm font-medium text-white/70">
            {loadingLabel ?? "Loading video player"}
          </div>
        ) : null}
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950 px-6 text-center text-sm font-medium leading-relaxed text-white/78">
            {errorLabel ?? error}
          </div>
        ) : null}
      </div>
    </div>
  );
});

"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useId,
  useRef,
  useState,
} from "react";

type YouTubePlayerState = {
  PLAYING: number;
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
  pause(): void;
  playSegment(rate?: number): void;
  setRate(rate: number): void;
};

type YouTubeSegmentPlayerProps = {
  endSeconds: number;
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
  { endSeconds, onReadyChange, onStatusChange, startSeconds, title, videoId },
  ref,
) {
  const reactId = useId();
  const elementId = `youtube-player-${reactId.replace(/:/g, "")}`;
  const playerRef = useRef<YouTubePlayer | null>(null);
  const endSecondsRef = useRef(endSeconds);
  const readyRef = useRef(false);
  const startSecondsRef = useRef(startSeconds);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  const updateReady = (nextReady: boolean) => {
    readyRef.current = nextReady;
    if (nextReady) {
      setError("");
    }
    setReady(nextReady);
    onReadyChange?.(nextReady);
    onStatusChange?.(nextReady ? "ready" : "loading");
  };

  const markError = (message: string) => {
    setError(message);
    readyRef.current = false;
    setReady(false);
    onReadyChange?.(false);
    onStatusChange?.("error");
  };

  useImperativeHandle(
    ref,
    () => ({
      pause() {
        if (canControlPlayer(playerRef.current)) {
          playerRef.current.pauseVideo?.();
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
      },
      setRate(rate: number) {
        if (canControlPlayer(playerRef.current)) {
          playerRef.current.setPlaybackRate?.(rate);
        }
      },
    }),
    [],
  );

  useEffect(() => {
    endSecondsRef.current = endSeconds;
    startSecondsRef.current = startSeconds;
    if (canControlPlayer(playerRef.current)) {
      playerRef.current.pauseVideo?.();
      playerRef.current.seekTo?.(startSeconds, true);
    }
  }, [endSeconds, startSeconds]);

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
            controls: 1,
            enablejsapi: 1,
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
    };
  }, [elementId, videoId]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const player = playerRef.current;

      if (!ready || !canControlPlayer(player) || !window.YT?.PlayerState) {
        return;
      }

      if (
        player.getPlayerState?.() === window.YT.PlayerState.PLAYING &&
        (player.getCurrentTime?.() ?? 0) >= endSecondsRef.current
      ) {
        player.pauseVideo?.();
      }
    }, 250);

    return () => {
      window.clearInterval(interval);
    };
  }, [ready]);

  return (
    <div className="overflow-hidden rounded-[1.4rem] border border-sand-200 bg-slate-950">
      <div className="relative aspect-video w-full">
        <div id={elementId} className="absolute inset-0 h-full w-full" title={title} />
        {!ready && !error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-sm font-medium text-white/70">
            Loading video player
          </div>
        ) : null}
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950 px-6 text-center text-sm font-medium leading-relaxed text-white/78">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
});

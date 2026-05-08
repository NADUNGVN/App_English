"use client";

import {
  BookOpen,
  SpeakerHigh,
  Star,
  X,
} from "@phosphor-icons/react";
import { useEffect, useRef } from "react";

export type WordInsightPopoverData = {
  example?: string;
  meaning?: string;
  normalized: string;
  partOfSpeech?: string;
  phonetic?: string;
  sourceLabel?: string;
  synonyms?: string[];
  term: string;
};

type WordInsightPopoverProps = {
  insight: WordInsightPopoverData;
  onClose: () => void;
  onSaveWord?: () => void;
  x: number;
  y: number;
};

function speakWord(term: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(term);
  utterance.lang = "en-US";
  utterance.rate = 0.86;
  window.speechSynthesis.speak(utterance);
}

export function WordInsightPopover({
  insight,
  onClose,
  onSaveWord,
  x,
  y,
}: WordInsightPopoverProps) {
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        popoverRef.current &&
        event.target instanceof Node &&
        !popoverRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={popoverRef}
      className="fixed z-30 w-[min(22rem,calc(100vw-2rem))] rounded-[1rem] border border-slate-800 bg-slate-950 p-4 text-white shadow-[0_28px_70px_-34px_rgba(15,23,42,0.82)]"
      style={{
        left: x,
        top: y,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-[1.25rem] font-bold tracking-[-0.03em]">
              {insight.term}
            </h3>
            <button
              aria-label="Play pronunciation"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-300 transition duration-300 hover:bg-slate-800 hover:text-white active:scale-[0.98]"
              onClick={() => speakWord(insight.term)}
              type="button"
            >
              <SpeakerHigh size={17} weight="duotone" />
            </button>
          </div>
          {insight.phonetic || insight.partOfSpeech ? (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.78rem] font-medium text-slate-400">
              {insight.phonetic ? <span>{insight.phonetic}</span> : null}
              {insight.partOfSpeech ? (
                <span className="rounded-[0.45rem] bg-slate-800 px-2 py-1 text-slate-300">
                  {insight.partOfSpeech}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            aria-label="Save word"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-300 transition duration-300 hover:bg-slate-800 hover:text-white active:scale-[0.98]"
            onClick={onSaveWord}
            type="button"
          >
            <Star size={18} weight="duotone" />
          </button>
          <button
            aria-label="Close word insight"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-300 transition duration-300 hover:bg-slate-800 hover:text-white active:scale-[0.98]"
            onClick={onClose}
            type="button"
          >
            <X size={17} weight="bold" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <p className="text-[1rem] font-semibold leading-relaxed text-white">
          {insight.meaning ?? "No dictionary meaning is available for this word yet."}
        </p>

        {insight.example ? (
          <div className="border-t border-slate-800 pt-3">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Context
            </p>
            <p className="mt-1.5 text-[0.9rem] leading-relaxed text-slate-300">
              {insight.example}
            </p>
          </div>
        ) : null}

        {insight.synonyms && insight.synonyms.length > 0 ? (
          <div className="flex flex-wrap gap-2 border-t border-slate-800 pt-3">
            {insight.synonyms.map((synonym) => (
              <span
                key={synonym}
                className="rounded-full bg-slate-900 px-2.5 py-1 text-[0.78rem] font-semibold text-slate-300"
              >
                {synonym}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {insight.sourceLabel ? (
        <div className="mt-4 flex items-center gap-2 border-t border-slate-800 pt-3 text-[0.76rem] font-semibold text-slate-500">
          <BookOpen size={15} weight="duotone" />
          {insight.sourceLabel}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { WarningCircle } from "@phosphor-icons/react";
import type { ReactNode } from "react";

type LoadingPanelProps = {
  className?: string;
  lines?: number;
};

type EmptyStateProps = {
  description: ReactNode;
  title: ReactNode;
};

type ErrorStateProps = EmptyStateProps & {
  actionLabel?: string;
  onAction?: (() => void) | null;
};

export function LoadingPanel({ className = "", lines = 4 }: LoadingPanelProps) {
  return (
    <div className={`surface-panel p-4 sm:p-5 ${className}`}>
      <div className="animate-pulse space-y-3.5">
        <div className="h-4 w-36 rounded-full bg-sand-100" />
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={`line-${index}`}
            className="h-3.5 rounded-full bg-sand-100"
            style={{ width: `${100 - index * 8}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="surface-panel flex min-h-40 flex-col items-center justify-center gap-2.5 p-5 text-center sm:p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700">
        <WarningCircle size={20} weight="duotone" />
      </div>
      <h3 className="text-[1rem] font-semibold tracking-[-0.03em] text-ink-950">{title}</h3>
      <p className="max-w-md text-[0.8125rem] leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}

export function ErrorState({
  actionLabel,
  description,
  onAction,
  title,
}: ErrorStateProps) {
  return (
    <div className="surface-panel flex min-h-44 flex-col items-center justify-center gap-3 p-5 text-center sm:p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-700">
        <WarningCircle size={20} weight="duotone" />
      </div>
      <h3 className="text-[1rem] font-semibold tracking-[-0.03em] text-ink-950">{title}</h3>
      <p className="max-w-md text-[0.8125rem] leading-relaxed text-slate-500">{description}</p>
      {onAction ? (
        <button className="button-secondary mt-1" onClick={onAction} type="button">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

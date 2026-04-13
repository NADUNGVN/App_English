import { WarningCircle } from "@phosphor-icons/react";

export function LoadingPanel({ className = "", lines = 4 }) {
  return (
    <div className={`surface-panel p-5 sm:p-6 ${className}`}>
      <div className="animate-pulse space-y-4">
        <div className="h-5 w-40 rounded-full bg-sand-100" />
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={`line-${index}`}
            className="h-4 rounded-full bg-sand-100"
            style={{ width: `${100 - index * 8}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="surface-panel flex min-h-44 flex-col items-center justify-center gap-2.5 p-6 text-center sm:p-7">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-700">
        <WarningCircle size={22} weight="duotone" />
      </div>
      <h3 className="text-lg font-semibold tracking-[-0.03em] text-ink-950">{title}</h3>
      <p className="max-w-md text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}

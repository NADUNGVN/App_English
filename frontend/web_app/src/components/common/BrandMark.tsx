// @ts-nocheck
"use client";

import Link from "next/link";

function BrandMarkContent({ compact, dense, iconOnly, light }) {
  const headingTone = light ? "text-white" : "text-ink-950";
  const subTone = light ? "text-white/60" : "text-slate-400";
  const iconShellClass = iconOnly
    ? dense
      ? "h-8 w-8 rounded-[0.78rem]"
      : "h-9 w-9 rounded-[0.9rem]"
    : compact
      ? dense
        ? "h-8 w-8 rounded-[0.82rem]"
        : "h-10 w-10 rounded-[1rem]"
      : "h-11 w-11 rounded-[1.2rem]";
  const iconImageClass = iconOnly
    ? dense
      ? "h-6 w-6 rounded-[0.6rem]"
      : "h-7 w-7 rounded-[0.7rem]"
    : compact
      ? dense
        ? "h-6 w-6 rounded-[0.68rem]"
        : "h-8 w-8 rounded-[0.8rem]"
      : "h-9 w-9 rounded-[0.95rem]";

  return (
    <>
      <span
        className={`relative flex shrink-0 items-center justify-center overflow-hidden border border-white/70 bg-white/80 shadow-[0_18px_42px_-28px_rgba(217,119,6,0.5)] ${iconShellClass}`}
      >
        <img
          alt="QuackUp icon"
          className={`${iconImageClass} object-cover`}
          src="/quackup-icon.jpg"
        />
      </span>

      {!iconOnly ? (
        <span className="min-w-0 flex flex-col leading-[1.02]">
          <span
            className={`font-semibold tracking-[-0.04em] ${headingTone} ${
              compact ? (dense ? "text-[1rem]" : "text-[1.2rem]") : "text-[1.7rem]"
            }`}
          >
            <span>Quack</span>
            <span className="text-brand-500">Up</span>
          </span>

          {!compact ? (
            <span className={`mt-1 text-[11px] font-medium uppercase tracking-[0.16em] ${subTone}`}>
              App English
            </span>
          ) : null}
        </span>
      ) : null}
    </>
  );
}

export function BrandMark({
  ariaLabel = "QuackUp",
  className = "",
  compact = false,
  dense = false,
  iconOnly = false,
  interactive = true,
  light = false,
  onActivate,
  title,
  to = "/",
}) {
  const sharedClassName = `inline-flex items-center ${compact ? (dense ? "gap-2" : "gap-2.5") : "gap-3"} ${className}`;

  if (onActivate) {
    return (
      <button
        aria-label={ariaLabel}
        className={sharedClassName}
        onClick={onActivate}
        title={title}
        type="button"
      >
        <BrandMarkContent compact={compact} dense={dense} iconOnly={iconOnly} light={light} />
      </button>
    );
  }

  if (!interactive) {
    return (
      <div className={sharedClassName} title={title}>
        <BrandMarkContent compact={compact} dense={dense} iconOnly={iconOnly} light={light} />
      </div>
    );
  }

  return (
    <Link aria-label={ariaLabel} className={sharedClassName} href={to} title={title}>
      <BrandMarkContent compact={compact} dense={dense} iconOnly={iconOnly} light={light} />
    </Link>
  );
}

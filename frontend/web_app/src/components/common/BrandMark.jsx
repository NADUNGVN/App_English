import { Link } from "react-router-dom";

function BrandMarkContent({ compact, iconOnly }) {
  return (
    <>
      <span
        className={`relative flex shrink-0 items-center justify-center overflow-hidden border border-white/70 bg-white/80 shadow-[0_18px_42px_-28px_rgba(217,119,6,0.5)] ${
          iconOnly
            ? "h-9 w-9 rounded-[0.9rem]"
            : compact
              ? "h-10 w-10 rounded-[1rem]"
              : "h-11 w-11 rounded-[1.2rem]"
        }`}
      >
        <img
          alt="QuackUp icon"
          className={`${
            iconOnly
              ? "h-7 w-7 rounded-[0.7rem]"
              : compact
                ? "h-8 w-8 rounded-[0.8rem]"
                : "h-9 w-9 rounded-[0.95rem]"
          } object-cover`}
          src="/quackup-icon.jpg"
        />
      </span>

      {!iconOnly ? (
        <span className="min-w-0 flex flex-col leading-[1.02]">
          <span
            className={`font-semibold tracking-[-0.04em] text-ink-950 ${
              compact ? "text-[1.2rem]" : "text-[1.7rem]"
            }`}
          >
            <span>Quack</span>
            <span className="text-brand-500">Up</span>
          </span>
          {!compact ? (
            <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
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
  iconOnly = false,
  onActivate,
  title,
  to = "/",
}) {
  const sharedClassName = `inline-flex items-center ${compact ? "gap-2.5" : "gap-3"} ${className}`;

  if (onActivate) {
    return (
      <button
        aria-label={ariaLabel}
        className={sharedClassName}
        onClick={onActivate}
        title={title}
        type="button"
      >
        <BrandMarkContent compact={compact} iconOnly={iconOnly} />
      </button>
    );
  }

  return (
    <Link aria-label={ariaLabel} className={sharedClassName} title={title} to={to}>
      <BrandMarkContent compact={compact} iconOnly={iconOnly} />
    </Link>
  );
}

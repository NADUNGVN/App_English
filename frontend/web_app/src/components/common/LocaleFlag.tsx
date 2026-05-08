// @ts-nocheck
"use client";

export const localeOptions = [
  { value: "vi", label: "Tiếng Việt", toggleLabel: "VI", flag: "vn" },
  { value: "en", label: "English", toggleLabel: "EN", flag: "us" },
];

export function LocaleFlag({ flag, className = "h-5 w-7 rounded-[0.45rem]" }) {
  if (flag === "vn") {
    return (
      <span
        className={`inline-flex shrink-0 overflow-hidden leading-none ring-1 ring-slate-950/8 ${className}`}
      >
        <svg
          aria-hidden="true"
          className="block h-full w-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 30 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect height="20" width="30" fill="#DA251D" />
          <path
            d="M15 4.3L16.94 9.07H22.08L17.91 11.99L19.52 16.91L15 13.86L10.48 16.91L12.09 11.99L7.92 9.07H13.06L15 4.3Z"
            fill="#FFDF00"
          />
        </svg>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 overflow-hidden leading-none ring-1 ring-slate-950/8 ${className}`}
    >
      <svg
        aria-hidden="true"
        className="block h-full w-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 30 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect height="20" width="30" fill="#FFFFFF" />
        <rect height="2" width="30" y="0" fill="#B91C1C" />
        <rect height="2" width="30" y="4" fill="#B91C1C" />
        <rect height="2" width="30" y="8" fill="#B91C1C" />
        <rect height="2" width="30" y="12" fill="#B91C1C" />
        <rect height="2" width="30" y="16" fill="#B91C1C" />
        <rect height="10" width="13" fill="#1D4ED8" />
        <circle cx="3" cy="2.5" fill="#FFFFFF" r="0.8" />
        <circle cx="6.25" cy="2.5" fill="#FFFFFF" r="0.8" />
        <circle cx="9.5" cy="2.5" fill="#FFFFFF" r="0.8" />
        <circle cx="4.625" cy="5" fill="#FFFFFF" r="0.8" />
        <circle cx="7.875" cy="5" fill="#FFFFFF" r="0.8" />
        <circle cx="11.125" cy="5" fill="#FFFFFF" r="0.8" />
        <circle cx="3" cy="7.5" fill="#FFFFFF" r="0.8" />
        <circle cx="6.25" cy="7.5" fill="#FFFFFF" r="0.8" />
        <circle cx="9.5" cy="7.5" fill="#FFFFFF" r="0.8" />
      </svg>
    </span>
  );
}

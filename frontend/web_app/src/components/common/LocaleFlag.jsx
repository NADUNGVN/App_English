export const localeOptions = [
  { value: "vi", label: "Tiếng Việt", toggleLabel: "VI", flag: "vn" },
  { value: "en", label: "English", toggleLabel: "EN", flag: "us" },
];

export function LocaleFlag({ flag, className = "h-5 w-7 rounded-[0.45rem]" }) {
  if (flag === "vn") {
    return (
      <span
        className={`inline-flex shrink-0 overflow-hidden ring-1 ring-slate-950/8 ${className}`}
      >
        <svg
          aria-hidden="true"
          className="h-full w-full"
          fill="none"
          viewBox="0 0 28 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect height="20" rx="4" width="28" fill="#DA251D" />
          <path
            d="M14 4.3L15.94 9.07H21.08L16.91 11.99L18.52 16.91L14 13.86L9.48 16.91L11.09 11.99L6.92 9.07H12.06L14 4.3Z"
            fill="#FFDF00"
          />
        </svg>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 overflow-hidden ring-1 ring-slate-950/8 ${className}`}
    >
      <svg
        aria-hidden="true"
        className="h-full w-full"
        fill="none"
        viewBox="0 0 28 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect height="20" rx="4" width="28" fill="#FFFFFF" />
        <rect height="2" width="28" y="0" fill="#B91C1C" />
        <rect height="2" width="28" y="4" fill="#B91C1C" />
        <rect height="2" width="28" y="8" fill="#B91C1C" />
        <rect height="2" width="28" y="12" fill="#B91C1C" />
        <rect height="2" width="28" y="16" fill="#B91C1C" />
        <rect height="10" rx="2" width="12" fill="#1D4ED8" />
        <circle cx="3" cy="2.5" fill="#FFFFFF" r="0.8" />
        <circle cx="6" cy="2.5" fill="#FFFFFF" r="0.8" />
        <circle cx="9" cy="2.5" fill="#FFFFFF" r="0.8" />
        <circle cx="4.5" cy="5" fill="#FFFFFF" r="0.8" />
        <circle cx="7.5" cy="5" fill="#FFFFFF" r="0.8" />
        <circle cx="3" cy="7.5" fill="#FFFFFF" r="0.8" />
        <circle cx="6" cy="7.5" fill="#FFFFFF" r="0.8" />
        <circle cx="9" cy="7.5" fill="#FFFFFF" r="0.8" />
      </svg>
    </span>
  );
}

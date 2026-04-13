import { CaretDown } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

const localeOptions = [
  { value: "en", label: "English", shortLabel: "US", accentClass: "bg-[#1d4ed8] text-white" },
  { value: "vi", label: "Tiếng Việt", shortLabel: "VN", accentClass: "bg-[#da251d] text-[#ffdf6e]" },
];

function LocaleBadge({ option }) {
  return (
    <span
      className={`inline-flex h-[1.15rem] min-w-[1.65rem] items-center justify-center rounded-[0.35rem] px-1.5 text-[0.625rem] font-semibold leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] ${option.accentClass}`}
    >
      {option.shortLabel}
    </span>
  );
}

export function TopbarLocalePicker({ locale, onChange }) {
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);

  const currentOption =
    localeOptions.find((item) => item.value === locale) ?? localeOptions[1];

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSelect = (nextLocale) => {
    setOpen(false);
    onChange(nextLocale);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex h-9 max-w-[10.5rem] items-center gap-2 rounded-full border border-sand-200 bg-white px-3 text-[0.875rem] font-medium text-ink-950 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] hover:border-brand-200"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <LocaleBadge option={currentOption} />
        <span className="truncate">{currentOption.label}</span>
        <CaretDown
          className={`shrink-0 text-slate-500 transition duration-300 ${open ? "rotate-180" : ""}`}
          size={14}
          weight="bold"
        />
      </button>

      <div
        className={`absolute right-0 top-full z-30 mt-2 min-w-[210px] rounded-[1.15rem] border border-sand-200 bg-white p-2 text-ink-950 shadow-[0_24px_48px_-24px_rgba(120,53,15,0.26)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
        role="menu"
      >
        {localeOptions.map((item) => {
          const active = item.value === locale;

          return (
            <button
              key={item.value}
              aria-checked={active}
              className={`flex w-full items-center gap-3 rounded-[0.95rem] px-3 py-2.5 text-left transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                active
                  ? "bg-brand-50 text-ink-950"
                  : "text-slate-600 hover:bg-sand-50 hover:text-ink-950"
              }`}
              onClick={() => handleSelect(item.value)}
              role="menuitemradio"
              type="button"
            >
              <LocaleBadge option={item} />
              <span className="text-[0.875rem] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

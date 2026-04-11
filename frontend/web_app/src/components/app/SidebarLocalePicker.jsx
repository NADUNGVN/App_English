import { CaretDown, Translate } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

const localeOptions = [
  { value: "en", code: "US", label: "English" },
  { value: "vi", code: "VN", label: "Tiếng Việt" },
];

export function SidebarLocalePicker({ collapsed = false, locale, onChange }) {
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);

  const currentOption =
    localeOptions.find((item) => item.value === locale) ?? localeOptions[1];

  useEffect(() => {
    setOpen(false);
  }, [collapsed, locale]);

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
    <div
      ref={containerRef}
      className={`relative ${collapsed ? "flex justify-center" : "w-full"}`}
    >
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className={`group transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          collapsed
            ? "inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-sand-200 bg-white text-slate-600 hover:-translate-y-[1px] hover:border-brand-200 hover:text-ink-950"
            : "flex w-full items-center justify-between rounded-[1.35rem] border border-sand-200 bg-white/88 px-3.5 py-3 text-slate-600 hover:-translate-y-[1px] hover:border-brand-200 hover:bg-white"
        }`}
        onClick={() => setOpen((current) => !current)}
        title={collapsed ? (locale === "vi" ? "Đổi ngôn ngữ" : "Change language") : undefined}
        type="button"
      >
        <span className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
          <span
            className={`flex items-center justify-center rounded-[0.95rem] ${
              collapsed
                ? "h-9 w-9 bg-slate-100 text-slate-700"
                : "h-9 w-9 bg-slate-100 text-slate-700"
            }`}
          >
            <Translate size={18} weight="duotone" />
          </span>
          {!collapsed ? (
            <span className="text-sm font-medium text-ink-950">{currentOption.label}</span>
          ) : null}
        </span>
        {!collapsed ? (
          <CaretDown
            className={`text-slate-500 transition duration-300 ${open ? "rotate-180" : ""}`}
            size={16}
            weight="bold"
          />
        ) : null}
      </button>

      <div
        className={`absolute z-30 min-w-[220px] rounded-[1.25rem] border border-slate-800 bg-slate-950/96 p-2 text-white shadow-[0_24px_48px_-24px_rgba(15,23,42,0.65)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          collapsed
            ? "left-full top-1/2 ml-3 -translate-y-1/2"
            : "bottom-full left-0 mb-3"
        } ${
          open
            ? collapsed
              ? "pointer-events-auto opacity-100 translate-x-0 -translate-y-1/2"
              : "pointer-events-auto opacity-100 translate-y-0"
            : collapsed
              ? "pointer-events-none opacity-0 translate-x-2 -translate-y-1/2"
              : "pointer-events-none opacity-0 translate-y-2"
        }`}
        role="menu"
      >
        {localeOptions.map((item) => {
          const active = item.value === locale;

          return (
            <button
              key={item.value}
              className={`grid w-full grid-cols-[42px,minmax(0,1fr)] items-center gap-3 rounded-[1rem] px-3 py-3 text-left transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                active
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
              aria-checked={active}
              onClick={() => handleSelect(item.value)}
              role="menuitemradio"
              type="button"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                {item.code}
              </span>
              <span className="text-lg font-medium tracking-[-0.03em]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

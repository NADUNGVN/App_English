// @ts-nocheck
"use client";

import { CaretDown } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { LocaleFlag, localeOptions } from "./LocaleFlag";

export function LocalePicker({ dense = false, locale, onChange, quiet = false }) {
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);

  const currentOption =
    localeOptions.find((item) => item.value === locale) ?? localeOptions[0];

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
        aria-label={currentOption.label}
        className={`inline-flex items-center justify-between rounded-full border font-semibold leading-[1.2] text-ink-950 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] hover:border-brand-200 ${
          dense
            ? "h-8 min-w-[5rem] gap-1.5 px-2.5 text-[0.8125rem]"
            : "h-9 min-w-[5.8rem] gap-2 px-3 text-[0.875rem]"
        } ${
          quiet ? "border-white/80 bg-white/80" : "border-sand-200 bg-white"
        }`}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          <LocaleFlag
            className={dense ? "h-4 w-6 rounded-[0.38rem]" : undefined}
            flag={currentOption.flag}
          />
          <span aria-hidden="true" className="type-control-label text-ink-950">
            {currentOption.toggleLabel}
          </span>
          <span className="sr-only">{currentOption.label}</span>
        </span>
        <CaretDown
          className={`shrink-0 text-slate-500 transition duration-300 ${open ? "rotate-180" : ""}`}
          size={dense ? 12 : 14}
          weight="bold"
        />
      </button>

      <div
        className={`absolute right-0 top-full z-30 mt-2 min-w-[9rem] rounded-[1.05rem] border border-sand-200 bg-white p-1.5 text-ink-950 shadow-[0_24px_48px_-24px_rgba(120,53,15,0.26)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
              aria-label={item.label}
              className={`flex w-full items-center gap-2.5 rounded-[0.85rem] px-2.5 py-2 text-left transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                active
                  ? "bg-brand-50 text-ink-950"
                  : "text-slate-600 hover:bg-sand-50 hover:text-ink-950"
              }`}
              onClick={() => handleSelect(item.value)}
              role="menuitemradio"
              type="button"
            >
              <LocaleFlag
                className={dense ? "h-4 w-6 rounded-[0.38rem]" : undefined}
                flag={item.flag}
              />
              <span aria-hidden="true" className="type-control-label">
                {item.toggleLabel}
              </span>
              <span className="sr-only">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

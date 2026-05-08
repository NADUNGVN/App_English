// @ts-nocheck
"use client";

import { Bell, List } from "@phosphor-icons/react";
import { TopbarLocalePicker } from "./TopbarLocalePicker";

export function AppTopbar({ locale, onLocaleChange, onMenuOpen }) {
  const notificationsLabel = locale === "vi" ? "Thông báo" : "Notifications";

  return (
    <header className="sticky top-0 z-20 border-b border-[rgb(226,214,197)]/90 bg-[rgba(248,245,239,0.9)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 px-3 py-1.5 sm:px-4 lg:min-h-[var(--app-shell-header-h)] lg:px-5 lg:py-1.5 xl:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-[0.85rem] border border-sand-200 bg-white lg:hidden"
            onClick={onMenuOpen}
            type="button"
          >
            <List size={18} weight="bold" />
          </button>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <TopbarLocalePicker locale={locale} onChange={onLocaleChange} />

          <button
            aria-label={notificationsLabel}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[0.85rem] border border-sand-200 bg-white text-slate-600 transition duration-300 hover:-translate-y-[1px] hover:border-brand-200 hover:text-ink-950"
            title={notificationsLabel}
            type="button"
          >
            <Bell size={16} weight="duotone" />
          </button>
        </div>
      </div>
    </header>
  );
}

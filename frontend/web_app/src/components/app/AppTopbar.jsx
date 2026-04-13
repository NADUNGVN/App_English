import { Bell, List } from "@phosphor-icons/react";
import { TopbarLocalePicker } from "./TopbarLocalePicker.jsx";

export function AppTopbar({ locale, onLocaleChange, onMenuOpen }) {
  const notificationsLabel = locale === "vi" ? "Thông báo" : "Notifications";

  return (
    <header className="sticky top-0 z-20 border-b border-[rgb(226,214,197)]/90 bg-[rgba(248,245,239,0.9)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-2 sm:px-5 lg:min-h-[var(--app-shell-header-h)] lg:px-6 lg:py-2 xl:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-[1rem] border border-sand-200 bg-white lg:hidden"
            onClick={onMenuOpen}
            type="button"
          >
            <List size={20} weight="bold" />
          </button>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          <TopbarLocalePicker locale={locale} onChange={onLocaleChange} />

          <button
            aria-label={notificationsLabel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[1rem] border border-sand-200 bg-white text-slate-600 transition duration-300 hover:-translate-y-[1px] hover:border-brand-200 hover:text-ink-950"
            title={notificationsLabel}
            type="button"
          >
            <Bell size={18} weight="duotone" />
          </button>
        </div>
      </div>
    </header>
  );
}

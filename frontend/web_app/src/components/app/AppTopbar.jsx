import { List, Medal } from "@phosphor-icons/react";

export function AppTopbar({ currentLabel, onMenuOpen, user }) {
  return (
    <header className="sticky top-0 z-20 border-b border-[rgb(226,214,197)]/90 bg-[rgba(248,245,239,0.9)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:min-h-[var(--app-shell-header-h)] lg:px-8 lg:py-4 xl:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sand-200 bg-white lg:hidden"
            onClick={onMenuOpen}
            type="button"
          >
            <List size={22} weight="bold" />
          </button>

          <div className="min-w-0">
            <h1 className="page-heading text-[1.75rem] sm:text-[2rem]">{currentLabel}</h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-sand-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 sm:inline-flex">
            <Medal size={16} weight="duotone" />
            {user?.role}
          </span>
        </div>
      </div>
    </header>
  );
}

import { List, X } from "@phosphor-icons/react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { BrandMark } from "../components/common/BrandMark.jsx";
import { LanguageToggle } from "../components/common/LanguageToggle.jsx";
import { marketingNavItems } from "../data/marketingContent.js";
import { useAppContext } from "../hooks/useAppContext.js";

const visibleNavItems = marketingNavItems.filter((item) => !item.hiddenInNav);
const headerNavItems = visibleNavItems.filter((item) => item.to !== "/");

function MarketingNavLinks({ locale, onNavigate }) {
  return (
    <>
      {headerNavItems.map((item) => (
        <NavLink
          key={item.to}
          className={({ isActive }) =>
            `inline-flex h-12 items-center rounded-full px-5 text-[1.03rem] font-semibold tracking-[-0.02em] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isActive
                ? "bg-brand-100 text-brand-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]"
                : "text-slate-500 hover:bg-white/80 hover:text-ink-950"
            }`
          }
          end
          onClick={onNavigate}
          to={item.to}
        >
          {item.label[locale]}
        </NavLink>
      ))}
    </>
  );
}

export function MarketingLayout() {
  const { isAuthenticated, locale, setLocale } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerCtaLabel = "Go to Quackup English";

  const copy = {
    vi: {
      ctaLink: "Bắt đầu miễn phí",
      contact: "Liên hệ",
      explore: "Khám phá",
      footerCopy:
        "QuackUp là hệ sản phẩm học tiếng Anh theo nhịp ngắn: nghe, nói, đọc, viết và từ vựng đi cùng ngữ cảnh thật.",
      slogan: "Học ngắn, đều, rõ tiến bộ.",
    },
    en: {
      ctaLink: "Start free",
      contact: "Contact",
      explore: "Explore",
      footerCopy:
        "QuackUp is a short-rhythm English learning product across listening, speaking, reading, writing, and vocabulary tied to real context.",
      slogan: "Short practice, visible progress.",
    },
  }[locale];

  return (
    <div className="min-h-[100dvh]">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-[rgba(248,245,239,0.9)] backdrop-blur-xl">
        <div className="page-shell flex items-center justify-between gap-6 py-4">
          <BrandMark className="shrink-0" compact />

          <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            <MarketingNavLinks locale={locale} />
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <LanguageToggle locale={locale} onChange={setLocale} quiet />
            <Link className="button-primary whitespace-nowrap px-6" to="/register">
              {headerCtaLabel}
            </Link>
          </div>

          <button
            aria-label="Toggle navigation"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sand-200 bg-white/80 text-slate-700 lg:hidden"
            onClick={() => setMenuOpen((current) => !current)}
            type="button"
          >
            {menuOpen ? <X size={20} weight="bold" /> : <List size={22} weight="bold" />}
          </button>
        </div>

        {menuOpen ? (
          <div className="page-shell pb-5 lg:hidden">
            <div className="surface-panel flex flex-col gap-4 p-5">
              <div className="flex flex-wrap gap-2">
                <MarketingNavLinks locale={locale} onNavigate={() => setMenuOpen(false)} />
              </div>

              <div className="flex items-center justify-between gap-4">
                <LanguageToggle locale={locale} onChange={setLocale} />
                <Link
                  className="button-primary"
                  onClick={() => setMenuOpen(false)}
                  to="/register"
                >
                  {headerCtaLabel}
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <Outlet />

      <footer className="border-t border-white/70 bg-white/60">
        <div className="page-shell grid gap-10 py-14 md:grid-cols-[1.1fr,0.8fr,0.8fr]">
          <div className="space-y-4">
            <BrandMark />
            <p className="max-w-lg text-sm leading-relaxed text-slate-500">{copy.footerCopy}</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              {copy.explore}
            </p>
            <div className="space-y-3 text-sm text-slate-500">
              {visibleNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  className="block transition hover:text-ink-950"
                  end={item.to === "/"}
                  to={item.to}
                >
                  {item.label[locale]}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              {copy.contact}
            </p>
            <div className="space-y-3 text-sm text-slate-500">
              <a className="block transition hover:text-ink-950" href="mailto:support@quackup.app">
                support@quackup.app
              </a>
              <p>{copy.slogan}</p>
              <Link
                className="block transition hover:text-ink-950"
                to={isAuthenticated ? "/dashboard" : "/register"}
              >
                {isAuthenticated ? "Dashboard" : copy.ctaLink}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

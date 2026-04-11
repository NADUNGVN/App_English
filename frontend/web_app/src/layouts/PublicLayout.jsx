import { List, SignIn, SquaresFour } from "@phosphor-icons/react";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { BrandMark } from "../components/common/BrandMark.jsx";
import { LanguageToggle } from "../components/common/LanguageToggle.jsx";
import { useAppContext } from "../hooks/useAppContext.js";

export function PublicLayout() {
  const { isAuthenticated, locale, setLocale } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const copy = {
    vi: {
      practice: "Cách học",
      library: "Thư viện",
      results: "Kết quả",
      login: "Đăng nhập",
      dashboard: "Vào ứng dụng",
      signup: "Bắt đầu miễn phí ngay",
    },
    en: {
      practice: "Practice",
      library: "Library",
      results: "Results",
      login: "Login",
      dashboard: "Open app",
      signup: "Start free now",
    },
  }[locale];

  return (
    <div className="min-h-[100dvh]">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-[rgba(248,245,239,0.86)] backdrop-blur-xl">
        <div className="page-shell flex items-center justify-between gap-4 py-4">
          <BrandMark compact />

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 lg:flex">
            <a href="/#practice" className="transition hover:text-ink-950">
              {copy.practice}
            </a>
            <a href="/#library" className="transition hover:text-ink-950">
              {copy.library}
            </a>
            <a href="/#results" className="transition hover:text-ink-950">
              {copy.results}
            </a>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageToggle locale={locale} onChange={setLocale} quiet />
            <Link className={isAuthenticated ? "button-secondary" : "button-primary"} to={isAuthenticated ? "/dashboard" : "/login"}>
              {isAuthenticated ? (
                <>
                  <SquaresFour size={18} weight="duotone" />
                  {copy.dashboard}
                </>
              ) : (
                <>
                  <SignIn size={18} weight="duotone" />
                  {copy.login}
                </>
              )}
            </Link>
            {!isAuthenticated ? (
              <Link className="button-primary" to="/register">
                {copy.signup}
              </Link>
            ) : null}
          </div>

          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sand-200 bg-white/80 text-slate-700 lg:hidden"
            onClick={() => setMenuOpen((current) => !current)}
            type="button"
          >
            <List size={22} weight="bold" />
          </button>
        </div>

        {menuOpen ? (
          <div className="page-shell pb-5 lg:hidden">
            <div className="surface-panel flex flex-col gap-4 p-5">
              <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-600">
                <a href="/#practice">{copy.practice}</a>
                <a href="/#library">{copy.library}</a>
                <a href="/#results">{copy.results}</a>
              </div>
              <div className="flex items-center justify-between gap-4">
                <LanguageToggle locale={locale} onChange={setLocale} />
                <div className="flex gap-3">
                  <Link className={isAuthenticated ? "button-secondary" : "button-primary"} to={isAuthenticated ? "/dashboard" : "/login"}>
                    {isAuthenticated ? copy.dashboard : copy.login}
                  </Link>
                  {!isAuthenticated ? (
                    <Link className="button-primary" to="/register">
                      {copy.signup}
                    </Link>
                  ) : null}
                </div>
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
            <p className="max-w-lg text-sm leading-relaxed text-slate-500">
              {locale === "vi"
                ? "QuackUp giúp bạn nghe kỹ hơn, nói chắc hơn, và giữ nhịp học hàng ngày bằng các buổi luyện ngắn."
                : "QuackUp helps you listen more precisely, speak more steadily, and keep a daily learning rhythm through short practice blocks."}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              {locale === "vi" ? "Ứng dụng" : "Product"}
            </p>
            <div className="space-y-3 text-sm text-slate-500">
              <a href="/#practice" className="block transition hover:text-ink-950">
                {locale === "vi" ? "Dictation và Shadowing" : "Dictation and shadowing"}
              </a>
              <a href="/#library" className="block transition hover:text-ink-950">
                {locale === "vi" ? "Thư viện bài học" : "Lesson library"}
              </a>
              <Link className="block transition hover:text-ink-950" to="/login">
                {locale === "vi" ? "Tài khoản người học" : "Learner account"}
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              {locale === "vi" ? "Liên hệ" : "Contact"}
            </p>
            <div className="space-y-3 text-sm text-slate-500">
              <a className="block transition hover:text-ink-950" href="mailto:support@quackup.app">
                support@quackup.app
              </a>
              <p>{locale === "vi" ? "Nhịp học ngắn, tiến bộ rõ." : "Short practice, visible progress."}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import {
  BookOpenText,
  ChartBar,
  ChatsCircle,
  HouseLine,
  Ranking,
  SpeakerHigh,
  Subtitles,
  Translate,
  X,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppSidebar } from "../components/app/AppSidebar.jsx";
import { AppTopbar } from "../components/app/AppTopbar.jsx";
import { useAppContext } from "../hooks/useAppContext.js";
import {
  loadSidebarCollapsed,
  saveSidebarCollapsed,
} from "../lib/storage.js";

const navigationItems = [
  { to: "/dashboard", label: { vi: "Trang chủ", en: "Overview" }, icon: HouseLine },
  { to: "/learning", label: { vi: "Thư viện", en: "Library" }, icon: BookOpenText },
  { to: "/dictation", label: { vi: "Dictation", en: "Dictation" }, icon: Subtitles },
  { to: "/vocabulary", label: { vi: "Từ vựng", en: "Vocabulary" }, icon: Translate },
  { to: "/dictionary", label: { vi: "Từ điển", en: "Dictionary" }, icon: SpeakerHigh },
  { to: "/leaderboard", label: { vi: "Xếp hạng", en: "Leaderboard" }, icon: Ranking },
  { to: "/statistics", label: { vi: "Thống kê", en: "Statistics" }, icon: ChartBar },
  { to: "/shadowing", label: { vi: "Shadowing", en: "Shadowing" }, icon: ChatsCircle },
];

export function AppShell() {
  const { locale, logout, setLocale, user } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const viewportRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() =>
    loadSidebarCollapsed(false),
  );

  const currentLabel = useMemo(() => {
    const currentItem = navigationItems.find((item) =>
      location.pathname.startsWith(item.to),
    );
    return currentItem ? currentItem.label[locale] : location.pathname;
  }, [locale, location.pathname]);

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  useEffect(() => {
    saveSidebarCollapsed(isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed((current) => !current);
  };

  const handleHomeNavigate = () => {
    navigate("/dashboard");
  };

  return (
    <div
      className="min-h-[100dvh] bg-transparent lg:h-[100dvh] lg:overflow-hidden"
      style={{
        "--app-sidebar-width": isSidebarCollapsed ? "4.75rem" : "18.25rem",
      }}
    >
      <div className="grid min-h-[100dvh] transition-[grid-template-columns] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:h-[100dvh] lg:grid-cols-[var(--app-sidebar-width)_minmax(0,1fr)]">
        <AppSidebar
          className="hidden lg:flex"
          collapsed={isSidebarCollapsed}
          locale={locale}
          navigationItems={navigationItems}
          onHomeNavigate={handleHomeNavigate}
          onLocaleChange={setLocale}
          onLogout={handleLogout}
          onToggleCollapse={handleSidebarToggle}
          user={user}
        />

        <div className="min-h-0 min-w-0">
          <div ref={viewportRef} className="workspace-viewport">
            <AppTopbar
              currentLabel={currentLabel}
              onMenuOpen={() => setMenuOpen(true)}
              user={user}
            />

            <main className="px-4 pb-6 pt-4 sm:px-5 lg:px-8 lg:pb-8 lg:pt-6 xl:px-10">
              <Outlet />
            </main>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/30 px-4 py-4 backdrop-blur-sm lg:hidden">
          <div className="mx-auto flex h-full max-w-sm flex-col">
            <div className="mb-3 flex justify-end">
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sand-200 bg-white"
                onClick={() => setMenuOpen(false)}
                type="button"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <AppSidebar
              className="h-full"
              locale={locale}
              navigationItems={navigationItems}
              onHomeNavigate={handleHomeNavigate}
              onLocaleChange={setLocale}
              onLogout={handleLogout}
              onNavigate={() => setMenuOpen(false)}
              user={user}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

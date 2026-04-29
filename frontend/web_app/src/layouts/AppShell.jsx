import { X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { appNavigationItems } from "../app/appNavigation.js";
import { AppSidebar } from "../components/app/AppSidebar.jsx";
import { AppTopbar } from "../components/app/AppTopbar.jsx";
import { useAppContext } from "../hooks/useAppContext.js";
import { loadSidebarCollapsed, saveSidebarCollapsed } from "../lib/storage.js";

export function AppShell() {
  const { locale, logout, setLocale, user } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const viewportRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() =>
    loadSidebarCollapsed(false),
  );

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  useEffect(() => {
    saveSidebarCollapsed(isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  const handleLogout = async () => {
    await logout();
    navigate("/register", { replace: true });
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed((current) => !current);
  };

  const handleHomeNavigate = () => {
    navigate("/dashboard");
  };

  return (
    <div
      className="app-shell min-h-[100dvh] bg-transparent lg:h-[100dvh] lg:overflow-hidden"
      style={{
        "--app-sidebar-width": isSidebarCollapsed ? "4.75rem" : "18.25rem",
      }}
    >
      <div className="grid min-h-[100dvh] transition-[grid-template-columns] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:h-[100dvh] lg:grid-cols-[var(--app-sidebar-width)_minmax(0,1fr)]">
        <AppSidebar
          className="hidden lg:flex"
          collapsed={isSidebarCollapsed}
          locale={locale}
          navigationItems={appNavigationItems}
          onHomeNavigate={handleHomeNavigate}
          onLogout={handleLogout}
          onToggleCollapse={handleSidebarToggle}
          user={user}
        />

        <div className="min-h-0 min-w-0">
          <div ref={viewportRef} className="workspace-viewport">
            <AppTopbar
              locale={locale}
              onLocaleChange={setLocale}
              onMenuOpen={() => setMenuOpen(true)}
            />

            <main className="px-4 pb-5 pt-3 sm:px-5 lg:px-6 lg:pb-6 lg:pt-4 xl:px-8">
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
              navigationItems={appNavigationItems}
              onHomeNavigate={handleHomeNavigate}
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

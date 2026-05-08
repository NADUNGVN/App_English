"use client";

import { X } from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { appNavigationItems } from "../navigation/appNavigation";
import { AppSidebar } from "../components/app/AppSidebar";
import { AppTopbar } from "../components/app/AppTopbar";
import { useAppContext } from "../hooks/useAppContext";
import { loadSidebarCollapsed, saveSidebarCollapsed } from "../lib/storage";

type Locale = "vi" | "en";

type ShellUser = {
  avatarUrl?: string | null;
  displayName?: string | null;
  email?: string | null;
};

type AppShellContext = {
  locale: Locale;
  logout: () => Promise<void>;
  setLocale: (locale: Locale) => void | Promise<void>;
  user: ShellUser | null;
};

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const appContext = useAppContext() as AppShellContext;
  const locale: Locale = appContext.locale === "en" ? "en" : "vi";
  const { logout, setLocale, user } = appContext;
  const router = useRouter();
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() =>
    loadSidebarCollapsed(false),
  );

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    saveSidebarCollapsed(isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  const handleLogout = async () => {
    await logout();
    router.replace("/register");
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed((current) => !current);
  };

  const handleHomeNavigate = () => {
    router.push("/dashboard");
  };
  const isDictationWorkspace = pathname === "/dictation" || pathname.startsWith("/dictation/");
  const isDictationDetailWorkspace =
    pathname.startsWith("/dictation/") && !pathname.startsWith("/dictation/categories/");
  const shellUser =
    user ??
    (pathname === "/dictation" || pathname.startsWith("/dictation/")
      ? {
          avatarUrl: null,
          displayName: locale === "vi" ? "Người học demo" : "Demo learner",
          email: "demo@quackup.local",
        }
      : null);
  const shellStyle = {
    "--app-sidebar-width": isSidebarCollapsed ? "4rem" : "15.25rem",
  } as CSSProperties;

  return (
    <div
      className="app-shell min-h-[100dvh] bg-transparent lg:h-[100dvh] lg:overflow-hidden"
      style={shellStyle}
    >
      <div className="grid min-h-[100dvh] transition-[grid-template-columns] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:h-[100dvh] lg:grid-cols-[var(--app-sidebar-width)_minmax(0,1fr)]">
        <AppSidebar
          className="hidden lg:flex"
          collapsed={isSidebarCollapsed}
          locale={locale}
          navigationItems={appNavigationItems}
          onHomeNavigate={handleHomeNavigate}
          onLogout={handleLogout}
          onNavigate={undefined}
          onToggleCollapse={handleSidebarToggle}
          user={shellUser}
        />

        <div className="min-h-0 min-w-0">
          <div className="workspace-viewport">
            {isDictationDetailWorkspace ? null : (
              <AppTopbar
                locale={locale}
                onLocaleChange={setLocale}
                onMenuOpen={() => setMenuOpen(true)}
              />
            )}

            <main
              ref={mainRef}
              className={`min-h-0 flex-1 overflow-y-auto px-3 pb-4 sm:px-4 lg:px-5 lg:pb-5 xl:px-6 ${
                isDictationWorkspace ? "pt-0 lg:pt-0" : "pt-3 lg:pt-4"
              }`}
            >
              {children}
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
              onToggleCollapse={undefined}
              user={shellUser}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

// @ts-nocheck
"use client";

import {
  CaretRight,
  GearSix,
  Lifebuoy,
  SidebarSimple,
  SignOut,
  Sparkle,
  UserCircle,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { appSidebarSections } from "../../navigation/appNavigation";
import { BrandMark } from "../common/BrandMark";

const sectionOrder = {
  main: 0,
  community: 1,
  you: 2,
};

function getInitials(name) {
  const safeName = name?.trim();

  if (!safeName) {
    return "Q";
  }

  return safeName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function UserAvatar({
  avatarUrl,
  initials,
  sizeClass = "h-10 w-10",
  textClass = "text-sm",
}) {
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [avatarUrl]);

  const showImage = Boolean(avatarUrl) && !hasImageError;

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white bg-ink-950 text-white shadow-[0_14px_28px_-20px_rgba(15,23,42,0.72)] ring-1 ring-sand-200 ${sizeClass}`}
    >
      {showImage ? (
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={(event) => {
            setHasImageError(true);
          }}
          src={avatarUrl}
        />
      ) : (
        <span className={`relative z-[1] font-semibold ${textClass}`}>{initials}</span>
      )}
    </div>
  );
}

function AccountMenuItem({ href, icon: Icon, label, onClick, tone = "default" }) {
  const className = `group flex w-full items-center gap-3 rounded-[1rem] px-3 py-2.5 text-left text-[0.9375rem] font-medium transition duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 ${
    tone === "danger"
      ? "text-brand-700 hover:bg-brand-50 hover:text-brand-800"
      : "text-ink-950 hover:bg-sand-100/80 hover:text-brand-700"
  }`;
  const iconClassName =
    tone === "danger"
      ? "text-brand-700 transition group-hover:text-brand-800"
      : "text-slate-600 transition group-hover:text-brand-700";
  const content = (
    <>
      <Icon className={iconClassName} size={20} weight="regular" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link className={className} href={href} onClick={onClick} role="menuitem">
        {content}
      </Link>
    );
  }

  return (
    <button className={className} onClick={onClick} role="menuitem" type="button">
      {content}
    </button>
  );
}

export function AppSidebar({
  className = "",
  collapsed = false,
  locale,
  navigationItems,
  onHomeNavigate,
  onLogout,
  onNavigate,
  onToggleCollapse,
  user,
}) {
  const pathname = usePathname();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const profileLabel = locale === "vi" ? "Hồ sơ" : "Profile";
  const accountMenuLabels =
    locale === "vi"
      ? {
          open: "Mở menu tài khoản",
          upgrade: "Upgrade plan",
          profile: "Hồ sơ",
          settings: "Cài đặt",
          help: "Trợ giúp",
          logout: "Đăng xuất",
        }
      : {
          open: "Open account menu",
          upgrade: "Upgrade plan",
          profile: "Profile",
          settings: "Settings",
          help: "Help",
          logout: "Logout",
        };
  const sidebarToggleLabel = collapsed
    ? locale === "vi"
      ? "Mở thanh bên"
      : "Open sidebar"
    : locale === "vi"
      ? "Đóng sidebar"
      : "Collapse sidebar";
  const displayName = user?.displayName ?? user?.email ?? "QuackUp";
  const initials = getInitials(displayName);
  const avatarUrl = user?.avatarUrl;

  useEffect(() => {
    if (!accountMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (accountMenuRef.current?.contains(event.target)) {
        return;
      }

      setAccountMenuOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [accountMenuOpen]);

  useEffect(() => {
    setAccountMenuOpen(false);
  }, [collapsed, pathname]);

  const closeAccountMenu = () => {
    setAccountMenuOpen(false);
    onNavigate?.();
  };

  const handleAccountLogout = () => {
    setAccountMenuOpen(false);
    onLogout?.();
  };

  const groupedItems = useMemo(
    () =>
      appSidebarSections
        .map((section) => ({
          ...section,
          items: navigationItems.filter(
            (item) => item.visibleInSidebar && item.section === section.key,
          ),
        }))
        .filter((section) => section.items.length > 0)
        .sort((left, right) => {
          const placementRank =
            (left.placement === "footer" ? 1 : 0) -
            (right.placement === "footer" ? 1 : 0);

          if (placementRank !== 0) {
            return placementRank;
          }

          return (sectionOrder[left.key] ?? 99) - (sectionOrder[right.key] ?? 99);
        }),
    [navigationItems],
  );

  const navSections = useMemo(
    () => groupedItems.filter((section) => section.placement !== "footer"),
    [groupedItems],
  );

  const footerSections = useMemo(
    () => groupedItems.filter((section) => section.placement === "footer"),
    [groupedItems],
  );

  const handleBrandActivate = () => {
    if (collapsed && onToggleCollapse) {
      onToggleCollapse();
      return;
    }

    onHomeNavigate?.();
    onNavigate?.();
  };

  const renderItems = (section) => (
    <div className={`flex flex-col ${collapsed ? "items-center gap-1.5" : "gap-1"}`}>
      {section.items.map((item) => {
        const Icon = item.icon;
        const label = item.label[locale];

        return (
          <Link
            key={item.to}
            aria-label={label}
            className={`group flex items-center rounded-[1.2rem] font-medium transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                collapsed
                  ? `h-10 w-10 justify-center px-0 ${
                      pathname === item.to || pathname.startsWith(`${item.to}/`)
                        ? "bg-brand-500 text-white shadow-[0_16px_34px_-24px_rgba(217,119,6,0.55)]"
                        : "text-slate-500 hover:bg-brand-50 hover:text-ink-950"
                    }`
                  : `gap-3 px-3.5 py-2.5 text-[0.9375rem] ${
                      pathname === item.to || pathname.startsWith(`${item.to}/`)
                        ? "bg-brand-500 text-white shadow-[0_16px_34px_-24px_rgba(217,119,6,0.55)]"
                        : "text-slate-500 hover:bg-brand-50 hover:text-ink-950"
                    }`
              }`}
            href={item.to}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} weight="duotone" />
            <span
              className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                collapsed
                  ? "max-w-0 -translate-x-1 opacity-0"
                  : "max-w-[14rem] translate-x-0 opacity-100"
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );

  const renderSection = (section, { index, footer = false }) => {
    const itemsContent = renderItems(section);

    const sectionSpacing = footer
      ? index > 0
        ? "border-t border-sand-200/90 pt-4"
        : ""
      : index > 0
        ? "mt-5 border-t border-sand-200/90 pt-4"
        : "";

    return (
      <div key={section.key} className={sectionSpacing}>
        {!collapsed && section.label ? (
          <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {section.label[locale]}
          </p>
        ) : null}

        <div className={!collapsed && section.label ? "mt-2.5" : ""}>{itemsContent}</div>
      </div>
    );
  };

  const accountMenu = (
    <div
      className={`absolute z-30 w-[17rem] overflow-hidden rounded-[1.35rem] border border-sand-200 bg-white p-2 shadow-[0_24px_70px_-36px_rgba(71,46,14,0.42)] ring-1 ring-white/80 ${
        collapsed ? "bottom-0 left-[calc(100%+0.75rem)]" : "bottom-[calc(100%+0.75rem)] left-0"
      }`}
      role="menu"
    >
      <AccountMenuItem
        href="/english/pricing"
        icon={Sparkle}
        label={accountMenuLabels.upgrade}
        onClick={closeAccountMenu}
      />
      <AccountMenuItem
        href="/profile"
        icon={UserCircle}
        label={accountMenuLabels.profile}
        onClick={closeAccountMenu}
      />
      <AccountMenuItem
        href="/settings"
        icon={GearSix}
        label={accountMenuLabels.settings}
        onClick={closeAccountMenu}
      />

      <div className="my-2 border-t border-sand-200" />

      <AccountMenuItem
        href="/help"
        icon={Lifebuoy}
        label={accountMenuLabels.help}
        onClick={closeAccountMenu}
      />
      <AccountMenuItem
        icon={SignOut}
        label={accountMenuLabels.logout}
        onClick={handleAccountLogout}
        tone="danger"
      />
    </div>
  );

  return (
    <aside
      className={`flex min-h-0 flex-col rounded-shell border border-white/80 bg-white/[0.82] p-4 shadow-panel backdrop-blur-xl transition-[padding,background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:h-[100dvh] lg:rounded-none lg:border-y-0 lg:border-l-0 lg:border-r lg:border-[rgb(226,214,197)] lg:bg-white/92 lg:pt-0 lg:shadow-none lg:backdrop-blur-none ${
        collapsed ? "lg:px-2.5 lg:pb-4" : "lg:px-4 lg:pb-4"
      } ${className}`}
    >
      <div
        className={`shrink-0 border-b border-sand-200 pb-3 lg:min-h-[var(--app-shell-header-h)] lg:pb-0 ${
          collapsed
            ? "flex items-center justify-center"
            : "flex items-center justify-between gap-3"
        }`}
      >
        <BrandMark
          ariaLabel={collapsed ? sidebarToggleLabel : "QuackUp"}
          className={collapsed ? "justify-center" : "min-w-0 flex-1"}
          compact
          iconOnly={collapsed}
          onActivate={handleBrandActivate}
          title={collapsed ? sidebarToggleLabel : undefined}
          to="/dashboard"
        />

        {!collapsed && onToggleCollapse ? (
          <button
            aria-label={sidebarToggleLabel}
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-[0.95rem] border border-slate-200 bg-slate-100/88 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] hover:border-brand-200 hover:bg-white hover:text-ink-950 lg:inline-flex"
            onClick={onToggleCollapse}
            title={sidebarToggleLabel}
            type="button"
          >
            <SidebarSimple size={20} weight="duotone" />
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <nav className="scrollbar-hidden -mr-1 flex min-h-0 flex-1 flex-col overflow-y-auto pr-1">
          {navSections.map((section, index) => renderSection(section, { index }))}
        </nav>
      </div>

      <div className="mt-4 shrink-0 border-t border-sand-200 pt-4">
        {footerSections.length > 0 ? (
          <div className="space-y-4">
            {footerSections.map((section, index) =>
              renderSection(section, { index, footer: true }),
            )}
          </div>
        ) : null}

        <div
          className={`${footerSections.length > 0 ? "mt-4 border-t border-sand-200 pt-4" : ""}`}
          ref={accountMenuRef}
        >
          <div className="relative">
            {accountMenuOpen ? accountMenu : null}

            {collapsed ? (
              <button
                aria-expanded={accountMenuOpen}
                aria-haspopup="menu"
                aria-label={accountMenuLabels.open}
                className="mx-auto flex h-11 w-11 items-center justify-center rounded-full transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
                onClick={() => setAccountMenuOpen((current) => !current)}
                title={accountMenuLabels.open}
                type="button"
              >
                <UserAvatar
                  avatarUrl={avatarUrl}
                  initials={initials}
                  sizeClass="h-10 w-10"
                  textClass="text-sm"
                />
              </button>
            ) : (
              <button
                aria-expanded={accountMenuOpen}
                aria-haspopup="menu"
                aria-label={accountMenuLabels.open}
                className={`group flex w-full items-center gap-3 rounded-[1.35rem] border px-3 py-2.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 ${
                  accountMenuOpen
                    ? "border-brand-200 bg-white"
                    : "border-brand-100 bg-brand-50/70 hover:border-brand-200 hover:bg-white"
                }`}
                onClick={() => setAccountMenuOpen((current) => !current)}
                type="button"
              >
                <UserAvatar
                  avatarUrl={avatarUrl}
                  initials={initials}
                  sizeClass="h-10 w-10"
                  textClass="text-sm"
                />

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.95rem] font-semibold text-ink-950">
                    {displayName}
                  </span>
                  <span className="block truncate text-[0.8125rem] text-slate-500">
                    {profileLabel}
                  </span>
                </span>

                <CaretRight
                  className={`shrink-0 text-brand-700 transition duration-300 ${
                    accountMenuOpen ? "rotate-90" : ""
                  }`}
                  size={19}
                  weight="bold"
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

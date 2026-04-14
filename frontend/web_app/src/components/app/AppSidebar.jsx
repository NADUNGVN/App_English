import { SidebarSimple, SignOut } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { appSidebarSections } from "../../app/appNavigation.js";
import { BrandMark } from "../common/BrandMark.jsx";

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
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-100 bg-brand-100/80 text-brand-700 ${sizeClass}`}
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
  const logoutLabel = locale === "vi" ? "Đăng xuất" : "Logout";
  const profileLabel = locale === "vi" ? "Hồ sơ" : "Profile";
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
          <NavLink
            key={item.to}
            aria-label={label}
            className={({ isActive }) =>
              `group flex items-center rounded-[1.2rem] font-medium transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                collapsed
                  ? `h-10 w-10 justify-center px-0 ${
                      isActive
                        ? "bg-brand-500 text-white shadow-[0_16px_34px_-24px_rgba(217,119,6,0.55)]"
                        : "text-slate-500 hover:bg-brand-50 hover:text-ink-950"
                    }`
                  : `gap-3 px-3.5 py-2.5 text-[0.9375rem] ${
                      isActive
                        ? "bg-brand-500 text-white shadow-[0_16px_34px_-24px_rgba(217,119,6,0.55)]"
                        : "text-slate-500 hover:bg-brand-50 hover:text-ink-950"
                    }`
              }`
            }
            end
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            to={item.to}
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
          </NavLink>
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

        {collapsed ? (
          <div className={`${footerSections.length > 0 ? "mt-4 border-t border-sand-200 pt-4" : ""}`}>
            <div className="flex flex-col items-center gap-2.5">
              <UserAvatar
                avatarUrl={avatarUrl}
                initials={initials}
                sizeClass="h-10 w-10"
                textClass="text-sm"
              />
              <button
                aria-label={logoutLabel}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-700 transition duration-300 hover:-translate-y-[1px]"
                onClick={onLogout}
                title={logoutLabel}
                type="button"
              >
                <SignOut size={16} weight="bold" />
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`${footerSections.length > 0 ? "mt-4 border-t border-sand-200 pt-4" : ""}`}
          >
            <div className="flex items-center gap-3 rounded-[1.35rem] border border-brand-100 bg-brand-50/70 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <UserAvatar
                avatarUrl={avatarUrl}
                initials={initials}
                sizeClass="h-10 w-10"
                textClass="text-sm"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.95rem] font-semibold text-ink-950">
                  {displayName}
                </p>
                <p className="truncate text-[0.8125rem] text-slate-500">{profileLabel}</p>
              </div>

              <button
                aria-label={logoutLabel}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-700 transition duration-300 hover:-translate-y-[1px]"
                onClick={onLogout}
                title={logoutLabel}
                type="button"
              >
                <SignOut size={16} weight="bold" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

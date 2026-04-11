import { SidebarSimple, SignOut } from "@phosphor-icons/react";
import { NavLink } from "react-router-dom";
import { BrandMark } from "../common/BrandMark.jsx";
import { SidebarLocalePicker } from "./SidebarLocalePicker.jsx";

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

export function AppSidebar({
  className = "",
  collapsed = false,
  locale,
  navigationItems,
  onHomeNavigate,
  onLocaleChange,
  onLogout,
  onNavigate,
  onToggleCollapse,
  user,
}) {
  const logoutLabel = locale === "vi" ? "Đăng xuất" : "Logout";
  const sidebarToggleLabel = collapsed
    ? locale === "vi"
      ? "Mở thanh bên"
      : "Open sidebar"
    : locale === "vi"
      ? "Đóng sidebar"
      : "Collapse sidebar";
  const initials = getInitials(user?.displayName);

  const handleBrandActivate = () => {
    if (collapsed && onToggleCollapse) {
      onToggleCollapse();
      return;
    }

    onHomeNavigate?.();
    onNavigate?.();
  };

  return (
    <aside
      className={`flex flex-col rounded-shell border border-white/80 bg-white/[0.82] p-5 shadow-panel backdrop-blur-xl transition-[padding,background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:h-[100dvh] lg:rounded-none lg:border-y-0 lg:border-l-0 lg:border-r lg:border-[rgb(226,214,197)] lg:bg-white/92 lg:pt-0 lg:shadow-none lg:backdrop-blur-none ${
        collapsed ? "lg:px-3 lg:pb-5" : "lg:px-6 lg:pb-6"
      } ${className}`}
    >
      <div
        className={`border-b border-sand-200 lg:min-h-[var(--app-shell-header-h)] ${
          collapsed ? "flex items-center justify-center" : "flex items-center justify-between gap-4"
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
            className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-[1.15rem] border border-slate-200 bg-slate-100/85 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] hover:border-brand-200 hover:bg-white hover:text-ink-950 lg:inline-flex"
            onClick={onToggleCollapse}
            title={sidebarToggleLabel}
            type="button"
          >
            <SidebarSimple size={24} weight="duotone" />
          </button>
        ) : null}
      </div>

      <nav
        className={`mt-6 flex flex-1 flex-col ${
          collapsed ? "items-center gap-2" : "gap-1.5"
        }`}
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const label = item.label[locale];

          return (
            <NavLink
              key={item.to}
              aria-label={label}
              className={({ isActive }) =>
                `group flex items-center rounded-[1.35rem] text-sm font-medium transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  collapsed
                    ? `h-12 w-12 justify-center px-0 ${
                        isActive
                          ? "bg-brand-500 text-white shadow-[0_18px_38px_-24px_rgba(217,119,6,0.55)]"
                          : "text-slate-500 hover:bg-brand-50 hover:text-ink-950"
                      }`
                    : `gap-3 px-4 py-3 ${
                        isActive
                          ? "bg-brand-500 text-white shadow-[0_18px_38px_-24px_rgba(217,119,6,0.55)]"
                          : "text-slate-500 hover:bg-brand-50 hover:text-ink-950"
                      }`
                }`
              }
              onClick={onNavigate}
              title={collapsed ? label : undefined}
              to={item.to}
            >
              <Icon size={18} weight="duotone" />
              <span
                className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform,margin] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  collapsed
                    ? "ml-0 max-w-0 -translate-x-1 opacity-0"
                    : "ml-0 max-w-[12rem] translate-x-0 opacity-100"
                }`}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div className={`mt-6 ${collapsed ? "space-y-3" : "space-y-3"}`}>
        <SidebarLocalePicker
          collapsed={collapsed}
          locale={locale}
          onChange={onLocaleChange}
        />

        {collapsed ? (
          <div className="border-t border-sand-200 pt-4">
            <div className="flex flex-col items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700"
                title={user?.displayName ?? "QuackUp"}
              >
                {initials}
              </div>
              <button
                aria-label={logoutLabel}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-700 transition hover:-translate-y-[1px]"
                onClick={onLogout}
                title={logoutLabel}
                type="button"
              >
                <SignOut size={18} weight="bold" />
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-brand-100 bg-brand-50/80 p-4 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
              {locale === "vi" ? "Tài khoản" : "Account"}
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-950">{user?.displayName}</p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                aria-label={logoutLabel}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-700 transition hover:-translate-y-[1px]"
                onClick={onLogout}
                title={logoutLabel}
                type="button"
              >
                <SignOut size={18} weight="bold" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

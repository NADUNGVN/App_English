// @ts-nocheck
const LOCALE_KEY = "quackup.locale";
const SIDEBAR_COLLAPSED_KEY = "quackup.sidebarCollapsed";

export function loadLocale(fallback = "vi") {
  if (typeof window === "undefined") {
    return fallback;
  }

  return window.localStorage.getItem(LOCALE_KEY) ?? fallback;
}

export function saveLocale(locale) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCALE_KEY, locale);
}

export function loadSidebarCollapsed(fallback = false) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return raw === null ? fallback : raw === "true";
  } catch {
    return fallback;
  }
}

export function saveSidebarCollapsed(collapsed) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
}

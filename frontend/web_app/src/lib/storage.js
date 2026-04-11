const SESSION_KEY = "quackup.session";
const LOCALE_KEY = "quackup.locale";
const SIDEBAR_COLLAPSED_KEY = "quackup.sidebarCollapsed";

export function loadSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function loadLocale(fallback = "vi") {
  return window.localStorage.getItem(LOCALE_KEY) ?? fallback;
}

export function saveLocale(locale) {
  window.localStorage.setItem(LOCALE_KEY, locale);
}

export function loadSidebarCollapsed(fallback = false) {
  try {
    const raw = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return raw === null ? fallback : raw === "true";
  } catch {
    return fallback;
  }
}

export function saveSidebarCollapsed(collapsed) {
  window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
}

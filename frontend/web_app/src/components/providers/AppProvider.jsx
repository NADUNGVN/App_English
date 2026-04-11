import { createContext, useEffect, useMemo, useState } from "react";
import {
  clearSession,
  loadLocale,
  loadSession,
  saveLocale,
  saveSession,
} from "../../lib/storage";
import { authRepository } from "../../repositories/authRepository";

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const initialSession = loadSession();
  const [session, setSession] = useState(initialSession);
  const [locale, setLocaleState] = useState(() =>
    loadLocale(initialSession?.user?.preferredLanguage ?? "vi"),
  );
  const [isBooting, setIsBooting] = useState(() => Boolean(initialSession?.accessToken));

  useEffect(() => {
    if (!initialSession?.accessToken) {
      setIsBooting(false);
      return undefined;
    }

    let cancelled = false;

    authRepository
      .getMe(initialSession.accessToken)
      .then((payload) => {
        if (cancelled) {
          return;
        }

        const nextSession = {
          accessToken: initialSession.accessToken,
          user: payload.user,
        };
        setSession(nextSession);
        saveSession(nextSession);
        setLocaleState(payload.user.preferredLanguage);
        saveLocale(payload.user.preferredLanguage);
      })
      .catch(() => {
        if (!cancelled) {
          setSession(null);
          clearSession();
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsBooting(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const persistSession = (nextSession) => {
    setSession(nextSession);
    saveSession(nextSession);
  };

  const login = async (payload) => {
    const result = await authRepository.login(payload);
    persistSession(result);
    setLocaleState(result.user.preferredLanguage);
    saveLocale(result.user.preferredLanguage);
    return result;
  };

  const register = async (payload) => {
    const result = await authRepository.register(payload);
    persistSession(result);
    setLocaleState(result.user.preferredLanguage);
    saveLocale(result.user.preferredLanguage);
    return result;
  };

  const updateProfile = async (payload) => {
    if (!session?.accessToken) {
      return null;
    }

    const response = await authRepository.updateProfile(session.accessToken, payload);
    const nextSession = {
      accessToken: session.accessToken,
      user: response.user,
    };
    persistSession(nextSession);
    setLocaleState(response.user.preferredLanguage);
    saveLocale(response.user.preferredLanguage);
    return response.user;
  };

  const setLocale = async (nextLocale) => {
    setLocaleState(nextLocale);
    saveLocale(nextLocale);

    if (session?.accessToken && session.user.preferredLanguage !== nextLocale) {
      try {
        await updateProfile({ preferredLanguage: nextLocale });
      } catch {
        // Keep optimistic locale updates even when the backend is unavailable.
      }
    }
  };

  const logout = () => {
    setSession(null);
    clearSession();
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(session?.accessToken),
      isBooting,
      locale,
      login,
      logout,
      register,
      session,
      setLocale,
      updateProfile,
      user: session?.user ?? null,
    }),
    [isBooting, locale, session],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

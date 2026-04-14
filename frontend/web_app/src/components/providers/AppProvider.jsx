import { createContext, useEffect, useMemo, useState } from "react";
import { loadLocale, saveLocale } from "../../lib/storage";
import { authRepository } from "../../repositories/authRepository";

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [locale, setLocaleState] = useState(() => loadLocale("vi"));
  const [isBooting, setIsBooting] = useState(true);
  const [bootError, setBootError] = useState(null);
  const [bootstrapKey, setBootstrapKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setIsBooting(true);
    setBootError(null);

    authRepository
      .getMe()
      .then((payload) => {
        if (cancelled) {
          return;
        }

        setSession({ user: payload.user });
        setLocaleState(payload.user.preferredLanguage);
        saveLocale(payload.user.preferredLanguage);
      })
      .catch((error) => {
        if (!cancelled) {
          setSession(null);

          if (error?.status === 401) {
            setBootError(null);
            return;
          }

          setBootError(error);
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
  }, [bootstrapKey]);

  const login = async (payload) => {
    const result = await authRepository.login(payload);
    setSession({ user: result.user });
    setBootError(null);
    setLocaleState(result.user.preferredLanguage);
    saveLocale(result.user.preferredLanguage);
    return result;
  };

  const loginWithGoogle = () => {
    authRepository.loginWithGoogle();
  };

  const register = async (payload) => {
    return authRepository.register(payload);
  };

  const updateProfile = async (payload) => {
    const response = await authRepository.updateProfile(payload);
    setSession({ user: response.user });
    setBootError(null);
    setLocaleState(response.user.preferredLanguage);
    saveLocale(response.user.preferredLanguage);
    return response.user;
  };

  const setLocale = async (nextLocale) => {
    setLocaleState(nextLocale);
    saveLocale(nextLocale);

    if (session?.user && session.user.preferredLanguage !== nextLocale) {
      try {
        await updateProfile({ preferredLanguage: nextLocale });
      } catch {
        // Keep optimistic locale updates even when the backend is unavailable.
      }
    }
  };

  const logout = async () => {
    try {
      await authRepository.logout();
    } finally {
      setBootError(null);
      setSession(null);
    }
  };

  const retrySessionBootstrap = () => {
    setBootstrapKey((current) => current + 1);
  };

  const value = useMemo(
    () => ({
      bootError,
      isAuthenticated: Boolean(session?.user),
      isBooting,
      locale,
      login,
      loginWithGoogle,
      logout,
      register,
      retrySessionBootstrap,
      session,
      setLocale,
      updateProfile,
      user: session?.user ?? null,
    }),
    [bootError, isBooting, locale, session],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

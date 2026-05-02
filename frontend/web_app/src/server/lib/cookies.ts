import type { SupportedStorage } from "@supabase/supabase-js";
import type { NextRequest, NextResponse } from "next/server";
import { env } from "../config/env";

const ACCESS_TOKEN_COOKIE = "quackup-access-token";
const REFRESH_TOKEN_COOKIE = "quackup-refresh-token";
const PKCE_TRACKING_COOKIE = "quackup-oauth-pkce-keys";

type CookieOperation =
  | { type: "set"; name: string; value: string; options: ReturnType<typeof sessionCookieOptions> }
  | { type: "clear"; name: string };

function baseCookieOptions() {
  return {
    domain: env.COOKIE_DOMAIN,
    httpOnly: true,
    path: "/",
    sameSite: env.COOKIE_SAME_SITE,
    secure: env.COOKIE_SECURE,
  } as const;
}

function sessionCookieOptions(maxAge: number) {
  return {
    ...baseCookieOptions(),
    maxAge,
  };
}

function trackingCookieOptions() {
  return sessionCookieOptions(10 * 60);
}

function clearCookie(response: NextResponse, name: string) {
  response.cookies.set(name, "", {
    ...baseCookieOptions(),
    maxAge: 0,
  });
}

export function getSessionCookies(request: NextRequest) {
  return {
    accessToken: request.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? null,
    refreshToken: request.cookies.get(REFRESH_TOKEN_COOKIE)?.value ?? null,
  };
}

export function setSessionCookies(response: NextResponse, session) {
  const accessTokenMaxAge = Math.max(session.expires_in ?? 3600, 60);

  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    session.access_token,
    sessionCookieOptions(accessTokenMaxAge),
  );
  response.cookies.set(
    REFRESH_TOKEN_COOKIE,
    session.refresh_token,
    sessionCookieOptions(30 * 24 * 60 * 60),
  );
}

export function clearSessionCookies(response: NextResponse) {
  clearCookie(response, ACCESS_TOKEN_COOKIE);
  clearCookie(response, REFRESH_TOKEN_COOKIE);
}

function encodePkceCookieName(key: string) {
  return `quackup-pkce-${Buffer.from(key).toString("base64url")}`;
}

function readTrackedPkceKeys(raw?: string) {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function createPkceCookieStorage(request: NextRequest) {
  const requestCookies = new Map(
    request.cookies.getAll().map((cookie) => [cookie.name, cookie.value]),
  );
  const trackedKeys = new Set(
    readTrackedPkceKeys(requestCookies.get(PKCE_TRACKING_COOKIE)),
  );
  const operations: CookieOperation[] = [];

  const queueSet = (name: string, value: string, options = trackingCookieOptions()) => {
    operations.push({ type: "set", name, value, options });
  };

  const queueClear = (name: string) => {
    operations.push({ type: "clear", name });
  };

  const persistTrackedKeys = () => {
    if (trackedKeys.size === 0) {
      queueClear(PKCE_TRACKING_COOKIE);
      return;
    }

    queueSet(PKCE_TRACKING_COOKIE, JSON.stringify([...trackedKeys]));
  };

  return {
    apply(response: NextResponse) {
      for (const operation of operations) {
        if (operation.type === "set") {
          response.cookies.set(operation.name, operation.value, operation.options);
        } else {
          clearCookie(response, operation.name);
        }
      }
    },
    clearAll() {
      for (const key of trackedKeys) {
        queueClear(encodePkceCookieName(key));
      }

      trackedKeys.clear();
      persistTrackedKeys();
    },
    storage: {
      getItem(key: string) {
        return requestCookies.get(encodePkceCookieName(key)) ?? null;
      },
      removeItem(key: string) {
        trackedKeys.delete(key);
        requestCookies.delete(encodePkceCookieName(key));
        queueClear(encodePkceCookieName(key));
        persistTrackedKeys();
      },
      setItem(key: string, value: string) {
        trackedKeys.add(key);
        requestCookies.set(encodePkceCookieName(key), value);
        queueSet(encodePkceCookieName(key), value);
        persistTrackedKeys();
      },
    } satisfies SupportedStorage,
  };
}

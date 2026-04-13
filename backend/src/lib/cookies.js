const env = require("../config/env");

const ACCESS_TOKEN_COOKIE = "quackup-access-token";
const REFRESH_TOKEN_COOKIE = "quackup-refresh-token";
const PKCE_TRACKING_COOKIE = "quackup-oauth-pkce-keys";

function parseCookies(request) {
  const header = request.headers.cookie;

  if (!header) {
    return {};
  }

  return header.split(";").reduce((accumulator, part) => {
    const [rawName, ...rawValue] = part.trim().split("=");

    if (!rawName) {
      return accumulator;
    }

    accumulator[rawName] = decodeURIComponent(rawValue.join("="));
    return accumulator;
  }, {});
}

function baseCookieOptions() {
  return {
    domain: env.COOKIE_DOMAIN,
    httpOnly: true,
    path: "/",
    sameSite: env.COOKIE_SAME_SITE,
    secure: env.COOKIE_SECURE,
  };
}

function sessionCookieOptions(maxAge) {
  return {
    ...baseCookieOptions(),
    maxAge,
  };
}

function trackingCookieOptions() {
  return sessionCookieOptions(10 * 60 * 1000);
}

function getSessionCookies(request) {
  const cookies = parseCookies(request);

  return {
    accessToken: cookies[ACCESS_TOKEN_COOKIE] ?? null,
    refreshToken: cookies[REFRESH_TOKEN_COOKIE] ?? null,
  };
}

function setSessionCookies(response, session) {
  const accessTokenMaxAge = Math.max((session.expires_in ?? 3600) * 1000, 60 * 1000);

  response.cookie(
    ACCESS_TOKEN_COOKIE,
    session.access_token,
    sessionCookieOptions(accessTokenMaxAge),
  );
  response.cookie(
    REFRESH_TOKEN_COOKIE,
    session.refresh_token,
    sessionCookieOptions(30 * 24 * 60 * 60 * 1000),
  );
}

function clearSessionCookies(response) {
  response.clearCookie(ACCESS_TOKEN_COOKIE, baseCookieOptions());
  response.clearCookie(REFRESH_TOKEN_COOKIE, baseCookieOptions());
}

function encodePkceCookieName(key) {
  return `quackup-pkce-${Buffer.from(key).toString("base64url")}`;
}

function readTrackedPkceKeys(cookies) {
  const raw = cookies[PKCE_TRACKING_COOKIE];

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

function createPkceCookieStorage(request, response) {
  const requestCookies = parseCookies(request);
  const trackedKeys = new Set(readTrackedPkceKeys(requestCookies));

  const persistTrackedKeys = () => {
    if (trackedKeys.size === 0) {
      response.clearCookie(PKCE_TRACKING_COOKIE, baseCookieOptions());
      return;
    }

    response.cookie(
      PKCE_TRACKING_COOKIE,
      JSON.stringify([...trackedKeys]),
      trackingCookieOptions(),
    );
  };

  return {
    clearAll() {
      for (const key of trackedKeys) {
        response.clearCookie(encodePkceCookieName(key), baseCookieOptions());
      }

      trackedKeys.clear();
      persistTrackedKeys();
    },
    storage: {
      getItem(key) {
        return requestCookies[encodePkceCookieName(key)] ?? null;
      },
      removeItem(key) {
        trackedKeys.delete(key);
        delete requestCookies[encodePkceCookieName(key)];
        response.clearCookie(encodePkceCookieName(key), baseCookieOptions());
        persistTrackedKeys();
      },
      setItem(key, value) {
        trackedKeys.add(key);
        requestCookies[encodePkceCookieName(key)] = value;
        response.cookie(encodePkceCookieName(key), value, trackingCookieOptions());
        persistTrackedKeys();
      },
    },
  };
}

module.exports = {
  clearSessionCookies,
  createPkceCookieStorage,
  getSessionCookies,
  setSessionCookies,
};

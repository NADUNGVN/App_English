const { clearSessionCookies, getSessionCookies, setSessionCookies } = require("../lib/cookies");
const { HttpError } = require("../lib/httpError");
const { createSupabaseAuthClient } = require("../lib/supabase");

function normalizeAuthError(error) {
  return `${error?.name ?? ""} ${error?.message ?? ""} ${error?.code ?? ""}`
    .trim()
    .toLowerCase();
}

function isInvalidSessionError(error) {
  const normalized = normalizeAuthError(error);

  return (
    error?.status === 400 ||
    error?.status === 401 ||
    error?.status === 403 ||
    normalized.includes("invalid") ||
    normalized.includes("expired") ||
    normalized.includes("refresh token") ||
    normalized.includes("jwt") ||
    normalized.includes("session missing") ||
    normalized.includes("session_not_found") ||
    normalized.includes("bad_jwt")
  );
}

function mapAuthFailure(error, fallbackMessage = "Invalid or expired session") {
  if (!error) {
    return new HttpError(401, fallbackMessage);
  }

  if (isInvalidSessionError(error)) {
    return new HttpError(401, "Invalid or expired session");
  }

  return new HttpError(503, "Authentication service unavailable", error.message);
}

async function requireAuth(request, response, next) {
  try {
    const { accessToken, refreshToken } = getSessionCookies(request);

    if (!accessToken || !refreshToken) {
      throw new HttpError(401, "Authentication required");
    }

    const supabase = createSupabaseAuthClient();
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionError) {
      throw mapAuthFailure(sessionError);
    }

    if (!sessionData.session) {
      throw mapAuthFailure(null);
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(
      sessionData.session.access_token,
    );

    if (userError) {
      throw mapAuthFailure(userError);
    }

    if (!userData.user) {
      throw mapAuthFailure(null);
    }

    setSessionCookies(response, sessionData.session);
    request.auth = {
      session: sessionData.session,
      user: userData.user,
      userId: userData.user.id,
    };

    next();
  } catch (error) {
    const httpError =
      error instanceof HttpError
        ? error
        : new HttpError(503, "Authentication service unavailable", error?.message);

    if (httpError.status === 401) {
      clearSessionCookies(response);
    }

    next(httpError);
  }
}

module.exports = { requireAuth };

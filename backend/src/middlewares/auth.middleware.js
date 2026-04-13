const { clearSessionCookies, getSessionCookies, setSessionCookies } = require("../lib/cookies");
const { HttpError } = require("../lib/httpError");
const { createSupabaseAuthClient } = require("../lib/supabase");

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

    if (sessionError || !sessionData.session) {
      throw new HttpError(401, "Invalid or expired session");
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(
      sessionData.session.access_token,
    );

    if (userError || !userData.user) {
      throw new HttpError(401, "Invalid or expired session");
    }

    setSessionCookies(response, sessionData.session);
    request.auth = {
      session: sessionData.session,
      user: userData.user,
      userId: userData.user.id,
    };

    next();
  } catch (error) {
    clearSessionCookies(response);
    next(error);
  }
}

module.exports = { requireAuth };

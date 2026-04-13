const env = require("../../config/env");
const {
  clearSessionCookies,
  createPkceCookieStorage,
  getSessionCookies,
  setSessionCookies,
} = require("../../lib/cookies");
const authService = require("./auth.service");
const { loginSchema, registerSchema } = require("./auth.schemas");

function buildClientRedirect(path, params = {}) {
  const url = new URL(path, env.CLIENT_URL);

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

function logAuthError(stage, error, context = {}) {
  const details =
    error && typeof error === "object"
      ? {
          message: error.message,
          details: error.details,
          name: error.name,
          stack: error.stack,
          status: error.status,
          ...context,
        }
      : { error, ...context };

  console.error(`[auth:${stage}]`, details);
}

async function register(request, response, next) {
  try {
    const payload = registerSchema.parse(request.body);
    const result = await authService.register(payload);
    response.status(202).json(result);
  } catch (error) {
    next(error);
  }
}

async function login(request, response, next) {
  try {
    const payload = loginSchema.parse(request.body);
    const result = await authService.login(payload);
    setSessionCookies(response, result.session);
    response.status(200).json({ user: result.user });
  } catch (error) {
    next(error);
  }
}

async function logout(request, response, next) {
  try {
    const tokens = getSessionCookies(request);
    await authService.logout(tokens);
    clearSessionCookies(response);
    response.status(204).send();
  } catch (error) {
    clearSessionCookies(response);
    next(error);
  }
}

async function googleStart(request, response, next) {
  try {
    const pkce = createPkceCookieStorage(request, response);
    const url = await authService.getGoogleSignInUrl(pkce.storage);
    response.redirect(url);
  } catch (error) {
    logAuthError("google-start", error);
    next(error);
  }
}

async function googleCallback(request, response) {
  const pkce = createPkceCookieStorage(request, response);

  try {
    if (!request.query.code || typeof request.query.code !== "string") {
      throw new Error("Missing authorization code");
    }

    const result = await authService.completeGoogleSignIn(
      request.query.code,
      pkce.storage,
    );

    pkce.clearAll();
    setSessionCookies(response, result.session);
    response.redirect(buildClientRedirect("/dashboard"));
  } catch (error) {
    logAuthError("google-callback", error, {
      hasCode: Boolean(request.query.code),
      queryKeys: Object.keys(request.query ?? {}),
    });
    pkce.clearAll();
    clearSessionCookies(response);
    response.redirect(buildClientRedirect("/login", { oauthError: "google" }));
  }
}

async function me(request, response, next) {
  try {
    const result = await authService.getMe(request.auth.user);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  googleCallback,
  googleStart,
  login,
  logout,
  me,
  register,
};

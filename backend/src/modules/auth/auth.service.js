const env = require("../../config/env");
const { HttpError } = require("../../lib/httpError");
const { createSupabaseAuthClient } = require("../../lib/supabase");
const { toUserResponse } = require("../users/user.presenter");
const userService = require("../users/user.service");

function mapSupabaseError(error, fallbackMessage = "Supabase request failed") {
  if (!error) {
    return null;
  }

  const message = error.message ?? fallbackMessage;
  const normalized = message.toLowerCase();

  if (normalized.includes("email not confirmed")) {
    return new HttpError(403, "Please confirm your email before signing in");
  }

  if (normalized.includes("invalid login credentials")) {
    return new HttpError(401, "Invalid email or password");
  }

  if (
    normalized.includes("already been registered") ||
    normalized.includes("already registered") ||
    normalized.includes("duplicate")
  ) {
    return new HttpError(409, "Email already registered");
  }

  if (error.status === 400 || error.status === 422) {
    return new HttpError(error.status, message);
  }

  return new HttpError(500, fallbackMessage, message);
}

async function signInWithPassword(email, password) {
  const supabase = createSupabaseAuthClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session || !data.user) {
    throw mapSupabaseError(error, "Unable to sign in");
  }

  return data;
}

async function register(input) {
  const email = input.email.toLowerCase();
  const supabase = createSupabaseAuthClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: {
        avatar_url: null,
        daily_goal_minutes: input.dailyGoalMinutes,
        display_name: input.displayName,
        preferred_language: input.preferredLanguage,
      },
      emailRedirectTo: env.SUPABASE_EMAIL_REDIRECT_URL,
    },
  });

  if (error || !data.user) {
    throw mapSupabaseError(error, "Unable to create account");
  }

  return {
    message: "Check your email to confirm your account before signing in",
    requiresEmailConfirmation: true,
  };
}

async function login(input) {
  const email = input.email.toLowerCase();
  const authSession = await signInWithPassword(email, input.password);
  const profile = await userService.syncProfile(authSession.user);

  return {
    session: authSession.session,
    user: toUserResponse(profile),
  };
}

async function getGoogleSignInUrl(storage) {
  const supabase = createSupabaseAuthClient({ flowType: "pkce", storage });
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
      redirectTo: env.SUPABASE_GOOGLE_REDIRECT_URL,
    },
  });

  if (error || !data.url) {
    throw mapSupabaseError(error, "Unable to start Google sign-in");
  }

  return data.url;
}

async function completeGoogleSignIn(code, storage) {
  const supabase = createSupabaseAuthClient({ flowType: "pkce", storage });
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session || !data.user) {
    throw mapSupabaseError(error, "Unable to complete Google sign-in");
  }

  const profile = await userService.syncProfile(data.user);

  return {
    session: data.session,
    user: toUserResponse(profile),
  };
}

async function getMe(authUser) {
  const profile = await userService.syncProfile(authUser);

  return {
    user: toUserResponse(profile),
  };
}

async function logout(tokens) {
  if (!tokens?.accessToken || !tokens?.refreshToken) {
    return;
  }

  const supabase = createSupabaseAuthClient();

  try {
    const { data, error } = await supabase.auth.setSession({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    });

    if (error || !data.session) {
      return;
    }

    await supabase.auth.signOut();
  } catch {
    // Always clear cookies client-side even when remote sign-out fails.
  }
}

module.exports = {
  completeGoogleSignIn,
  getGoogleSignInUrl,
  getMe,
  login,
  logout,
  register,
};

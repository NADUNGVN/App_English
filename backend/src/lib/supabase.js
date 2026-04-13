const { createClient } = require("@supabase/supabase-js");
const env = require("../config/env");

const sharedAuthConfig = {
  autoRefreshToken: false,
  detectSessionInUrl: false,
  persistSession: false,
};

function createSupabaseAuthClient(options = {}) {
  const { flowType, storage } = options;

  return createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      ...sharedAuthConfig,
      persistSession: Boolean(storage),
      ...(flowType ? { flowType } : {}),
      ...(storage ? { storage } : {}),
    },
    global: {
      headers: {
        "X-Client-Info": "quackup-backend",
      },
    },
  });
}

const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: sharedAuthConfig,
  global: {
    headers: {
      "X-Client-Info": "quackup-backend-admin",
    },
  },
});

module.exports = {
  createSupabaseAuthClient,
  supabaseAdmin,
};

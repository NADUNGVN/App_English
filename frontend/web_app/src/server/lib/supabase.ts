import { createClient, type SupportedStorage } from "@supabase/supabase-js";
import { env } from "../config/env";

const sharedAuthConfig = {
  autoRefreshToken: false,
  detectSessionInUrl: false,
  persistSession: false,
};

export function createSupabaseAuthClient(
  options: { flowType?: "pkce"; storage?: SupportedStorage } = {},
) {
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
        "X-Client-Info": "quackup-next-backend",
      },
    },
  });
}

export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: sharedAuthConfig,
    global: {
      headers: {
        "X-Client-Info": "quackup-next-backend-admin",
      },
    },
  },
);

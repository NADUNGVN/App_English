import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { errorResponse } from "../../../../../server/lib/api";
import { createPkceCookieStorage } from "../../../../../server/lib/cookies";
import { getRequestOrigin } from "../../../../../server/lib/requestOrigin";
import {
  assertSupabaseProjectReachable,
  isSupabaseProjectUnavailableError,
} from "../../../../../server/lib/supabaseProject";
import { getGoogleSignInUrl } from "../../../../../server/modules/auth/auth.service";

export const runtime = "nodejs";

function logAuthError(stage: string, error: unknown) {
  console.error(`[auth:${stage}]`, error);
}

function logSupabaseProjectUnavailable(error: unknown) {
  if (!isSupabaseProjectUnavailableError(error)) {
    return;
  }

  console.warn("[auth:google-start] Supabase project is unavailable", {
    code: error.code,
    host: error.host,
  });
}

function buildCallbackUrl(request: NextRequest) {
  return new URL("/api/auth/google/callback", getRequestOrigin(request)).toString();
}

function buildAuthErrorUrl(request: NextRequest) {
  const fallbackPath = "/login";
  const referer = request.headers.get("referer");
  let path = fallbackPath;

  if (referer) {
    try {
      const refererUrl = new URL(referer);

      if (refererUrl.pathname === "/register") {
        path = "/register";
      }
    } catch {
      path = fallbackPath;
    }
  }

  const url = new URL(path, getRequestOrigin(request));
  url.searchParams.set("oauthError", "supabase");
  return url;
}

export async function GET(request: NextRequest) {
  const pkce = createPkceCookieStorage(request);

  try {
    await assertSupabaseProjectReachable();

    const url = await getGoogleSignInUrl(pkce.storage, buildCallbackUrl(request));
    const response = NextResponse.redirect(url, { status: 302 });
    pkce.apply(response);
    return response;
  } catch (error) {
    if (isSupabaseProjectUnavailableError(error)) {
      logSupabaseProjectUnavailable(error);
      const response = NextResponse.redirect(buildAuthErrorUrl(request), { status: 302 });
      pkce.clearAll();
      pkce.apply(response);
      return response;
    }

    logAuthError("google-start", error);
    return errorResponse(error);
  }
}

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  clearSessionCookies,
  createPkceCookieStorage,
  setSessionCookies,
} from "../../../../../server/lib/cookies";
import { getRequestOrigin } from "../../../../../server/lib/requestOrigin";
import { completeGoogleSignIn } from "../../../../../server/modules/auth/auth.service";

export const runtime = "nodejs";

function buildClientRedirect(
  request: NextRequest,
  path: string,
  params: Record<string, string> = {},
) {
  const url = new URL(path, getRequestOrigin(request));

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

function logAuthError(stage: string, error: unknown, context = {}) {
  const details =
    error && typeof error === "object"
      ? {
          message: "message" in error ? error.message : undefined,
          name: "name" in error ? error.name : undefined,
          stack: "stack" in error ? error.stack : undefined,
          status: "status" in error ? error.status : undefined,
          ...context,
        }
      : { error, ...context };

  console.error(`[auth:${stage}]`, details);
}

export async function GET(request: NextRequest) {
  const pkce = createPkceCookieStorage(request);

  try {
    const code = request.nextUrl.searchParams.get("code");

    if (!code) {
      throw new Error("Missing authorization code");
    }

    const result = await completeGoogleSignIn(code, pkce.storage);
    const response = NextResponse.redirect(buildClientRedirect(request, "/dashboard"), {
      status: 302,
    });
    pkce.clearAll();
    pkce.apply(response);
    setSessionCookies(response, result.session);
    return response;
  } catch (error) {
    logAuthError("google-callback", error, {
      hasCode: Boolean(request.nextUrl.searchParams.get("code")),
      queryKeys: [...request.nextUrl.searchParams.keys()],
    });

    const response = NextResponse.redirect(
      buildClientRedirect(request, "/register", { oauthError: "google" }),
      { status: 302 },
    );
    pkce.clearAll();
    pkce.apply(response);
    clearSessionCookies(response);
    return response;
  }
}

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { errorResponse } from "../../../../server/lib/api";
import { clearSessionCookies, getSessionCookies } from "../../../../server/lib/cookies";
import { logout } from "../../../../server/modules/auth/auth.service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const tokens = getSessionCookies(request);
    await logout(tokens);
    const response = new NextResponse(null, { status: 204 });
    clearSessionCookies(response);
    return response;
  } catch (error) {
    const response = errorResponse(error);
    clearSessionCookies(response);
    return response;
  }
}

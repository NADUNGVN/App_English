import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { errorResponse } from "../../../../server/lib/api";
import { setSessionCookies } from "../../../../server/lib/cookies";
import { requireAuth } from "../../../../server/modules/auth/auth.middleware";
import { getMe } from "../../../../server/modules/auth/auth.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const result = await getMe(auth.user);
    const response = NextResponse.json(result);
    setSessionCookies(response, auth.session);
    return response;
  } catch (error) {
    return errorResponse(error, { clearAuthOnUnauthorized: true });
  }
}

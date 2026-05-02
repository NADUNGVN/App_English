import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { errorResponse, readJson } from "../../../../server/lib/api";
import { setSessionCookies } from "../../../../server/lib/cookies";
import { requireAuth } from "../../../../server/modules/auth/auth.middleware";
import { updateProfileSchema } from "../../../../server/modules/users/user.schemas";
import { updateProfile } from "../../../../server/modules/users/user.service";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const payload = updateProfileSchema.parse(await readJson(request));
    const result = await updateProfile(auth.userId, payload);
    const response = NextResponse.json(result);
    setSessionCookies(response, auth.session);
    return response;
  } catch (error) {
    return errorResponse(error, { clearAuthOnUnauthorized: true });
  }
}

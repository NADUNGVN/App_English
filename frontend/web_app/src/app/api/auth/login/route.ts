import { NextResponse } from "next/server";
import { errorResponse, readJson } from "../../../../server/lib/api";
import { setSessionCookies } from "../../../../server/lib/cookies";
import { loginSchema } from "../../../../server/modules/auth/auth.schemas";
import { login } from "../../../../server/modules/auth/auth.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = loginSchema.parse(await readJson(request));
    const result = await login(payload);
    const response = NextResponse.json({ user: result.user });
    setSessionCookies(response, result.session);
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}

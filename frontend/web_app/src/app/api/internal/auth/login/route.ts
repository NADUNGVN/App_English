import { NextResponse } from "next/server";
import { errorResponse, readJson } from "../../../../../server/lib/api";
import {
  internalAdminLoginSchema,
  setInternalAdminCookie,
  validateInternalAdminCredentials,
} from "../../../../../server/modules/internal/adminAuth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const input = internalAdminLoginSchema.parse(await readJson(request));
    const admin = validateInternalAdminCredentials(input.email, input.password);
    const response = NextResponse.json({
      admin,
    });

    setInternalAdminCookie(response, admin.email);

    return response;
  } catch (error) {
    return errorResponse(error);
  }
}

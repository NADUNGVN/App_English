import { NextResponse } from "next/server";
import { clearInternalAdminCookie } from "../../../../../server/modules/internal/adminAuth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({
    ok: true,
  });

  clearInternalAdminCookie(response);

  return response;
}

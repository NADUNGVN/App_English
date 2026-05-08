import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "../../../../../server/lib/api";
import { requireInternalAdmin } from "../../../../../server/modules/internal/adminAuth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const admin = requireInternalAdmin(request);

    return NextResponse.json({
      admin: {
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

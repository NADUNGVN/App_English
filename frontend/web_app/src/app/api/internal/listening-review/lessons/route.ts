import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "../../../../../server/lib/api";
import { requireInternalAdmin } from "../../../../../server/modules/internal/adminAuth";
import { listTimingReviewLessons } from "../../../../../server/modules/listening/listening.review";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    requireInternalAdmin(request);

    return NextResponse.json({
      lessons: await listTimingReviewLessons(),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

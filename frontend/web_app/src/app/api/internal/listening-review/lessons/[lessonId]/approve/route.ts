import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { errorResponse } from "../../../../../../../server/lib/api";
import { listeningLessonIdSchema } from "../../../../../../../server/modules/listening/listening.schemas";
import { requireInternalAdmin } from "../../../../../../../server/modules/internal/adminAuth";
import {
  approveTimingReviewDocument,
} from "../../../../../../../server/modules/listening/listening.review";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ lessonId: string }> },
) {
  try {
    const admin = requireInternalAdmin(request);
    const params = await context.params;
    const lessonId = listeningLessonIdSchema.parse(params.lessonId);

    return NextResponse.json({
      document: await approveTimingReviewDocument(lessonId, admin.email),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { errorResponse, readJson } from "../../../../../../server/lib/api";
import { listeningLessonIdSchema } from "../../../../../../server/modules/listening/listening.schemas";
import { requireInternalAdmin } from "../../../../../../server/modules/internal/adminAuth";
import {
  getTimingReviewLessonPayload,
  saveTimingReviewDocument,
} from "../../../../../../server/modules/listening/listening.review";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ lessonId: string }> },
) {
  try {
    requireInternalAdmin(request);
    const params = await context.params;
    const lessonId = listeningLessonIdSchema.parse(params.lessonId);

    return NextResponse.json(await getTimingReviewLessonPayload(lessonId));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ lessonId: string }> },
) {
  try {
    const admin = requireInternalAdmin(request);
    const params = await context.params;
    const lessonId = listeningLessonIdSchema.parse(params.lessonId);
    const body = await readJson(request);

    return NextResponse.json({
      document: await saveTimingReviewDocument(lessonId, body, admin.email),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

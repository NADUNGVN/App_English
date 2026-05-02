import { NextResponse } from "next/server";
import { errorResponse } from "../../../../../server/lib/api";
import { getListeningLesson } from "../../../../../server/modules/listening/listening.service";
import { listeningLessonIdSchema } from "../../../../../server/modules/listening/listening.schemas";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ lessonId: string }> },
) {
  try {
    const params = await context.params;
    const lessonId = listeningLessonIdSchema.parse(params.lessonId);

    return NextResponse.json({
      lesson: getListeningLesson(lessonId),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

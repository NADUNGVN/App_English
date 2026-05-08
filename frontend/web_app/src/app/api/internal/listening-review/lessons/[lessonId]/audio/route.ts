import { readFile } from "node:fs/promises";
import type { NextRequest } from "next/server";
import { errorResponse } from "../../../../../../../server/lib/api";
import { requireInternalAdmin } from "../../../../../../../server/modules/internal/adminAuth";
import { listeningLessonIdSchema } from "../../../../../../../server/modules/listening/listening.schemas";
import { getTimingReviewAudioFile } from "../../../../../../../server/modules/listening/listening.timingWorker";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ lessonId: string }> },
) {
  try {
    requireInternalAdmin(request);
    const params = await context.params;
    const lessonId = listeningLessonIdSchema.parse(params.lessonId);
    const audio = await getTimingReviewAudioFile(lessonId);
    const file = await readFile(audio.filePath);

    return new Response(new Uint8Array(file.buffer, file.byteOffset, file.byteLength), {
      headers: {
        "Cache-Control": "private, max-age=3600",
        "Content-Length": String(audio.size),
        "Content-Type": audio.contentType,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

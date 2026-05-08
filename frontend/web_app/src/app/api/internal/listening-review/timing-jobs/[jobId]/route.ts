import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { errorResponse } from "../../../../../../server/lib/api";
import { requireInternalAdmin } from "../../../../../../server/modules/internal/adminAuth";
import { getTimingRecognitionJob } from "../../../../../../server/modules/listening/listening.timingWorker";

export const runtime = "nodejs";

const timingJobIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9-]+$/);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> },
) {
  try {
    requireInternalAdmin(request);
    const params = await context.params;
    const jobId = timingJobIdSchema.parse(params.jobId);

    return NextResponse.json({
      job: getTimingRecognitionJob(jobId),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

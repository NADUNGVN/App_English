import { NextResponse } from "next/server";
import { errorResponse } from "../../../../server/lib/api";
import { listListeningLessons } from "../../../../server/modules/listening/listening.service";

export const runtime = "nodejs";

export async function GET() {
  try {
    return NextResponse.json({
      lessons: listListeningLessons(),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

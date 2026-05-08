import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { errorResponse, readJson } from "../../../../../server/lib/api";
import { requireAuth } from "../../../../../server/modules/auth/auth.middleware";
import { vocabularyReviewAnswerSchema } from "../../../../../server/modules/vocabulary/vocabulary.schemas";
import { submitVocabularyReviewAnswer } from "../../../../../server/modules/vocabulary/vocabulary.service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const input = vocabularyReviewAnswerSchema.parse(await readJson(request));
    const result = await submitVocabularyReviewAnswer(auth.userId, input);

    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(error, { clearAuthOnUnauthorized: true });
  }
}

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { errorResponse } from "../../../../../server/lib/api";
import { requireAuth } from "../../../../../server/modules/auth/auth.middleware";
import { vocabularyReviewDueQuerySchema } from "../../../../../server/modules/vocabulary/vocabulary.schemas";
import { getVocabularyReviewQueue } from "../../../../../server/modules/vocabulary/vocabulary.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const query = vocabularyReviewDueQuerySchema.parse({
      collectionSlug: request.nextUrl.searchParams.get("collectionSlug") ?? undefined,
      limit: request.nextUrl.searchParams.get("limit") ?? undefined,
      setSlug: request.nextUrl.searchParams.get("setSlug") ?? undefined,
    });
    const locale = request.nextUrl.searchParams.get("locale") === "en" ? "en" : "vi";
    const result = await getVocabularyReviewQueue(auth.userId, locale, query);
    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(error, { clearAuthOnUnauthorized: true });
  }
}

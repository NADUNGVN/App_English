import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { errorResponse } from "../../../../server/lib/api";
import { requireAuth } from "../../../../server/modules/auth/auth.middleware";
import { getVocabularyCollections } from "../../../../server/modules/vocabulary/vocabulary.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const locale = request.nextUrl.searchParams.get("locale") === "en" ? "en" : "vi";
    const result = await getVocabularyCollections(auth.userId, locale, "ALL");
    return NextResponse.json(result.stats);
  } catch (error) {
    return errorResponse(error, { clearAuthOnUnauthorized: true });
  }
}

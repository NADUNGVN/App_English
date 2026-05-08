import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { errorResponse } from "../../../../../server/lib/api";
import { requireAuth } from "../../../../../server/modules/auth/auth.middleware";
import { getVocabularyCollection } from "../../../../../server/modules/vocabulary/vocabulary.service";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    collectionSlug: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAuth(request);
    const params = await context.params;
    const locale = request.nextUrl.searchParams.get("locale") === "en" ? "en" : "vi";
    const result = await getVocabularyCollection(auth.userId, locale, params.collectionSlug);
    return NextResponse.json(result);
  } catch (error) {
    return errorResponse(error, { clearAuthOnUnauthorized: true });
  }
}

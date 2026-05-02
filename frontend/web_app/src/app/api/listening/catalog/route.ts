import { NextResponse } from "next/server";
import { errorResponse } from "../../../../server/lib/api";
import {
  listeningCategoryIdSchema,
  listeningLevelFilterSchema,
} from "../../../../server/modules/listening/listening.schemas";
import { getListeningCatalog } from "../../../../server/modules/listening/listening.service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const categoryId = listeningCategoryIdSchema.parse(
      url.searchParams.get("category") ?? "all",
    );
    const level = listeningLevelFilterSchema.parse(
      url.searchParams.get("level") ?? "ALL",
    );

    return NextResponse.json({
      catalog: getListeningCatalog({
        categoryId,
        level,
      }),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

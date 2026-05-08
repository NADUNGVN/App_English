import { NextResponse } from "next/server";
import { errorResponse, readJson } from "../../../../server/lib/api";
import { checkDictation } from "../../../../server/modules/listening/listening.service";
import { dictationCheckSchema } from "../../../../server/modules/listening/listening.schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const input = dictationCheckSchema.parse(await readJson(request));

    return NextResponse.json({
      result: await checkDictation(input),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

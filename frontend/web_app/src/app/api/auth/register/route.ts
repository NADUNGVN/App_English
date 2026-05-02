import { NextResponse } from "next/server";
import { errorResponse, readJson } from "../../../../server/lib/api";
import { registerSchema } from "../../../../server/modules/auth/auth.schemas";
import { register } from "../../../../server/modules/auth/auth.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = registerSchema.parse(await readJson(request));
    const result = await register(payload);
    return NextResponse.json(result, { status: 202 });
  } catch (error) {
    return errorResponse(error);
  }
}

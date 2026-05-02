import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { clearSessionCookies } from "./cookies";
import { HttpError } from "./httpError";

export async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new HttpError(400, "Invalid JSON body");
  }
}

export function errorResponse(
  error: unknown,
  options: { clearAuthOnUnauthorized?: boolean } = {},
) {
  let response: NextResponse;

  if (error instanceof ZodError) {
    response = NextResponse.json(
      {
        error: "Validation failed",
        details: error.flatten(),
      },
      { status: 400 },
    );
  } else if (error instanceof HttpError) {
    response = NextResponse.json(
      {
        error: error.message,
        details: error.details,
      },
      { status: error.status },
    );
  } else {
    console.error(error);

    response = NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }

  if (options.clearAuthOnUnauthorized && response.status === 401) {
    clearSessionCookies(response);
  }

  return response;
}

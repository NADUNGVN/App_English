export const API_BASE_URL = "/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export function buildApiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

function getErrorMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "Request failed";
  }

  const record = payload as {
    error?: unknown;
    message?: unknown;
  };

  if (typeof record.message === "string") {
    return record.message;
  }

  if (typeof record.error === "string") {
    return record.error;
  }

  if (
    record.error &&
    typeof record.error === "object" &&
    "message" in record.error &&
    typeof record.error.message === "string"
  ) {
    return record.error.message;
  }

  return "Request failed";
}

export async function request<TPayload = unknown>(
  path: string,
  options: ApiRequestOptions = {},
) {
  const { body, headers = {}, ...rest } = options;
  let response;
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  try {
    response = await fetch(buildApiUrl(path), {
      ...rest,
      credentials: "include",
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Unable to reach the server", 0);
  }

  const contentType = response.headers.get("content-type");
  const payload =
    response.status === 204
      ? null
      : contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

  if (!response.ok) {
    throw new ApiError(getErrorMessage(payload), response.status);
  }

  return payload as TPayload;
}

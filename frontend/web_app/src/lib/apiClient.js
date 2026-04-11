const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function request(path, options = {}) {
  const { body, token, headers = {}, ...rest } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get("content-type");
  const payload =
    response.status === 204
      ? null
      : contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload
        ? payload.error || payload.message || "Request failed"
        : "Request failed";
    throw new ApiError(message, response.status);
  }

  return payload;
}

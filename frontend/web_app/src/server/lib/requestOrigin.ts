import type { NextRequest } from "next/server";

function firstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}

function normalizeWildcardHost(host: string) {
  return host
    .replace(/^0\.0\.0\.0(?=:\d+$|$)/, "localhost")
    .replace(/^\[::\](?=:\d+$|$)/, "localhost");
}

export function getRequestOrigin(request: NextRequest) {
  const forwardedHost = firstHeaderValue(request.headers.get("x-forwarded-host"));
  const host = normalizeWildcardHost(
    forwardedHost ?? request.headers.get("host") ?? request.nextUrl.host,
  );
  const forwardedProtocol = firstHeaderValue(request.headers.get("x-forwarded-proto"));
  const nextProtocol = request.nextUrl.protocol.replace(/:$/, "") || "http";
  const protocol = forwardedProtocol ?? nextProtocol;

  return `${protocol}://${host}`;
}

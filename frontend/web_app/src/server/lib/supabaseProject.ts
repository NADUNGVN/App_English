import dns from "node:dns/promises";
import { env } from "../config/env";

export class SupabaseProjectUnavailableError extends Error {
  code?: string;
  host: string;

  constructor(host: string, code?: string) {
    super("Supabase project host is not reachable");
    this.name = "SupabaseProjectUnavailableError";
    this.host = host;
    this.code = code;
  }
}

function getErrorCode(error: unknown) {
  return error && typeof error === "object" && "code" in error
    ? String(error.code)
    : undefined;
}

export function isSupabaseProjectUnavailableError(
  error: unknown,
): error is SupabaseProjectUnavailableError {
  return error instanceof SupabaseProjectUnavailableError;
}

export async function assertSupabaseProjectReachable() {
  const host = new URL(env.SUPABASE_URL).hostname;

  try {
    await dns.lookup(host);
  } catch (error) {
    throw new SupabaseProjectUnavailableError(host, getErrorCode(error));
  }
}

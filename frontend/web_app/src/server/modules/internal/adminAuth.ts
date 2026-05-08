import crypto from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "../../config/env";
import { HttpError } from "../../lib/httpError";

const INTERNAL_ADMIN_COOKIE = "quackup-internal-admin";
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
const DEV_ADMIN_EMAIL = "admin@quackup.local";
const DEV_ADMIN_PASSWORD_HASH =
  "scrypt:16384:8:1:quackup-local-admin:qFP-x2dwAAYFEN8k9x2Hl2pT_KnmHEoPLMUNpLtlb3S_oLRJW3D4nriGa2yB-4F3TebqiN5A6ny8NftGgeOalA";
const DEV_ADMIN_SESSION_SECRET =
  "quackup-local-internal-admin-session-secret-change-in-production";

type InternalAdminSessionPayload = {
  email: string;
  exp: number;
  iat: number;
  role: "INTERNAL_ADMIN";
};

export type InternalAdminSession = InternalAdminSessionPayload;

export const internalAdminLoginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(1).max(256),
});

function baseCookieOptions() {
  return {
    domain: env.COOKIE_DOMAIN,
    httpOnly: true,
    path: "/",
    sameSite: env.COOKIE_SAME_SITE,
    secure: env.COOKIE_SECURE,
  } as const;
}

function getInternalAdminConfig() {
  const isProduction = env.NODE_ENV === "production";
  const email = env.INTERNAL_ADMIN_EMAIL ?? (isProduction ? undefined : DEV_ADMIN_EMAIL);
  const passwordHash =
    env.INTERNAL_ADMIN_PASSWORD_HASH ??
    (isProduction ? undefined : DEV_ADMIN_PASSWORD_HASH);
  const sessionSecret =
    env.INTERNAL_ADMIN_SESSION_SECRET ??
    (isProduction ? undefined : DEV_ADMIN_SESSION_SECRET);

  if (!email || !passwordHash || !sessionSecret) {
    throw new HttpError(503, "Internal admin auth is not configured");
  }

  if (isProduction && sessionSecret.length < 32) {
    throw new HttpError(503, "Internal admin session secret is too short");
  }

  return {
    email: email.toLowerCase(),
    passwordHash,
    sessionSecret,
  };
}

function verifyScryptPassword(password: string, encodedHash: string) {
  const [scheme, nValue, rValue, pValue, salt, expectedHash] = encodedHash.split(":");

  if (scheme !== "scrypt" || !nValue || !rValue || !pValue || !salt || !expectedHash) {
    return false;
  }

  const expected = Buffer.from(expectedHash, "base64url");
  const actual = crypto.scryptSync(password, salt, expected.length, {
    N: Number(nValue),
    p: Number(pValue),
    r: Number(rValue),
  });

  return (
    actual.length === expected.length &&
    crypto.timingSafeEqual(new Uint8Array(actual), new Uint8Array(expected))
  );
}

function encodeBase64UrlJson(value: unknown) {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function decodeBase64UrlJson<TValue>(value: string) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as TValue;
}

function signPayload(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

function createSessionCookieValue(email: string) {
  const { sessionSecret } = getInternalAdminConfig();
  const now = Math.floor(Date.now() / 1000);
  const payload = encodeBase64UrlJson({
    email,
    exp: now + SESSION_MAX_AGE_SECONDS,
    iat: now,
    role: "INTERNAL_ADMIN",
  } satisfies InternalAdminSessionPayload);
  const signature = signPayload(payload, sessionSecret);

  return `${payload}.${signature}`;
}

export function getInternalAdminSessionFromCookieValue(
  cookieValue?: string | null,
): InternalAdminSession | null {
  if (!cookieValue) {
    return null;
  }

  const { email, sessionSecret } = getInternalAdminConfig();
  const [payload, signature] = cookieValue.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payload, sessionSecret);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(
      new Uint8Array(signatureBuffer),
      new Uint8Array(expectedBuffer),
    )
  ) {
    return null;
  }

  try {
    const session = decodeBase64UrlJson<InternalAdminSessionPayload>(payload);
    const now = Math.floor(Date.now() / 1000);

    if (
      session.role !== "INTERNAL_ADMIN" ||
      session.email.toLowerCase() !== email ||
      session.exp <= now
    ) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function getInternalAdminSession(request: NextRequest) {
  return getInternalAdminSessionFromCookieValue(
    request.cookies.get(INTERNAL_ADMIN_COOKIE)?.value,
  );
}

export function requireInternalAdmin(request: NextRequest) {
  const session = getInternalAdminSession(request);

  if (!session) {
    throw new HttpError(401, "Internal admin authentication required");
  }

  return session;
}

export function setInternalAdminCookie(response: NextResponse, email: string) {
  response.cookies.set(INTERNAL_ADMIN_COOKIE, createSessionCookieValue(email), {
    ...baseCookieOptions(),
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearInternalAdminCookie(response: NextResponse) {
  response.cookies.set(INTERNAL_ADMIN_COOKIE, "", {
    ...baseCookieOptions(),
    maxAge: 0,
  });
}

export function validateInternalAdminCredentials(email: string, password: string) {
  const config = getInternalAdminConfig();

  if (email.toLowerCase() !== config.email) {
    throw new HttpError(401, "Invalid internal admin credentials");
  }

  if (!verifyScryptPassword(password, config.passwordHash)) {
    throw new HttpError(401, "Invalid internal admin credentials");
  }

  return {
    email: config.email,
    role: "INTERNAL_ADMIN" as const,
  };
}

export function getInternalAdminCookieName() {
  return INTERNAL_ADMIN_COOKIE;
}

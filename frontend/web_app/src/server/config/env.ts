import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

const rootEnvPath = path.resolve(process.cwd(), "../../.env");
const parentEnvPath = path.resolve(process.cwd(), "../.env");
const localEnvPath = path.resolve(process.cwd(), ".env");
const runtimeNodeEnv = process.env.NODE_ENV;

dotenv.config({ path: rootEnvPath, override: true, quiet: true });
dotenv.config({ path: parentEnvPath, override: false, quiet: true });
dotenv.config({ path: localEnvPath, override: false, quiet: true });

if (runtimeNodeEnv) {
  (process.env as Record<string, string | undefined>)["NODE_ENV"] = runtimeNodeEnv;
}

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((value) => {
    if (!value) {
      return undefined;
    }

    return value;
  });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  CLIENT_URL: z.string().url().default("http://localhost:3000"),
  SUPABASE_URL: z.string().url(),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_EMAIL_REDIRECT_URL: z
    .string()
    .url()
    .default("http://localhost:3000/login?confirmed=1"),
  SUPABASE_GOOGLE_REDIRECT_URL: z
    .string()
    .url()
    .default("http://localhost:3000/api/auth/google/callback"),
  COOKIE_DOMAIN: optionalString,
  COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),
  COOKIE_SECURE: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  INTERNAL_ADMIN_EMAIL: optionalString,
  INTERNAL_ADMIN_PASSWORD_HASH: optionalString,
  INTERNAL_ADMIN_SESSION_SECRET: optionalString,
  LISTENING_TIMING_PYTHON: optionalString,
  LISTENING_TIMING_MODEL: optionalString,
  LISTENING_TIMING_DEVICE: optionalString,
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

const placeholderEntries = [
  ["SUPABASE_URL", "https://your-project-ref.supabase.co"],
  ["SUPABASE_PUBLISHABLE_KEY", "your-supabase-publishable-key"],
  ["SUPABASE_SERVICE_ROLE_KEY", "your-supabase-service-role-key"],
] as const;

for (const [key, placeholderValue] of placeholderEntries) {
  if (parsed.data[key] === placeholderValue) {
    throw new Error(
      `Environment variable ${key} is still using the example placeholder value`,
    );
  }
}

export const env = parsed.data;

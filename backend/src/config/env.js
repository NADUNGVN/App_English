const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { z } = require("zod");

const envPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../.env"),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
    break;
  }
}

const optionalString = z.string().trim().optional().transform((value) => {
  if (!value) {
    return undefined;
  }

  return value;
});

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  SUPABASE_URL: z.string().url(),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_EMAIL_REDIRECT_URL: z
    .string()
    .url()
    .default("http://localhost:5173/register?confirmed=1"),
  SUPABASE_GOOGLE_REDIRECT_URL: z
    .string()
    .url()
    .default("http://localhost:3001/api/auth/google/callback"),
  COOKIE_DOMAIN: optionalString,
  COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),
  COOKIE_SECURE: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

const placeholderEntries = [
  ["SUPABASE_URL", "https://your-project-ref.supabase.co"],
  ["SUPABASE_PUBLISHABLE_KEY", "your-supabase-publishable-key"],
  ["SUPABASE_SERVICE_ROLE_KEY", "your-supabase-service-role-key"],
];

for (const [key, placeholderValue] of placeholderEntries) {
  if (parsed.data[key] === placeholderValue) {
    throw new Error(
      `Environment variable ${key} is still using the example placeholder value`,
    );
  }
}

module.exports = parsed.data;

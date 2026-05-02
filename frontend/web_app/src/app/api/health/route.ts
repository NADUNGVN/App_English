import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../server/lib/supabase";

export const runtime = "nodejs";

async function runCheck(check: () => Promise<void>) {
  try {
    await check();
    return "connected";
  } catch {
    return "unavailable";
  }
}

export async function GET() {
  const [auth, database, storage] = await Promise.all([
    runCheck(async () => {
      const { error } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1,
      });

      if (error) {
        throw error;
      }
    }),
    runCheck(async () => {
      const { error } = await supabaseAdmin
        .from("profiles")
        .select("id", { count: "exact", head: true });

      if (error) {
        throw error;
      }
    }),
    runCheck(async () => {
      const { error } = await supabaseAdmin.storage.getBucket("avatars");

      if (error) {
        throw error;
      }
    }),
  ]);

  const checks = { auth, database, storage };
  const status = Object.values(checks).every((value) => value === "connected")
    ? "ok"
    : "degraded";

  return NextResponse.json({
    status,
    checks,
    runtime: "supabase",
    timestamp: new Date().toISOString(),
  });
}

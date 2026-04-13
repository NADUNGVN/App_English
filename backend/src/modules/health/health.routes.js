const express = require("express");
const { supabaseAdmin } = require("../../lib/supabase");

const router = express.Router();

async function runCheck(check) {
  try {
    await check();
    return "connected";
  } catch {
    return "unavailable";
  }
}

router.get("/", async (request, response) => {
  const auth = await runCheck(async () => {
    const { error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });

    if (error) {
      throw error;
    }
  });

  const database = await runCheck(async () => {
    const { error } = await supabaseAdmin
      .from("profiles")
      .select("id", { count: "exact", head: true });

    if (error) {
      throw error;
    }
  });

  const storage = await runCheck(async () => {
    const { error } = await supabaseAdmin.storage.getBucket("avatars");

    if (error) {
      throw error;
    }
  });

  const checks = { auth, database, storage };
  const status = Object.values(checks).every((value) => value === "connected")
    ? "ok"
    : "degraded";

  response.status(200).json({
    status,
    checks,
    runtime: "supabase",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;

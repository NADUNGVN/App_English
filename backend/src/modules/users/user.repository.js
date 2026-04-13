const { HttpError } = require("../../lib/httpError");
const { supabaseAdmin } = require("../../lib/supabase");

function unwrapRowResponse(result, fallbackMessage) {
  if (result.error) {
    throw new HttpError(500, fallbackMessage, result.error.message);
  }

  return result.data;
}

async function findProfileById(id) {
  const result = await supabaseAdmin.from("profiles").select("*").eq("id", id).maybeSingle();

  if (result.error) {
    throw new HttpError(500, "Failed to fetch user profile", result.error.message);
  }

  return result.data;
}

async function upsertProfile(record) {
  const result = await supabaseAdmin
    .from("profiles")
    .upsert(record, { onConflict: "id" })
    .select("*")
    .single();

  return unwrapRowResponse(result, "Failed to save user profile");
}

async function updateProfile(id, patch) {
  const result = await supabaseAdmin
    .from("profiles")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  return unwrapRowResponse(result, "Failed to update user profile");
}

module.exports = {
  findProfileById,
  updateProfile,
  upsertProfile,
};

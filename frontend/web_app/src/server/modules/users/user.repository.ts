import { HttpError } from "../../lib/httpError";
import { supabaseAdmin } from "../../lib/supabase";

function unwrapRowResponse(result, fallbackMessage: string) {
  if (result.error) {
    throw new HttpError(500, fallbackMessage, result.error.message);
  }

  return result.data;
}

export async function findProfileById(id: string) {
  const result = await supabaseAdmin.from("profiles").select("*").eq("id", id).maybeSingle();

  if (result.error) {
    throw new HttpError(500, "Failed to fetch user profile", result.error.message);
  }

  return result.data;
}

export async function upsertProfile(record) {
  const result = await supabaseAdmin
    .from("profiles")
    .upsert(record, { onConflict: "id" })
    .select("*")
    .single();

  return unwrapRowResponse(result, "Failed to save user profile");
}

export async function updateProfileRecord(id: string, patch) {
  const result = await supabaseAdmin
    .from("profiles")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  return unwrapRowResponse(result, "Failed to update user profile");
}

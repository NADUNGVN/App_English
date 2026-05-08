import { HttpError } from "../../lib/httpError";
import { supabaseAdmin } from "../../lib/supabase";
import type { VocabularyCategory } from "./vocabulary.types";

export type CollectionRow = {
  id: string;
  slug: string;
  category: VocabularyCategory;
  level: string | null;
  title_vi: string;
  title_en: string;
  description_vi: string;
  description_en: string;
  cover_image_url: string | null;
  is_premium: boolean;
  sort_order: number;
  status: string;
};

export type SetRow = {
  id: string;
  collection_id: string;
  slug: string;
  title_vi: string;
  title_en: string;
  description_vi: string | null;
  description_en: string | null;
  sort_order: number;
  status: string;
};

export type WordRow = {
  id: string;
  collection_id: string;
  set_id: string;
  word: string;
  normalized: string;
  ipa_us: string | null;
  ipa_uk: string | null;
  part_of_speech: string | null;
  meaning_vi: string;
  definition_en: string;
  example_en: string | null;
  example_vi: string | null;
  synonyms: string[];
  collocations: string[];
  tags: string[];
  audio_url: string | null;
  sort_order: number;
  status: string;
};

export type ProgressRow = {
  user_id: string;
  word_id: string;
  status: "NEW" | "LEARNING" | "REVIEW" | "MASTERED";
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  lapses: number;
  due_at: string;
  last_quality: "AGAIN" | "HARD" | "GOOD" | "EASY" | null;
  last_reviewed_at: string | null;
};

function throwIfError(result: { error: { message?: string } | null }, message: string) {
  if (result.error) {
    throw new HttpError(500, message, result.error.message);
  }
}

export async function listCollections(category?: VocabularyCategory) {
  let query = supabaseAdmin
    .from("vocabulary_collections")
    .select("*")
    .eq("status", "PUBLISHED")
    .order("sort_order", { ascending: true })
    .order("title_en", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  const result = await query;
  throwIfError(result, "Failed to fetch vocabulary collections");
  return (result.data ?? []) as CollectionRow[];
}

export async function listAllPublishedCollections() {
  const result = await supabaseAdmin
    .from("vocabulary_collections")
    .select("*")
    .eq("status", "PUBLISHED")
    .order("sort_order", { ascending: true });

  throwIfError(result, "Failed to fetch vocabulary collections");
  return (result.data ?? []) as CollectionRow[];
}

export async function findCollectionBySlug(slug: string) {
  const result = await supabaseAdmin
    .from("vocabulary_collections")
    .select("*")
    .eq("slug", slug)
    .eq("status", "PUBLISHED")
    .maybeSingle();

  throwIfError(result, "Failed to fetch vocabulary collection");
  return result.data as CollectionRow | null;
}

export async function listSetsByCollectionIds(collectionIds: string[]) {
  if (collectionIds.length === 0) {
    return [] as SetRow[];
  }

  const result = await supabaseAdmin
    .from("vocabulary_sets")
    .select("*")
    .in("collection_id", collectionIds)
    .eq("status", "PUBLISHED")
    .order("sort_order", { ascending: true })
    .order("title_en", { ascending: true });

  throwIfError(result, "Failed to fetch vocabulary sets");
  return (result.data ?? []) as SetRow[];
}

export async function findSetBySlug(collectionId: string, slug: string) {
  const result = await supabaseAdmin
    .from("vocabulary_sets")
    .select("*")
    .eq("collection_id", collectionId)
    .eq("slug", slug)
    .eq("status", "PUBLISHED")
    .maybeSingle();

  throwIfError(result, "Failed to fetch vocabulary set");
  return result.data as SetRow | null;
}

export async function listWordsByCollectionIds(collectionIds: string[]) {
  if (collectionIds.length === 0) {
    return [] as WordRow[];
  }

  const result = await supabaseAdmin
    .from("vocabulary_words")
    .select("*")
    .in("collection_id", collectionIds)
    .eq("status", "PUBLISHED")
    .order("sort_order", { ascending: true })
    .order("word", { ascending: true });

  throwIfError(result, "Failed to fetch vocabulary words");
  return (result.data ?? []) as WordRow[];
}

export async function listWordsBySetId(setId: string) {
  const result = await supabaseAdmin
    .from("vocabulary_words")
    .select("*")
    .eq("set_id", setId)
    .eq("status", "PUBLISHED")
    .order("sort_order", { ascending: true })
    .order("word", { ascending: true });

  throwIfError(result, "Failed to fetch vocabulary words");
  return (result.data ?? []) as WordRow[];
}

export async function findWordById(wordId: string) {
  const result = await supabaseAdmin
    .from("vocabulary_words")
    .select("*")
    .eq("id", wordId)
    .eq("status", "PUBLISHED")
    .maybeSingle();

  throwIfError(result, "Failed to fetch vocabulary word");
  return result.data as WordRow | null;
}

export async function listProgressByWordIds(userId: string, wordIds: string[]) {
  if (wordIds.length === 0) {
    return [] as ProgressRow[];
  }

  const result = await supabaseAdmin
    .from("vocabulary_user_word_progress")
    .select("*")
    .eq("user_id", userId)
    .in("word_id", wordIds);

  throwIfError(result, "Failed to fetch vocabulary progress");
  return (result.data ?? []) as ProgressRow[];
}

export async function findProgress(userId: string, wordId: string) {
  const result = await supabaseAdmin
    .from("vocabulary_user_word_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("word_id", wordId)
    .maybeSingle();

  throwIfError(result, "Failed to fetch vocabulary progress");
  return result.data as ProgressRow | null;
}

export async function upsertProgress(row: ProgressRow) {
  const result = await supabaseAdmin
    .from("vocabulary_user_word_progress")
    .upsert(row, { onConflict: "user_id,word_id" })
    .select("*")
    .single();

  throwIfError(result, "Failed to save vocabulary progress");
  return result.data as ProgressRow;
}

export async function insertReviewEvent(row: {
  next_status: string;
  previous_status: string;
  quality: string;
  response_ms?: number;
  user_id: string;
  word_id: string;
}) {
  const result = await supabaseAdmin.from("vocabulary_review_events").insert(row);
  throwIfError(result, "Failed to save vocabulary review event");
}

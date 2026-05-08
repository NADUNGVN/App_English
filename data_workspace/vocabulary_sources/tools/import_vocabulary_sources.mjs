import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceDir = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(scriptDir, "..", "..", "..");

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = process.env[key] ?? value;
  }
}

loadDotEnv(path.join(repoRoot, ".env"));
loadDotEnv(path.join(repoRoot, "frontend", "web_app", ".env"));

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
}

function parseCsv(content) {
  const rows = [];
  let current = "";
  let row = [];
  let quoted = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const next = content[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }

      row.push(current);
      current = "";

      if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    current += char;
  }

  if (current || row.length) {
    row.push(current);

    if (row.some((value) => value.trim() !== "")) {
      rows.push(row);
    }
  }

  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0].map((header) => header.trim());

  return rows.slice(1).map((values, rowIndex) => {
    const record = {};

    headers.forEach((header, columnIndex) => {
      record[header] = values[columnIndex]?.trim() ?? "";
    });

    record.__row = rowIndex + 2;
    return record;
  });
}

function readCsv(fileName) {
  const filePath = path.join(workspaceDir, fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing ${fileName}`);
  }

  return parseCsv(fs.readFileSync(filePath, "utf8"));
}

function required(record, field, fileName) {
  const value = record[field]?.trim();

  if (!value) {
    throw new Error(`${fileName}:${record.__row} missing ${field}`);
  }

  return value;
}

function optional(record, field) {
  const value = record[field]?.trim();
  return value ? value : null;
}

function boolValue(value) {
  return String(value).trim().toLowerCase() === "true";
}

function intValue(value, fallback = 0) {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function listValue(value) {
  return String(value || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function rest(pathname, options = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${pathname}`, {
    ...options,
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`${options.method ?? "GET"} ${pathname} failed: ${text}`);
  }

  return payload;
}

async function upsert(table, rows, onConflict) {
  if (rows.length === 0) {
    return [];
  }

  return rest(`${table}?on_conflict=${encodeURIComponent(onConflict)}`, {
    body: JSON.stringify(rows),
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    method: "POST",
  });
}

const collectionRows = readCsv("collections.csv").map((record) => ({
  category: required(record, "category", "collections.csv"),
  cover_image_url: optional(record, "cover_image_url"),
  description_en: required(record, "description_en", "collections.csv"),
  description_vi: required(record, "description_vi", "collections.csv"),
  is_premium: boolValue(record.is_premium),
  level: optional(record, "level"),
  slug: required(record, "slug", "collections.csv"),
  sort_order: intValue(record.sort_order),
  status: record.status || "PUBLISHED",
  title_en: required(record, "title_en", "collections.csv"),
  title_vi: required(record, "title_vi", "collections.csv"),
}));

const collections = await upsert("vocabulary_collections", collectionRows, "slug");
const collectionBySlug = new Map(collections.map((item) => [item.slug, item]));

const setRows = readCsv("sets.csv").map((record) => {
  const collectionSlug = required(record, "collection_slug", "sets.csv");
  const collection = collectionBySlug.get(collectionSlug);

  if (!collection) {
    throw new Error(`sets.csv:${record.__row} unknown collection_slug ${collectionSlug}`);
  }

  return {
    collection_id: collection.id,
    description_en: optional(record, "description_en"),
    description_vi: optional(record, "description_vi"),
    slug: required(record, "slug", "sets.csv"),
    sort_order: intValue(record.sort_order),
    status: record.status || "PUBLISHED",
    title_en: required(record, "title_en", "sets.csv"),
    title_vi: required(record, "title_vi", "sets.csv"),
  };
});

const sets = await upsert("vocabulary_sets", setRows, "collection_id,slug");
const collectionSlugById = new Map(collections.map((item) => [item.id, item.slug]));
const setByKey = new Map(
  sets.map((item) => [`${collectionSlugById.get(item.collection_id)}:${item.slug}`, item]),
);

const wordRows = readCsv("words.csv").map((record) => {
  const collectionSlug = required(record, "collection_slug", "words.csv");
  const setSlug = required(record, "set_slug", "words.csv");
  const collection = collectionBySlug.get(collectionSlug);
  const set = setByKey.get(`${collectionSlug}:${setSlug}`);
  const word = required(record, "word", "words.csv");

  if (!collection) {
    throw new Error(`words.csv:${record.__row} unknown collection_slug ${collectionSlug}`);
  }

  if (!set) {
    throw new Error(`words.csv:${record.__row} unknown set ${collectionSlug}/${setSlug}`);
  }

  return {
    audio_url: optional(record, "audio_url"),
    collection_id: collection.id,
    collocations: listValue(record.collocations),
    definition_en: required(record, "definition_en", "words.csv"),
    example_en: optional(record, "example_en"),
    example_vi: optional(record, "example_vi"),
    ipa_uk: optional(record, "ipa_uk"),
    ipa_us: optional(record, "ipa_us"),
    meaning_vi: required(record, "meaning_vi", "words.csv"),
    normalized: optional(record, "normalized") ?? word.toLowerCase(),
    part_of_speech: optional(record, "part_of_speech"),
    set_id: set.id,
    sort_order: intValue(record.sort_order),
    status: record.status || "PUBLISHED",
    synonyms: listValue(record.synonyms),
    tags: listValue(record.tags),
    word,
  };
});

const words = await upsert("vocabulary_words", wordRows, "set_id,normalized");

console.log(
  `Imported ${collections.length} collections, ${sets.length} sets, ${words.length} words.`,
);

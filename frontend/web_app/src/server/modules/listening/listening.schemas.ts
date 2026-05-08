import { z } from "zod";

export const listeningLevelFilterSchema = z
  .enum(["ALL", "A1", "A2", "B1", "B2", "C1"])
  .default("ALL");

export const listeningCategoryIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9-]+$/)
  .default("all");

export const listeningLessonIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9-]+$/);

export const dictationCheckSchema = z.object({
  lessonId: listeningLessonIdSchema,
  segmentId: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  answer: z.string().max(1200).default(""),
});

const localizedTextSchema = z.object({
  vi: z.string(),
  en: z.string(),
});

const timingWordSchema = z.object({
  index: z.number().int().min(0),
  text: z.string().min(1).max(140),
  normalized: z.string().max(140).default(""),
  startSeconds: z.number().min(0),
  endSeconds: z.number().min(0),
  confidence: z.number().min(0).max(1).optional(),
  source: z
    .enum(["MODEL", "INTERPOLATED", "MANUAL", "SEGMENT_FALLBACK"])
    .default("MANUAL"),
  note: z.string().max(1000).optional(),
});

const timingReviewSegmentSchema = z.object({
  id: z.string().trim().min(1).max(80).regex(/^[a-z0-9-]+$/),
  order: z.number().int().min(1),
  speaker: z.string().max(120).default("Speaker"),
  startSeconds: z.number().min(0),
  endSeconds: z.number().min(0),
  transcript: z.string().min(1).max(4000),
  approved: z.boolean().default(false),
  note: z.string().max(1000).optional(),
  words: z.array(timingWordSchema).default([]),
});

export const timingReviewDocumentSchema = z.object({
  version: z.literal(1),
  lessonId: listeningLessonIdSchema,
  categoryId: listeningCategoryIdSchema,
  youtubeVideoId: z.string().trim().min(1).max(32),
  title: localizedTextSchema,
  status: z.enum(["NEEDS_TIMING", "DRAFT", "APPROVED"]).default("DRAFT"),
  source: z.enum(["DRAFT", "APPROVED"]).default("DRAFT"),
  updatedAt: z.string().min(1),
  updatedBy: z.string().min(1).max(160).default("internal-review"),
  approvedAt: z.string().optional(),
  approvedBy: z.string().max(160).optional(),
  segments: z.array(timingReviewSegmentSchema).min(1),
});

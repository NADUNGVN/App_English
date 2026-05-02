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

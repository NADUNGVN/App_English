import { z } from "zod";

export const vocabularyCategoryQuerySchema = z.object({
  category: z
    .enum(["ALL", "IELTS", "TOEIC", "ACADEMIC", "OXFORD", "GENERAL"])
    .default("ALL"),
});

export const vocabularyReviewDueQuerySchema = z.object({
  collectionSlug: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  setSlug: z.string().trim().min(1).optional(),
});

export const vocabularyReviewAnswerSchema = z.object({
  quality: z.enum(["AGAIN", "HARD", "GOOD", "EASY"]),
  responseMs: z.number().int().min(0).max(30 * 60 * 1000).optional(),
  wordId: z.string().uuid(),
});

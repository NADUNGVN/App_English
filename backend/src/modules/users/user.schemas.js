const { z } = require("zod");

const updateProfileSchema = z
  .object({
    displayName: z.string().trim().min(2).max(80).optional(),
    preferredLanguage: z.enum(["vi", "en"]).optional(),
    dailyGoalMinutes: z.coerce.number().int().min(5).max(120).optional(),
    avatarUrl: z.string().url().optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one profile field must be provided",
  );

module.exports = {
  updateProfileSchema,
};

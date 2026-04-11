const { z } = require("zod");

const registerSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  password: z.string().min(8).max(72),
  preferredLanguage: z.enum(["vi", "en"]).default("vi"),
  dailyGoalMinutes: z.coerce.number().int().min(5).max(120).default(15),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(72),
});

module.exports = {
  loginSchema,
  registerSchema,
};

const path = require("path");
const { createRequire } = require("module");

const backendRequire = createRequire(path.resolve(__dirname, "../backend/package.json"));
const dotenv = backendRequire("dotenv");
const bcrypt = backendRequire("bcryptjs");
const { PrismaClient } = backendRequire("@prisma/client");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  await prisma.user.upsert({
    where: { email: "demo@quackup.app" },
    update: {
      displayName: "Harvey Nguyen",
      dailyGoalMinutes: 15,
      preferredLanguage: "vi",
    },
    create: {
      email: "demo@quackup.app",
      passwordHash,
      displayName: "Harvey Nguyen",
      dailyGoalMinutes: 15,
      preferredLanguage: "vi",
      role: "LEARNER",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

const app = require("./app");
const env = require("./config/env");
const { prisma } = require("./lib/prisma");

const server = app.listen(env.PORT, () => {
  console.log(`QuackUp API listening on port ${env.PORT}`);
});

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

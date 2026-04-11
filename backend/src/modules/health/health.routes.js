const express = require("express");
const { prisma } = require("../../lib/prisma");

const router = express.Router();

router.get("/", async (request, response) => {
  let database = "unavailable";

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = "connected";
  } catch (error) {
    database = "unavailable";
  }

  response.status(200).json({
    status: "ok",
    database,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;

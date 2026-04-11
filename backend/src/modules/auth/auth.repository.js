const { prisma } = require("../../lib/prisma");

async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
  });
}

async function createUser(data) {
  return prisma.user.create({
    data,
  });
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};

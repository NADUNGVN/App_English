const { prisma } = require("../../lib/prisma");

async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
  });
}

async function updateUserProfile(id, data) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

module.exports = {
  findUserById,
  updateUserProfile,
};

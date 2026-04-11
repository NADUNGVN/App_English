const { HttpError } = require("../../lib/httpError");
const { toUserResponse } = require("./user.presenter");
const userRepository = require("./user.repository");

async function updateProfile(userId, input) {
  const existingUser = await userRepository.findUserById(userId);

  if (!existingUser) {
    throw new HttpError(404, "User not found");
  }

  const nextUser = await userRepository.updateUserProfile(userId, input);

  return {
    user: toUserResponse(nextUser),
  };
}

module.exports = {
  updateProfile,
};

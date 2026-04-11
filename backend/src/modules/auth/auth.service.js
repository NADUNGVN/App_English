const bcrypt = require("bcryptjs");
const { HttpError } = require("../../lib/httpError");
const { signAccessToken } = require("../../lib/jwt");
const { toUserResponse } = require("../users/user.presenter");
const authRepository = require("./auth.repository");

async function register(input) {
  const email = input.email.toLowerCase();
  const existingUser = await authRepository.findUserByEmail(email);

  if (existingUser) {
    throw new HttpError(409, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await authRepository.createUser({
    email,
    passwordHash,
    displayName: input.displayName.trim(),
    preferredLanguage: input.preferredLanguage,
    dailyGoalMinutes: input.dailyGoalMinutes,
  });

  return {
    accessToken: signAccessToken({ sub: user.id, role: user.role }),
    user: toUserResponse(user),
  };
}

async function login(input) {
  const email = input.email.toLowerCase();
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new HttpError(401, "Invalid email or password");
  }

  return {
    accessToken: signAccessToken({ sub: user.id, role: user.role }),
    user: toUserResponse(user),
  };
}

async function getMe(userId) {
  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return {
    user: toUserResponse(user),
  };
}

module.exports = {
  getMe,
  login,
  register,
};

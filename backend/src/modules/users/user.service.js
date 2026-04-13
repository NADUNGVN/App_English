const { HttpError } = require("../../lib/httpError");
const { toUserResponse } = require("./user.presenter");
const userRepository = require("./user.repository");

function deriveDisplayName(authUser) {
  const metadata = authUser.user_metadata ?? {};

  return (
    metadata.display_name?.trim() ||
    metadata.full_name?.trim() ||
    metadata.name?.trim() ||
    authUser.email?.split("@")[0] ||
    "Learner"
  );
}

function deriveAvatarUrl(authUser) {
  const metadata = authUser.user_metadata ?? {};

  return metadata.avatar_url ?? metadata.picture ?? null;
}

function buildProfileRecord(authUser, existingProfile, overrides = {}) {
  return {
    id: authUser.id,
    email: authUser.email?.toLowerCase() ?? existingProfile?.email ?? null,
    display_name:
      overrides.displayName ??
      existingProfile?.display_name ??
      deriveDisplayName(authUser),
    preferred_language:
      overrides.preferredLanguage ??
      existingProfile?.preferred_language ??
      "vi",
    daily_goal_minutes:
      overrides.dailyGoalMinutes ??
      existingProfile?.daily_goal_minutes ??
      15,
    avatar_url:
      overrides.avatarUrl ??
      existingProfile?.avatar_url ??
      deriveAvatarUrl(authUser),
    role: existingProfile?.role ?? "LEARNER",
  };
}

async function syncProfile(authUser, overrides = {}) {
  if (!authUser?.id) {
    throw new HttpError(400, "Auth user is required");
  }

  const existingProfile = await userRepository.findProfileById(authUser.id);
  const profile = await userRepository.upsertProfile(
    buildProfileRecord(authUser, existingProfile, overrides),
  );

  return profile;
}

async function getProfile(userId) {
  const existingProfile = await userRepository.findProfileById(userId);

  if (!existingProfile) {
    throw new HttpError(404, "User profile not found");
  }

  return {
    user: toUserResponse(existingProfile),
  };
}

async function updateProfile(userId, input) {
  const existingProfile = await userRepository.findProfileById(userId);

  if (!existingProfile) {
    throw new HttpError(404, "User profile not found");
  }

  const nextUser = await userRepository.updateProfile(userId, {
    ...(input.displayName ? { display_name: input.displayName } : {}),
    ...(input.preferredLanguage ? { preferred_language: input.preferredLanguage } : {}),
    ...(input.dailyGoalMinutes ? { daily_goal_minutes: input.dailyGoalMinutes } : {}),
    ...(input.avatarUrl !== undefined ? { avatar_url: input.avatarUrl } : {}),
  });

  return {
    user: toUserResponse(nextUser),
  };
}

module.exports = {
  getProfile,
  syncProfile,
  updateProfile,
};

import { HttpError } from "../../lib/httpError";
import { toUserResponse } from "./user.presenter";
import {
  findProfileById,
  updateProfileRecord,
  upsertProfile,
} from "./user.repository";

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

function buildProfileRecord(authUser, existingProfile, overrides: any = {}) {
  const hasAvatarOverride = Object.prototype.hasOwnProperty.call(overrides, "avatarUrl");
  const googleAvatarUrl = deriveAvatarUrl(authUser);

  return {
    id: authUser.id,
    email: authUser.email?.toLowerCase() ?? existingProfile?.email ?? null,
    display_name:
      overrides.displayName ??
      existingProfile?.display_name ??
      deriveDisplayName(authUser),
    preferred_language:
      overrides.preferredLanguage ?? existingProfile?.preferred_language ?? "vi",
    daily_goal_minutes:
      overrides.dailyGoalMinutes ?? existingProfile?.daily_goal_minutes ?? 15,
    avatar_url: hasAvatarOverride
      ? overrides.avatarUrl
      : googleAvatarUrl ?? existingProfile?.avatar_url ?? null,
    role: existingProfile?.role ?? "LEARNER",
  };
}

export async function syncProfile(authUser, overrides: any = {}) {
  if (!authUser?.id) {
    throw new HttpError(400, "Auth user is required");
  }

  const existingProfile = await findProfileById(authUser.id);
  const profile = await upsertProfile(buildProfileRecord(authUser, existingProfile, overrides));

  return profile;
}

export async function updateProfile(userId: string, input) {
  const existingProfile = await findProfileById(userId);

  if (!existingProfile) {
    throw new HttpError(404, "User profile not found");
  }

  const nextUser = await updateProfileRecord(userId, {
    ...(input.displayName ? { display_name: input.displayName } : {}),
    ...(input.preferredLanguage ? { preferred_language: input.preferredLanguage } : {}),
    ...(input.dailyGoalMinutes ? { daily_goal_minutes: input.dailyGoalMinutes } : {}),
    ...(input.avatarUrl !== undefined ? { avatar_url: input.avatarUrl } : {}),
  });

  return {
    user: toUserResponse(nextUser),
  };
}

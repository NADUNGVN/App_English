function toUserResponse(user) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name ?? user.displayName,
    preferredLanguage: user.preferred_language ?? user.preferredLanguage,
    dailyGoalMinutes: user.daily_goal_minutes ?? user.dailyGoalMinutes,
    avatarUrl: user.avatar_url ?? user.avatarUrl,
    role: user.role,
    createdAt: user.created_at ?? user.createdAt,
    updatedAt: user.updated_at ?? user.updatedAt,
  };
}

module.exports = { toUserResponse };

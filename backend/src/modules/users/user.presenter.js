function toUserResponse(user) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    preferredLanguage: user.preferredLanguage,
    dailyGoalMinutes: user.dailyGoalMinutes,
    avatarUrl: user.avatarUrl,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

module.exports = { toUserResponse };

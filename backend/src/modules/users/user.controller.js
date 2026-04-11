const userService = require("./user.service");
const { updateProfileSchema } = require("./user.schemas");

async function updateProfile(request, response, next) {
  try {
    const payload = updateProfileSchema.parse(request.body);
    const result = await userService.updateProfile(request.auth.userId, payload);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  updateProfile,
};

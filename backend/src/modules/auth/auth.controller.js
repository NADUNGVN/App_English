const authService = require("./auth.service");
const { loginSchema, registerSchema } = require("./auth.schemas");

async function register(request, response, next) {
  try {
    const payload = registerSchema.parse(request.body);
    const result = await authService.register(payload);
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function login(request, response, next) {
  try {
    const payload = loginSchema.parse(request.body);
    const result = await authService.login(payload);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function me(request, response, next) {
  try {
    const result = await authService.getMe(request.auth.userId);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  me,
  register,
};

const { ZodError } = require("zod");
const { HttpError } = require("../lib/httpError");

function errorHandler(error, request, response, next) {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: "Validation failed",
      details: error.flatten(),
    });
    return;
  }

  if (error instanceof HttpError) {
    response.status(error.status).json({
      error: error.message,
      details: error.details,
    });
    return;
  }

  console.error(error);

  response.status(500).json({
    error: "Internal server error",
  });
}

module.exports = { errorHandler };

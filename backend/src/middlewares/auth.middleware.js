const { HttpError } = require("../lib/httpError");
const { verifyAccessToken } = require("../lib/jwt");

function requireAuth(request, response, next) {
  try {
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new HttpError(401, "Authentication required");
    }

    const token = authorization.replace("Bearer ", "").trim();
    const decoded = verifyAccessToken(token);

    request.auth = {
      userId: decoded.sub,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      next(new HttpError(401, "Invalid or expired token"));
      return;
    }

    next(error);
  }
}

module.exports = { requireAuth };

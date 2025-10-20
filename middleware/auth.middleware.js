const jwt = require("jsonwebtoken");
const ApiError = require("../library/ApiError");
const config = require("../config");

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return next(
      new ApiError(401, "A valid Bearer token is required for authentication")
    );
  }

  token = token.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, config.appKey);
    req.user = decoded;
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token has expired"));
    }
    return next(new ApiError(401, "Unauthorized: Invalid token"));
  }

  return next();
};

module.exports = verifyToken;

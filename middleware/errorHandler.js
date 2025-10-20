const { errorResponse } = require("../library/responseHelper");
const ApiError = require("../library/ApiError");

const globalErrorHandler = (err, req, res, next) => {
  console.error(err);
  let statusCode = 500;
  let message = "Internal Server Error!";
  let errors = null;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "ValidationError") {
    statusCode = 422;
    message = "Validation Failed";
    errors = err.data;
  } else if (err.name === "DBError") {
    statusCode = 500;
    message = "Database operation failed.";
  }

  if (res.headersSent) {
    return next(err);
  }
  return errorResponse(res, message, statusCode, errors);
};

module.exports = globalErrorHandler;

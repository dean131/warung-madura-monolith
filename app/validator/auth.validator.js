const { check, validationResult } = require("express-validator");
const { errorResponse } = require("../../library/responseHelper");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error_data = errors.array().map((error) => ({
      item_name: error.param,
      message: error.msg,
    }));
    return errorResponse(res, "Validation failed", 422, error_data);
  }
  next();
};

const register = [
  check("username")
    .not()
    .isEmpty()
    .withMessage("username cannot be empty!")
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters"),
  check("email")
    .not()
    .isEmpty()
    .withMessage("email cannot be empty!")
    .isEmail()
    .withMessage("Must be a valid email address"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("password cannot be empty!")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
];

const login = [
  check("loginIdentifier")
    .not()
    .isEmpty()
    .withMessage("loginIdentifier (username or email) cannot be empty!"),
  check("password").not().isEmpty().withMessage("password cannot be empty!"),
  handleValidationErrors,
];

const refresh = [
  check("refreshToken")
    .not()
    .isEmpty()
    .withMessage("refreshToken cannot be empty!"),
  handleValidationErrors,
];

const logout = [
  check("refreshToken")
    .not()
    .isEmpty()
    .withMessage("refreshToken cannot be empty!"),
  handleValidationErrors,
];

module.exports = {
  register,
  login,
  refresh,
  logout,
};

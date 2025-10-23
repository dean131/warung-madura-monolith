const { check, param, validationResult } = require("express-validator");
const { errorResponse } = require("../../library/responseHelper");
const ApiError = require("../../library/ApiError");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error_data = errors.array().map((error) => ({
      item_name: error.param,
      message: error.msg,
      location: error.location,
    }));
    return errorResponse(res, "Validation failed", 422, error_data);
  }
  next();
};

const setItem = [
  check("product_id")
    .not()
    .isEmpty()
    .withMessage("product_id cannot be empty")
    .isUUID()
    .withMessage("product_id must be a valid UUID"),
  check("quantity")
    .not()
    .isEmpty()
    .withMessage("quantity cannot be empty")
    .isInt({ gt: 0 })
    .withMessage("quantity must be a positive integer")
    .toInt(),
  handleValidationErrors,
];

const updateItem = [
  check("quantity")
    .not()
    .isEmpty()
    .withMessage("quantity cannot be empty")
    .isInt({ min: 0 })
    .withMessage("quantity must be a non-negative integer")
    .toInt(),
  param("productId")
    .isUUID()
    .withMessage("productId parameter must be a valid UUID"),
  handleValidationErrors,
];

const itemParam = [
  param("productId")
    .isUUID()
    .withMessage("productId parameter must be a valid UUID"),
  handleValidationErrors,
];

module.exports = {
  setItem,
  updateItem,
  itemParam,
};

const { check, query, validationResult } = require("express-validator"); 
const { errorResponse } = require("../../library/responseHelper");

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

const create = [
  check("items")
    .not()
    .isEmpty()
    .withMessage("items array cannot be empty")
    .isArray({ min: 1 })
    .withMessage("items must be an array with at least one item"),

  check("items.*.product_id") 
    .not()
    .isEmpty()
    .withMessage("product_id cannot be empty for an item")
    .isUUID()
    .withMessage("product_id must be a valid UUID"),

  check("items.*.quantity")
    .not()
    .isEmpty()
    .withMessage("quantity cannot be empty for an item")
    .isInt({ gt: 0 })
    .withMessage("quantity must be a positive integer")
    .toInt(), 

  handleValidationErrors,
];

const list = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be an integer between 1 and 100")
    .toInt(),
  query("after")
    .optional()
    .isString()
    .withMessage("after cursor must be a string")
    .matches(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/)
    .withMessage("after cursor must be base64 encoded"),
  query("before")
    .optional()
    .isString()
    .withMessage("before cursor must be a string")
    .matches(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/)
    .withMessage("before cursor must be base64 encoded"),
  (req, res, next) => {
    if (req.query.after && req.query.before) {
      return next(
        new ApiError(
          400,
          'Cannot use both "after" and "before" cursors simultaneously'
        )
      );
    }
    next();
  },
  handleValidationErrors, 
];

module.exports = {
  create,
  list,
};

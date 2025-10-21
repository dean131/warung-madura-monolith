// app/validator/product.validator.js
const { check, query, validationResult } = require('express-validator');
const { errorResponse } = require('../../library/responseHelper');

// Centralized error handling
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error_data = errors.array().map((error) => ({
      item_name: error.param,
      message: error.msg,
      location: error.location, // Include location (body, query, params)
    }));
    return errorResponse(res, 'Validation failed', 422, error_data);
  }
  next();
};

// Validation rules for creating a product
const create = [
  check('name')
    .not().isEmpty().withMessage('name cannot be empty')
    .isString().withMessage('name must be a string')
    .isLength({ min: 1, max: 255 }).withMessage('name must be between 1 and 255 characters'),
  check('price')
    .not().isEmpty().withMessage('price cannot be empty')
    .isDecimal({ decimal_digits: '0,2' }).withMessage('price must be a valid decimal number with up to 2 decimal places')
    .toFloat() // Convert to float after validation
    .isFloat({ min: 0 }).withMessage('price cannot be negative'),
  check('stock_quantity')
    .not().isEmpty().withMessage('stock_quantity cannot be empty')
    .isInt({ min: 0 }).withMessage('stock_quantity must be a non-negative integer')
    .toInt(), // Convert to integer
  check('category_id')
    .not().isEmpty().withMessage('category_id cannot be empty')
    .isUUID().withMessage('category_id must be a valid UUID'),
  handleValidationErrors,
];

// Validation rules for updating a product
const update = [
  check('name')
    .optional()
    .isString().withMessage('name must be a string')
    .isLength({ min: 1, max: 255 }).withMessage('name must be between 1 and 255 characters'),
  check('price')
    .optional()
    .isDecimal({ decimal_digits: '0,2' }).withMessage('price must be a valid decimal number with up to 2 decimal places')
    .toFloat()
    .isFloat({ min: 0 }).withMessage('price cannot be negative'),
  check('stock_quantity')
    .optional()
    .isInt({ min: 0 }).withMessage('stock_quantity must be a non-negative integer')
    .toInt(),
  check('category_id')
    .optional()
    .isUUID().withMessage('category_id must be a valid UUID'),
  handleValidationErrors,
];

// Validation rules for pagination query parameters
const list = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('limit must be an integer between 1 and 100')
        .toInt(),
    query('after')
        .optional()
        .isString().withMessage('after cursor must be a string')
        .isBase64().withMessage('after cursor must be base64 encoded'),
    query('before')
        .optional()
        .isString().withMessage('before cursor must be a string')
        .isBase64().withMessage('before cursor must be base64 encoded'),
    // Ensure 'after' and 'before' are not used together
    (req, res, next) => {
        if (req.query.after && req.query.before) {
            return errorResponse(res, 'Cannot use both "after" and "before" cursors simultaneously', 400);
        }
        next();
    },
    handleValidationErrors,
];


module.exports = {
  create,
  update,
  list,
};
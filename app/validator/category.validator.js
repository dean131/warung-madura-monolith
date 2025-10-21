// app/validator/category.validator.js
const { check, validationResult } = require('express-validator');
const { errorResponse } = require('../../library/responseHelper');

// Centralized error handling for validators
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error_data = errors.array().map((error) => ({
      item_name: error.param,
      message: error.msg,
    }));
    return errorResponse(res, 'Validation failed', 422, error_data);
  }
  next();
};

// Validation rules for creating a category
const create = [
  check('name')
    .not().isEmpty().withMessage('name cannot be empty!')
    .isString().withMessage('name must be a string')
    .isLength({ min: 1, max: 255 }).withMessage('name must be between 1 and 255 characters'),
  handleValidationErrors,
];

// Validation rules for updating a category
const update = [
  check('name')
    .optional() // Name is optional on update, but if provided, validate it
    .isString().withMessage('name must be a string')
    .isLength({ min: 1, max: 255 }).withMessage('name must be between 1 and 255 characters'),
  handleValidationErrors,
];

module.exports = {
  create,
  update,
};
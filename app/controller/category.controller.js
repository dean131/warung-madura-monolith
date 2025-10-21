const categoryService = require('../service/category.service');
const { successResponse } = require('../../library/responseHelper');

const create = async (req, res, next) => {
  try {
    const newCategory = await categoryService.createCategory(req.body);
    return successResponse(res, 'Category created successfully', newCategory, 201); 
  } catch (error) {
    next(error);
  }
};

const index = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    return successResponse(res, 'Categories retrieved successfully', categories);
  } catch (error) {
    next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    return successResponse(res, 'Category retrieved successfully', category);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedCategory = await categoryService.updateCategory(id, req.body);
    return successResponse(res, 'Category updated successfully', updatedCategory);
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    return successResponse(res, 'Category deleted successfully'); 
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  index,
  show,
  update,
  destroy,
};
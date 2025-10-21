const categoryRepository = require("../repository/category.repository");
const ApiError = require("../../library/ApiError");

const createCategory = async (categoryData) => {
  const { name } = categoryData;

  // Check if name already exists (case-sensitive)
  const existingCategory = await categoryRepository.findByName(name);
  if (existingCategory) {
    throw new ApiError(409, `Category with name "${name}" already exists.`); // Conflict
  }

  return categoryRepository.create({ name });
};

const getAllCategories = async () => {
  return categoryRepository.findAll();
};

const getCategoryById = async (id) => {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found.");
  }
  return category;
};

const updateCategory = async (id, updateData) => {
  const { name } = updateData;

  const categoryToUpdate = await categoryRepository.findById(id);
  if (!categoryToUpdate) {
    throw new ApiError(404, "Category not found.");
  }

  if (name && name !== categoryToUpdate.name) {
    const existingCategory = await categoryRepository.findByName(name);
    if (existingCategory) {
      throw new ApiError(409, `Category with name "${name}" already exists.`);
    }
  }

  const updatedCount = await categoryRepository.update(id, { name });
  return categoryRepository.findById(id);
};

const deleteCategory = async (id) => {
  const deletedCount = await categoryRepository.softDelete(id);
  if (deletedCount === 0) {
    throw new ApiError(404, "Category not found.");
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

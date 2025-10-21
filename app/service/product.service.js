const productRepository = require('../repository/product.repository');
const categoryRepository = require('../repository/category.repository'); 
const ApiError = require('../../library/ApiError');

const createProduct = async (productData) => {
  const { category_id } = productData;

  const category = await categoryRepository.findById(category_id);
  if (!category) {
    throw new ApiError(400, `Category with ID "${category_id}" not found.`); 
  }

  if (productData.price < 0 || productData.stock_quantity < 0) {
      throw new ApiError(400, 'Price and stock quantity cannot be negative.');
  }

  return productRepository.create(productData);
};

const getAllProductsPaginated = async (paginationParams) => {
  return productRepository.findAllPaginated(paginationParams);
};

const getProductById = async (id) => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }
  return product;
};

const updateProduct = async (id, updateData) => {
  const { category_id } = updateData;

  const productToUpdate = await productRepository.findById(id);
  if (!productToUpdate) {
    throw new ApiError(404, 'Product not found.');
  }

  if (category_id && category_id !== productToUpdate.category_id) {
    const category = await categoryRepository.findById(category_id);
    if (!category) {
      throw new ApiError(400, `Category with ID "${category_id}" not found.`);
    }
  }

  if (updateData.price !== undefined && updateData.price < 0) {
      throw new ApiError(400, 'Price cannot be negative.');
  }
   if (updateData.stock_quantity !== undefined && updateData.stock_quantity < 0) {
      throw new ApiError(400, 'Stock quantity cannot be negative.');
  }

  await productRepository.update(id, updateData);
  return productRepository.findById(id);
};

const deleteProduct = async (id) => {
  const deletedCount = await productRepository.softDelete(id);
  if (deletedCount === 0) {
    throw new ApiError(404, 'Product not found.');
  }
};

module.exports = {
  createProduct,
  getAllProductsPaginated,
  getProductById,
  updateProduct,
  deleteProduct,
};
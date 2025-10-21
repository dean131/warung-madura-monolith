const productService = require('../service/product.service');
const { successResponse, cursorPaginatedResponse } = require('../../library/responseHelper');
const url = require('url'); 

const create = async (req, res, next) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    return successResponse(res, 'Product created successfully', newProduct, 201);
  } catch (error) {
    next(error);
  }
};

const index = async (req, res, next) => {
  try {
    const { limit = 10, after, before } = req.query;

    const result = await productService.getAllProductsPaginated({
        limit,
        afterCursor: after,
        beforeCursor: before,
    });

    const baseUrl = url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl.split('?')[0] 
    });

    result.pagingInfo.nextLink = result.pagingInfo.nextCursor
      ? `${baseUrl}?limit=${limit}&after=${result.pagingInfo.nextCursor}`
      : null;
    result.pagingInfo.prevLink = result.pagingInfo.prevCursor
      ? `${baseUrl}?limit=${limit}&before=${result.pagingInfo.prevCursor}`
      : null;

    return cursorPaginatedResponse(res, 'Products retrieved successfully', result.data, result.pagingInfo);
  } catch (error) {
    next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    return successResponse(res, 'Product retrieved successfully', product);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedProduct = await productService.updateProduct(id, req.body);
    return successResponse(res, 'Product updated successfully', updatedProduct);
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);
    return successResponse(res, 'Product deleted successfully');
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
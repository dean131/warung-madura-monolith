const cartService = require("../service/cart.service");
const { successResponse } = require("../../library/responseHelper");

const addItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    await cartService.addItemToCart(userId, product_id, quantity);

    const cart = await cartService.getCart(userId);
    return successResponse(res, "Item added/updated in cart", cart);
  } catch (error) {
    next(error);
  }
};

const viewCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.getCart(userId);
    return successResponse(res, "Cart retrieved successfully", cart);
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    await cartService.updateItemQuantity(userId, productId, quantity);

    const cart = await cartService.getCart(userId);
    return successResponse(res, "Cart item quantity updated", cart);
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await cartService.removeItemFromCart(userId, productId);

    const cart = await cartService.getCart(userId);
    return successResponse(res, "Item removed from cart", cart);
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await cartService.clearCart(userId);
    return successResponse(res, "Cart cleared successfully", {
      items: [],
      totalAmount: 0,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addItem,
  viewCart,
  updateItem,
  removeItem,
  clearCart,
};

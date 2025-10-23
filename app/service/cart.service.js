const cartRepository = require("../repository/cart.repository");
const productRepository = require("../repository/product.repository");
const ApiError = require("../../library/ApiError");

const addItemToCart = async (userId, productId, quantity) => {
  if (quantity <= 0) {
    throw new ApiError(400, "Quantity must be positive.");
  }

  const product = await productRepository.findById(productId);
  if (!product) {
    throw new ApiError(404, `Product with ID ${productId} not found.`);
  }

  if (product.stock_quantity < quantity) {
    throw new ApiError(
      400,
      `Requested quantity (${quantity}) exceeds available stock (${product.stock_quantity}) for ${product.name}.`
    );
  }

  await cartRepository.setItemQuantity(userId, productId, quantity);

  return { productId, quantity };
};

const getCart = async (userId) => {
  const cartItems = await cartRepository.getAllItems(userId);
  const productIds = Object.keys(cartItems);

  if (productIds.length === 0) {
    return { items: [], totalAmount: 0 };
  }

  const products = await productRepository.findByIds(productIds);

  const productMap = products.reduce((map, product) => {
    map[product.id] = product;
    return map;
  }, {});

  let totalAmount = 0;
  const detailedItems = [];

  for (const productId in cartItems) {
    const product = productMap[productId];
    const quantity = parseInt(cartItems[productId], 10);
    if (isNaN(quantity)) {
      console.warn(
        `Invalid quantity found in cart for user ${userId}, product ${productId}. Skipping.`
      );
      await cartRepository.removeItem(userId, productId);
      continue;
    }

    if (product) {
      const price = parseFloat(product.price);
      if (isNaN(price)) {
        console.error(
          `Invalid price found for product ID ${productId}. Skipping item.`
        );
        continue;
      }
      const lineTotal = price * quantity;

      detailedItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        lineTotal: lineTotal,
      });
      totalAmount += lineTotal;
    } else {
      await cartRepository.removeItem(userId, productId);
      console.warn(
        `Product ID ${productId} found in cart for user ${userId} but not in DB (likely deleted). Removed from cart.`
      );
    }
  }
  return { items: detailedItems, totalAmount };
};

const updateItemQuantity = async (userId, productId, quantity) => {
  if (quantity <= 0) {
    return removeItemFromCart(userId, productId);
  }

  const product = await productRepository.findById(productId);
  if (!product) {
    throw new ApiError(404, `Product with ID ${productId} not found.`);
  }

  await cartRepository.setItemQuantity(userId, productId, quantity);
  return { productId, quantity };
};

const removeItemFromCart = async (userId, productId) => {
  const removedCount = await cartRepository.removeItem(userId, productId);
  if (removedCount === 0) {
    throw new ApiError(404, `Product ID ${productId} not found in cart.`);
  }
};

const clearCart = async (userId) => {
  await cartRepository.deleteCart(userId);
};

module.exports = {
  addItemToCart,
  getCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
};

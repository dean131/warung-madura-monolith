const redisClient = require("../../config/redis");

const CART_PREFIX = "cart:";
const getCartKey = (userId) => `${CART_PREFIX}${userId}`;

const setItemQuantity = async (userId, productId, quantity) => {
  if (quantity <= 0) {
    return removeItem(userId, productId);
  }
  const cartKey = getCartKey(userId);
  await redisClient.hSet(cartKey, productId, String(quantity));
};

const getItemQuantity = async (userId, productId) => {
  const cartKey = getCartKey(userId);
  const quantityStr = await redisClient.hGet(cartKey, productId);
  return quantityStr ? parseInt(quantityStr, 10) : null;
};

const removeItem = async (userId, productId) => {
  const cartKey = getCartKey(userId);
  return redisClient.hDel(cartKey, productId);
};

const getAllItems = async (userId) => {
  const cartKey = getCartKey(userId);
  return redisClient.hGetAll(cartKey);
};

const deleteCart = async (userId) => {
  const cartKey = getCartKey(userId);
  return redisClient.del(cartKey);
};

module.exports = {
  setItemQuantity,
  getItemQuantity,
  removeItem,
  getAllItems,
  deleteCart,
};

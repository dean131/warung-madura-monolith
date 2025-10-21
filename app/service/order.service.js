const { transaction } = require("objection");
const knex = require("../../config/database");
const orderRepository = require("../repository/order.repository");
const productRepository = require("../repository/product.repository");
const ApiError = require("../../library/ApiError");

const placeOrder = async (userId, items) => {
  if (!items || items.length === 0) {
    throw new ApiError(400, "Order must contain at least one item.");
  }

  let newOrder;
  try {
    newOrder = await transaction(knex, async (trx) => {
      const productIds = items.map((item) => item.product_id);
      console.log(productIds);
      const products = await productRepository.findByIds(productIds);

      console.log(products);

      const productMap = products.reduce((map, product) => {
        map[product.id] = product;
        return map;
      }, {});

      console.log(productMap);

      let totalAmount = 0;
      const itemsDataForInsert = [];

      for (const item of items) {
        const product = productMap[item.product_id];

        if (!product) {
          throw new ApiError(
            400,
            `Product with ID ${item.product_id} not found.`
          );
        }

        if (item.quantity <= 0) {
          throw new ApiError(
            400,
            `Quantity for product "${product.name}" must be positive.`
          );
        }

        if (product.stock_quantity < item.quantity) {
          throw new ApiError(
            400,
            `Insufficient stock for product "${product.name}". Available: ${product.stock_quantity}, Requested: ${item.quantity}.`
          );
        }

        itemsDataForInsert.push({
          product_id: product.id,
          quantity: item.quantity,
          price_per_item: Number(product.price),
        });

        totalAmount += product.price * item.quantity;
      }

      const orderData = { user_id: userId, total_amount: totalAmount };
      const createdOrder = await orderRepository.createOrderWithItems(
        orderData,
        itemsDataForInsert,
        trx
      );

      for (const item of items) {
        const updatedRows = await productRepository.updateStock(
          item.product_id,
          -item.quantity
        );
        if (updatedRows !== 1) {
          throw new ApiError(
            409,
            `Failed to update stock for product ID ${item.product_id}, possibly due to concurrent modification.`
          );
        }
      }

      await orderRepository.updateOrderStatus(
        createdOrder.id,
        "COMPLETED",
        trx
      );

      return createdOrder;
    });

    const finalOrder = await orderRepository.findOrderById(newOrder.id, true); // Include items
    return finalOrder;
  } catch (error) {
    console.error("Order placement transaction failed:", error);
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(
        500,
        "Failed to place order due to an internal error."
      );
    }
  }
};

const getOrderDetails = async (orderId, userId) => {
  const order = await orderRepository.findOrderById(orderId, true);

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  if (order.user_id !== userId) {
    throw new ApiError(
      403,
      "Forbidden: You do not have permission to view this order."
    );
  }

  return order;
};

const getUserOrders = async (userId, paginationParams) => {
  const includeItems = true;
  return orderRepository.findAllByUserIdPaginated(userId, {
    ...paginationParams,
    includeItems,
  });
};

module.exports = {
  placeOrder,
  getOrderDetails,
  getUserOrders,
};

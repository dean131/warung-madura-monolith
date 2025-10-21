const orderService = require("../service/order.service");
const {
  successResponse,
  cursorPaginatedResponse,
} = require("../../library/responseHelper");
const url = require("url");

const index = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 10, after, before } = req.query;

    const result = await orderService.getUserOrders(userId, {
      limit,
      afterCursor: after,
      beforeCursor: before,
    });

    const baseUrl = url.format({
      protocol: req.protocol,
      host: req.get("host"),
      pathname: req.originalUrl.split("?")[0],
    });

    result.pagingInfo.nextLink = result.pagingInfo.nextCursor
      ? `${baseUrl}?limit=${limit}&after=${result.pagingInfo.nextCursor}`
      : null;
    result.pagingInfo.prevLink = result.pagingInfo.prevCursor
      ? `${baseUrl}?limit=${limit}&before=${result.pagingInfo.prevCursor}`
      : null;

    return cursorPaginatedResponse(
      res,
      "Orders retrieved successfully",
      result.data,
      result.pagingInfo
    );
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    const newOrder = await orderService.placeOrder(userId, items);

    return successResponse(res, "Order placed successfully", newOrder, 201);
  } catch (error) {
    next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const { id: orderId } = req.params;
    const order = await orderService.getOrderDetails(orderId, userId);

    return successResponse(res, "Order details retrieved successfully", order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  show,
  index,
};

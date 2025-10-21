const Order = require("../model/order.model");
const OrderItem = require("../model/orderItem.model");

const createOrderWithItems = async (orderData, itemsData, trx) => {
  const newOrder = await Order.query(trx)
    .insert({
      user_id: orderData.user_id,
      total_amount: orderData.total_amount,
      status: "PENDING",
    })
    .returning("*");

  const itemsToInsert = itemsData.map((item) => ({
    ...item,
    order_id: newOrder.id,
  }));

  await OrderItem.query(trx).insert(itemsToInsert);

  return newOrder;
};

const updateOrderStatus = async (orderId, status, trx = null) => {
  const query = Order.query().findById(orderId).patch({ status });
  if (trx) {
    return query.transacting(trx);
  }
  return query;
};

const findOrderById = async (id, includeItems = false) => {
  let query = Order.query().findById(id);
  if (includeItems) {
    query = query.withGraphFetched("items.product");
  }
  return query;
};

const findAllByUserIdPaginated = async (
  userId,
  { limit = 10, afterCursor, beforeCursor, includeItems = false }
) => {
  const requestedLimit = Math.max(1, Math.min(limit || 10, 100));
  const actualLimit = requestedLimit + 1;
  let query = Order.query().where("user_id", userId);
  let isFetchingBackwards = false;

  if (includeItems) {
    query = query.withGraphFetched("items.product");
  }

  const decodeCursor = (cursor) => {
    try {
      return JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
    } catch {
      throw new ApiError(400, "Invalid cursor format");
    }
  };

  const encodeCursor = (obj) =>
    Buffer.from(JSON.stringify(obj), "utf8").toString("base64");

  if (afterCursor) {
    const { createdAt, id } = decodeCursor(afterCursor);
    query = query
      .where((builder) => {
        builder
          .where("created_at", ">", createdAt)
          .orWhere((q) =>
            q.where("created_at", "=", createdAt).where("id", ">", id)
          );
      })
      .orderBy("created_at", "asc")
      .orderBy("id", "asc");
  } else if (beforeCursor) {
    isFetchingBackwards = true;
    const { createdAt, id } = decodeCursor(beforeCursor);
    query = query
      .where((builder) => {
        builder
          .where("created_at", "<", createdAt)
          .orWhere((q) =>
            q.where("created_at", "=", createdAt).where("id", "<", id)
          );
      })
      .orderBy("created_at", "desc")
      .orderBy("id", "desc");
  } else {
    query = query.orderBy("created_at", "asc").orderBy("id", "asc");
  }

  query = query.limit(actualLimit);

  let orders = await query;

  const hasMore = orders.length === actualLimit;

  let hasNextPage = false;
  let hasPrevPage = false;

  if (isFetchingBackwards) {
    hasPrevPage = hasMore;
    if (hasPrevPage) orders.pop();
    orders.reverse();
    hasNextPage = !!beforeCursor;
  } else {
    hasNextPage = hasMore;
    if (hasNextPage) orders.pop();
    hasPrevPage = !!afterCursor;
  }

  const nextCursorObject = orders.at(-1);
  const prevCursorObject = orders[0];

  const nextCursor =
    nextCursorObject &&
    encodeCursor({
      createdAt: nextCursorObject.created_at,
      id: nextCursorObject.id,
    });

  const prevCursor =
    prevCursorObject &&
    encodeCursor({
      createdAt: prevCursorObject.created_at,
      id: prevCursorObject.id,
    });

  return {
    data: orders,
    pagingInfo: {
      hasNextPage,
      hasPrevPage,
      nextCursor: hasNextPage ? nextCursor : null,
      prevCursor: hasPrevPage ? prevCursor : null,
    },
  };
};

module.exports = {
  createOrderWithItems,
  updateOrderStatus,
  findOrderById,
  findAllByUserIdPaginated,
};

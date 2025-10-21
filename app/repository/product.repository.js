const Product = require("../model/product.model");

/**
 * Cursor-based pagination for Products
 * Compatible with UUID primary keys and created_at timestamps
 */
const findAllPaginated = async ({ limit = 10, afterCursor, beforeCursor }) => {
  const actualLimit = limit + 1;
  let query = Product.query().withGraphFetched("category");
  let isFetchingBackwards = false;

  // Decode composite cursor helper
  const decodeCursor = (cursor) => {
    try {
      return JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
    } catch {
      throw new Error("Invalid cursor format");
    }
  };

  // Encode composite cursor helper
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
      .orderBy("id", "asc")
      .limit(actualLimit);
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
      .orderBy("id", "desc")
      .limit(actualLimit);
  } else {
    // initial page
    query = query
      .orderBy("created_at", "asc")
      .orderBy("id", "asc")
      .limit(actualLimit);
  }

  let products = await query;

  // Determine pagination direction + trimming
  let hasNextPage = false;
  let hasPrevPage = false;

  if (isFetchingBackwards) {
    hasPrevPage = products.length === actualLimit;
    if (hasPrevPage) products.pop(); // drop extra fetched record
    products.reverse(); // restore ascending order
    hasNextPage = !!beforeCursor;
  } else {
    hasNextPage = products.length === actualLimit;
    if (hasNextPage) products.pop();
    hasPrevPage = !!afterCursor;
  }

  // Create cursors from first and last items
  const nextCursor =
    products.at(-1) &&
    encodeCursor({
      createdAt: products.at(-1).created_at,
      id: products.at(-1).id,
    });

  const prevCursor =
    products[0] &&
    encodeCursor({
      createdAt: products[0].created_at,
      id: products[0].id,
    });

  return {
    data: products,
    pagingInfo: {
      hasNextPage,
      hasPrevPage,
      nextCursor: hasNextPage ? nextCursor : null,
      prevCursor: hasPrevPage ? prevCursor : null,
    },
  };
};

const create = async (productData) => {
  return Product.query().insert(productData);
};

const findById = async (id) => {
  return Product.query().findById(id).withGraphFetched("category");
};

const update = async (id, updateData) => {
  return Product.query().findById(id).patch(updateData);
};

const softDelete = async (id) => {
  return Product.softDeleteById(id);
};

const findByIds = async (ids) => {
  return Product.query().whereIn("id", ids).select("*");
};


const updateStock = async (id, quantityChange) => {
  if (quantityChange < 0) {
    return Product.query()
      .findById(id)
      .decrement("stock_quantity", Math.abs(quantityChange))
      .where("stock_quantity", ">=", Math.abs(quantityChange));
  } else {
    return Product.query()
      .findById(id)
      .increment("stock_quantity", quantityChange);
  }
};

module.exports = {
  create,
  findAllPaginated,
  findById,
  findByIds,
  update,
  updateStock,
  softDelete,
};

const { Model } = require("objection");

class OrderItem extends Model {
  static get tableName() {
    return "order_items";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["order_id", "product_id", "quantity", "price_per_item"],
      properties: {
        id: { type: "string", format: "uuid" },
        order_id: { type: "string", format: "uuid" },
        product_id: { type: ["string", "null"], format: "uuid" },
        quantity: { type: "integer", minimum: 1 },
        price_per_item: { type: "number", minimum: 0 },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static relationMappings = {
    order: {
      relation: Model.BelongsToOneRelation,
      modelClass: require("./order.model"),
      join: {
        from: "order_items.order_id",
        to: "orders.id",
      },
    },
    product: {
      relation: Model.BelongsToOneRelation,
      modelClass: require("./product.model"),
      join: {
        from: "order_items.product_id",
        to: "products.id",
      },
    },
  };
}

module.exports = OrderItem;

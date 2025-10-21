const BaseModel = require("./BaseModel");

class Category extends BaseModel {
  static get tableName() {
    return "categories";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],

      properties: {
        id: { type: "string", format: "uuid" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  // static relationMappings = {
  //   products: {
  //     relation: Model.HasManyRelation,
  //     modelClass: require("./product.model"),
  //     join: {
  //       from: "categories.id",
  //       to: "products.category_id",
  //     },
  //   },
  // };
}

module.exports = Category;

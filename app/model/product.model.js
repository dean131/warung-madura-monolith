const { Model } = require('objection');
const BaseModel = require('./BaseModel');

class Product extends BaseModel {
  static get tableName() {
    return 'products';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'price', 'stock_quantity', 'category_id'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        price: { type: 'number', minimum: 0 },
        stock_quantity: { type: 'integer', minimum: 0 },
        category_id: { type: ['string', 'null'], format: 'uuid' }, 
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }

  static relationMappings = {
    category: {
      relation: Model.BelongsToOneRelation,
      modelClass: require('./category.model'),
      join: {
        from: 'products.category_id',
        to: 'categories.id'
      }
    }
  };
}

module.exports = Product;
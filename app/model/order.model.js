const { Model } = require('objection');
const BaseModel = require('./BaseModel');

class Order extends BaseModel {
  static get tableName() {
    return 'orders';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'total_amount'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        user_id: { type: 'string', format: 'uuid' },
        total_amount: { type: 'number' },
        status: { type: 'string', enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: require('./user.model'),
      join: {
        from: 'orders.user_id',
        to: 'users.id',
      },
    },
    items: {
      relation: Model.HasManyRelation,
      modelClass: require('./orderItem.model'),
      join: {
        from: 'orders.id',
        to: 'order_items.order_id',
      },
    },
  };
}

module.exports = Order;
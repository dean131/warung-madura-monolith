const { Model } = require("objection");

class BaseModel extends Model {
  $beforeValidate(jsonSchema, json, opt) {
    if (jsonSchema && jsonSchema.properties) {
      jsonSchema.properties.deleted_at = {
        type: ["string", "null"],
        format: "date-time",
      };
    }
    return jsonSchema;
  }

  static createNotFoundError(queryContext, error) {
    return super.createNotFoundError(queryContext, error);
  }

  static query(...args) {
    return super.query(...args).whereNull(`${this.tableName}.deleted_at`);
  }

  static queryTrashed(...args) {
    return super.query(...args).whereNotNull(`${this.tableName}.deleted_at`);
  }

  static queryWithTrashed(...args) {
    return super.query(...args);
  }

  async $softDelete() {
    return await this.$query().patch({ deleted_at: new Date().toISOString() });
  }

  async $restore() {
    return await this.$query({ skipDeleted: true }).patch({ deleted_at: null });
  }

  static async softDeleteById(id) {
    return await this.query()
      .findById(id)
      .patch({ deleted_at: new Date().toISOString() });
  }

  static async restoreById(id) {
    return await this.queryWithTrashed()
      .findById(id)
      .patch({ deleted_at: null });
  }
}

module.exports = BaseModel;

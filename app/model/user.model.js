const BaseModel = require("./BaseModel");

class User extends BaseModel {
  static get tableName() {
    return "users";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["username", "email", "password_hash"],
      properties: {
        id: { type: "string", format: "uuid" },
        username: { type: "string", minLength: 3, maxLength: 30 },
        email: { type: "string", format: "email" },
        password_hash: { type: "string" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.password_hash;
    return json;
  }
}

module.exports = User;

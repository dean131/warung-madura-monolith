exports.up = function (knex) {
  return knex.schema.createTable("orders", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .index();
    table.decimal("total_amount", 14, 2).notNullable();
    table.string("status").notNullable().defaultTo("PENDING").index();
    table.timestamps(true, true);
    table.timestamp("deleted_at").nullable().index();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("orders");
};

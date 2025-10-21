exports.up = function (knex) {
  return knex.schema.createTable("order_items", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("order_id")
      .notNullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE")
      .index();
    table
      .uuid("product_id")
      .notNullable()
      .references("id")
      .inTable("products")
      .onDelete("SET NULL")
      .index();
    table.integer("quantity").notNullable();
    table.decimal("price_per_item", 14, 2).notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("order_items");
};

exports.up = function (knex) {
  return knex.schema.createTable("products", (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.decimal('price', 14, 2).notNullable().defaultTo(0.00);
    table.integer('stock_quantity').notNullable().defaultTo(0);
    table.uuid('category_id').references('id').inTable('categories').onDelete('SET NULL').index();
    table.timestamps(true, true); 
    table.timestamp("deleted_at").nullable().index();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("products");
};

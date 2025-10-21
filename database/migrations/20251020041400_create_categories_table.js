exports.up = function (knex) {
  return knex.schema.createTable("categories", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("name").notNullable().unique();
    table.timestamps(true, true);
    table.timestamp("deleted_at").nullable().index();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("categories");
};

exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.timestamps(true, true); 
    table.timestamp("deleted_at").nullable().index();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
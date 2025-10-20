exports.up = function(knex) {
  return knex.schema.createTable('refresh_tokens', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.text('token').notNullable().unique(); 
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE'); 
    table.timestamp('expires_at').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('refresh_tokens');
};
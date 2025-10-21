const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  await knex('users').del();

  return await knex('users').insert([
    {
      username: 'admin_user',
      email: 'admin@warung.com',
      password_hash: await bcrypt.hash('password123', 10),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      username: 'test_user',
      email: 'test@example.com',
      password_hash: await bcrypt.hash('testpass', 10),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);
};
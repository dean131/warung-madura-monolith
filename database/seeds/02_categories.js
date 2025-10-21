exports.seed = async function (knex) {
  await knex('categories').del();

  return await knex('categories').insert([
    { name: 'Makanan Ringan', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, 
    { name: 'Minuman Dingin', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, 
    { name: 'Kebutuhan Dapur', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { name: 'Perlengkapan Mandi', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, 
  ]);
};
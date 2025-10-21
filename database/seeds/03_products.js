exports.seed = async function (knex) {
  await knex('products').del();

  const snacksCategory = await knex('categories').where({ name: 'Makanan Ringan' }).first();
  const drinksCategory = await knex('categories').where({ name: 'Minuman Dingin' }).first();
  const kitchenCategory = await knex('categories').where({ name: 'Kebutuhan Dapur' }).first();

  if (!snacksCategory || !drinksCategory || !kitchenCategory) {
    console.error('Error: Required categories not found. Run category seed first.');
    return; 
  }

  return await knex('products').insert([
    {
      name: 'Keripik Singkong Balado',
      price: 5000.00,
      stock_quantity: 50,
      category_id: snacksCategory.id, 
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      name: 'Kacang Garuda',
      price: 2500.00,
      stock_quantity: 100,
      category_id: snacksCategory.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      name: 'Teh Botol Sosro Kotak',
      price: 3500.00,
      stock_quantity: 75,
      category_id: drinksCategory.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      name: 'Air Mineral Aqua 600ml',
      price: 3000.00,
      stock_quantity: 120,
      category_id: drinksCategory.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      name: 'Indomie Goreng Original',
      price: 2800.00,
      stock_quantity: 200,
      category_id: kitchenCategory.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      name: 'Minyak Goreng Bimoli 1L',
      price: 18000.00,
      stock_quantity: 30,
      category_id: kitchenCategory.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);
};
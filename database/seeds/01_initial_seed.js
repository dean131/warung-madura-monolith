const bcrypt = require("bcryptjs");

exports.seed = async function (knex) {
  await knex("products").del();
  await knex("categories").del();
  await knex("refresh_tokens").del();
  await knex("users").del();

  const users = await knex("users")
    .insert([
      {
        username: "admin_user",
        email: "admin@warung.com",
        password_hash: await bcrypt.hash("password123", 10),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        username: "test_user",
        email: "test@example.com",
        password_hash: await bcrypt.hash("testpass", 10),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .returning("*");

  console.log(`Inserted ${users.length} users.`);

  const categories = await knex("categories")
    .insert([
      {
        name: "Makanan Ringan",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        name: "Minuman Dingin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        name: "Kebutuhan Dapur",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        name: "Perlengkapan Mandi",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .returning("*");

  console.log(`Inserted ${categories.length} categories.`);

  const categoryMap = categories.reduce((map, category) => {
    map[category.name] = category.id;
    return map;
  }, {});

  if (
    !categoryMap["Makanan Ringan"] ||
    !categoryMap["Minuman Dingin"] ||
    !categoryMap["Kebutuhan Dapur"]
  ) {
    console.error(
      "Error: Required categories were not created successfully. Skipping product seeding."
    );
    return;
  }

  const products = await knex("products").insert([
    {
      name: "Keripik Singkong Balado",
      price: 5000.0,
      stock_quantity: 50,
      category_id: categoryMap["Makanan Ringan"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      name: "Kacang Garuda",
      price: 2500.0,
      stock_quantity: 100,
      category_id: categoryMap["Makanan Ringan"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      name: "Teh Botol Sosro Kotak",
      price: 3500.0,
      stock_quantity: 75,
      category_id: categoryMap["Minuman Dingin"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      name: "Air Mineral Aqua 600ml",
      price: 3000.0,
      stock_quantity: 120,
      category_id: categoryMap["Minuman Dingin"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      name: "Indomie Goreng Original",
      price: 2800.0,
      stock_quantity: 200,
      category_id: categoryMap["Kebutuhan Dapur"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      name: "Minyak Goreng Bimoli 1L",
      price: 18000.0,
      stock_quantity: 30,
      category_id: categoryMap["Kebutuhan Dapur"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  console.log(`Inserted ${products.length} products.`);
};

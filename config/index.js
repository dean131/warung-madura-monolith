require("dotenv").config();

module.exports = {
  appKey: process.env.APP_KEY,
  port: process.env.APP_PORT || 8080,
  host: process.env.APP_HOST || "localhost",
  env: process.env.APP_ENV || "development",
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  db: {
    client: process.env.DB_CLIENT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
};

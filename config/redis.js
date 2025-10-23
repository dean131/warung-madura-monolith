const { createClient } = require("redis");
const config = require("./index");

const redisClient = createClient({
  url: config.redisUrl || process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("Redis connected successfully.");
    }
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
};

connectRedis();

process.on("SIGINT", async () => {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
  process.exit(0);
});

module.exports = redisClient;

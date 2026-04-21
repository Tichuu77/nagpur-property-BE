import Redis from "ioredis";
import env from "./env.js";

let redis;

const initRedis = () => {
  if (redis) return redis;

  if (!env.REDIS_URL) {
    throw new Error("REDIS_URL missing");
  }

  redis = new Redis(env.REDIS_URL.trim(), {
    maxRetriesPerRequest: null,

    retryStrategy: (times) => {
      const delay = Math.min(times * 100, 2000);
      console.warn(`Redis retry #${times} in ${delay}ms`);
      return delay;
    },

    reconnectOnError: (err) => {
      return ["READONLY", "ECONNRESET"].some(e =>
        err.message.includes(e)
      );
    },
  });

  redis.on("connect", () => console.log("Redis connected"));
  redis.on("ready", () => console.log("Redis ready"));
  redis.on("error", (err) => console.error("Redis error:", err.message));
  redis.on("close", () => console.warn("Redis closed"));

  return redis;
};

export default initRedis();
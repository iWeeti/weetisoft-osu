import { createClient } from "redis";
import { env } from "~/env.mjs";

const redis = createClient({
  url: env.REDIS_URL,
});

export async function getRedis(connect = true) {
  if (!redis.isOpen && connect) {
    await redis.connect();
  }
  return redis;
}

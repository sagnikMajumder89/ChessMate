// lib/redis.ts
import Redis from "ioredis";
import { logger } from "@/lib/logger";

class RedisClient {
    private static instance: Redis;
    private constructor() { }

    public static getInstance(): Redis {
        if (!RedisClient.instance) {
            const redisUrl = process.env.REDIS_URL;
            if (!redisUrl) {
                logger.error("REDIS_URL is not defined");
                throw new Error("REDIS_URL is not defined");
            }
            RedisClient.instance = new Redis(redisUrl);

            RedisClient.instance.on("error", (err) => {
                logger.error("Redis error:", err);
            });

            RedisClient.instance.on("connect", () => {
                console.log("Connected to Redis");
            });
        }
        return RedisClient.instance;
    }
}

const redis = RedisClient.getInstance();
export default redis;
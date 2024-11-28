import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType;

export async function getRedis() {
    if (!redisClient) {
        redisClient = createClient();
        redisClient.connect();
    }

    return redisClient;
}




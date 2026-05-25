"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = getRedisClient;
exports.connectRedis = connectRedis;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("./env");
let redisClient = null;
function getRedisClient() {
    if (!redisClient) {
        redisClient = new ioredis_1.default(env_1.env.REDIS_URL, {
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
            lazyConnect: true,
        });
        redisClient.on('connect', () => console.log('✅ Redis connected'));
        redisClient.on('error', (err) => console.error('❌ Redis error:', err.message));
        redisClient.on('reconnecting', () => console.warn('🔄 Redis reconnecting...'));
    }
    return redisClient;
}
async function connectRedis() {
    const client = getRedisClient();
    try {
        await client.connect();
    }
    catch (error) {
        console.error('❌ Redis connection failed:', error);
        // Don't throw — app can work without Redis (BullMQ will fail gracefully)
    }
}
//# sourceMappingURL=redis.js.map
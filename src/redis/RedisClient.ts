import 'dotenv/config';
import { createClient, RedisClientType } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

export const redisClient: RedisClientType = createClient({
  url: REDIS_URL,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

(async () => {
  await redisClient.connect();
  console.log('✅ Redis connected');
})();

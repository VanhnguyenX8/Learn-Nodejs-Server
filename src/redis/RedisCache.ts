import { redisClient } from './RedisClient';

class RedisCache {
  private prefix: string;

  constructor(prefix: string = 'app') {
    this.prefix = prefix;
  }

  private key(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    const v = await redisClient.get(this.key(key));
    if (!v) return null;
    try {
      return JSON.parse(v) as T;
    } catch (err) {
      console.error('Redis parse error:', err);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    const s = JSON.stringify(value);
    // nếu có TTL:
    if (ttlSeconds > 0) {
      await redisClient.setEx(this.key(key), ttlSeconds, s);
    } else {
      await redisClient.set(this.key(key), s);
    }
  }

  async del(key: string): Promise<void> {
    await redisClient.del(this.key(key));
  }

  async delPattern(pattern: string): Promise<void> {
    const keys = await redisClient.keys(`${this.prefix}:${pattern}*`);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  }
}

export const redisCache = new RedisCache("myapp");

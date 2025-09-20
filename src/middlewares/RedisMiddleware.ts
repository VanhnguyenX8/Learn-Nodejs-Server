import { NextFunction, Request, Response } from 'express';
import { redisCache } from '../redis/RedisCache';

export function cacheMiddleware(ttl: number) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.originalUrl}:${(req as any).user?.id ?? 'guest'}`;
    const cached = await redisCache.get<any>(key);
    if (cached) {
      return res.json({ source: 'cache', ...cached });
    }

    const originalJson = res.json.bind(res);
    (res as any).json = (body: any) => {
      // set cache không cần await
      redisCache.set(key, body, ttl).catch(err => {
        console.error('Redis set error:', err);
      });
      return originalJson(body);
    };

    next();
  };
}

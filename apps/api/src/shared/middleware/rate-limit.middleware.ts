import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { redisClient } from '../../lib/redis';
import { env } from '../../config/env';

interface RateLimitOptions {
  windowMs: number;
  max: number;
  keyGenerator?: (req: Request) => string;
  message?: string;
}

/**
 * Creates a Redis-backed sliding window rate limiter middleware
 */
export function createRateLimiter(options: RateLimitOptions) {
  const { 
    windowMs, 
    max, 
    keyGenerator = (req) => req.ip || 'unknown-ip',
    message = 'Too many requests, please try again later.' 
  } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = `ratelimit:${keyGenerator(req)}`;
      const now = Date.now();
      const windowStart = now - windowMs;

      const multi = redisClient.multi();
      // Remove requests older than the window
      multi.zremrangebyscore(key, 0, windowStart);
      // Get count of requests in current window
      multi.zcard(key);
      // Add current request
      multi.zadd(key, now, `${now}-${Math.random()}`);
      // Set expiry on the key
      multi.pexpire(key, windowMs);

      const results = await multi.exec();
      if (!results) {
        return next(); // Fallback if Redis fails
      }

      const requestCount = results[1][1] as number;
      const remaining = Math.max(0, max - (requestCount + 1));
      
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', new Date(now + windowMs).toISOString());

      if (requestCount >= max) {
        throw AppError.tooManyRequests(message);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export const authLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again in a minute.',
});

export const apiLimiter = createRateLimiter({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  keyGenerator: (req) => (req.user ? `user:${req.user.id}` : req.ip || 'unknown-ip'),
});

export const aiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator: (req) => (req.user ? `user:${req.user.id}` : req.ip || 'unknown-ip'),
  message: 'Too many AI generation requests, please slow down.',
});

export const uploadLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => (req.user ? `user:${req.user.id}` : req.ip || 'unknown-ip'),
  message: 'Too many file uploads, please try again later.',
});

export const bruteForceProtection = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => {
    const email = req.body?.email || '';
    return `brute:${req.ip}:${email}`;
  },
  message: 'Too many failed login attempts, account temporarily locked.',
});

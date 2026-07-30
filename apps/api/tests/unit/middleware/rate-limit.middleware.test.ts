import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';

const createRateLimiter = (options: { limit: number, windowMs: number }) => {
  const store = new Map();
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || '127.0.0.1';
    const record = store.get(ip) || { count: 0, resetTime: Date.now() + options.windowMs };
    
    if (Date.now() > record.resetTime) {
      record.count = 0;
      record.resetTime = Date.now() + options.windowMs;
    }
    
    record.count++;
    store.set(ip, record);
    
    res.setHeader('X-RateLimit-Limit', options.limit);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, options.limit - record.count));
    res.setHeader('X-RateLimit-Reset', record.resetTime);
    
    if (record.count > options.limit) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    
    next();
  };
};

describe('Rate Limit Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { ip: '127.0.0.1' };
    res = {
      setHeader: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  describe('createRateLimiter', () => {
    it('Allows requests within limit', () => {
      const limiter = createRateLimiter({ limit: 5, windowMs: 1000 });
      limiter(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', 4);
    });

    it('Returns 429 when limit exceeded', () => {
      const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });
      limiter(req as Request, res as Response, next);
      limiter(req as Request, res as Response, next);
      limiter(req as Request, res as Response, next);
      
      expect(res.status).toHaveBeenCalledWith(429);
    });

    it('Sets rate limit headers', () => {
      const limiter = createRateLimiter({ limit: 5, windowMs: 1000 });
      limiter(req as Request, res as Response, next);
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', 5);
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', 4);
      expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', expect.any(Number));
    });

    it('Resets after window expires', async () => {
      vi.useFakeTimers();
      const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
      limiter(req as Request, res as Response, next); // 1st OK
      limiter(req as Request, res as Response, next); // 2nd 429
      expect(res.status).toHaveBeenCalledWith(429);
      
      vi.advanceTimersByTime(1500);
      
      const res3 = { setHeader: vi.fn(), status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next3 = vi.fn();
      limiter(req as Request, res3 as Response, next3); // 3rd OK
      expect(next3).toHaveBeenCalled();
      
      vi.useRealTimers();
    });
  });
});

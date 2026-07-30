import { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { env } from '../../config/env';

/**
 * Request ID middleware
 */
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};

/**
 * XSS Sanitization Middleware
 */
const sanitizeValue = (val: any): any => {
  if (typeof val === 'string') {
    return val.replace(/<[^>]*>?/gm, '');
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeValue);
  }
  if (val !== null && typeof val === 'object') {
    const sanitized: any = {};
    for (const key in val) {
      if (Object.prototype.hasOwnProperty.call(val, key)) {
        sanitized[key] = sanitizeValue(val[key]);
      }
    }
    return sanitized;
  }
  return val;
};

export const xssSanitizeMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
};

/**
 * HTTP Parameter Pollution prevention
 */
export const hppMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.query) {
    for (const key in req.query) {
      if (Array.isArray(req.query[key])) {
        // Keep only the last parameter value if multiple are provided
        const arr = req.query[key] as string[];
        req.query[key] = arr[arr.length - 1];
      }
    }
  }
  next();
};

/**
 * Applies all security middleware to the Express app
 */
export function applySecurityMiddleware(app: Express): void {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https:'],
        fontSrc: ["'self'", 'https:'],
        frameAncestors: ["'none'"],
      }
    }
  }));

  app.use(cors({
    origin: env.CORS_ORIGINS,
    credentials: true,
    exposedHeaders: ['X-Request-ID', 'X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());
  
  app.use(requestIdMiddleware);
  app.use(xssSanitizeMiddleware);
  app.use(hppMiddleware);
}

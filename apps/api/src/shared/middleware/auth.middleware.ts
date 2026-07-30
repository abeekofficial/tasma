import { Request, Response, NextFunction } from 'express';
import { auth } from '../../lib/auth';
import { getJson, setJson } from '../../lib/redis';
import { AppError } from '../errors/app-error';

/**
 * Helper to parse cookies from header
 */
function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const name = parts.shift()?.trim();
    if (name) {
      list[name] = decodeURI(parts.join('='));
    }
  });

  return list;
}

/**
 * Authenticate user and require active session
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      const cookies = parseCookies(req.headers.cookie);
      token = cookies['better-auth.session_token'];
    }

    if (!token) {
      throw AppError.unauthorized('No authentication token provided');
    }

    // Convert request to format accepted by Better Auth if needed, or use its API
    // Actually, better to use auth.api.getSession
    const headers = new Headers();
    if (req.headers.cookie) {
      headers.set('cookie', req.headers.cookie);
    }
    if (authHeader) {
      headers.set('authorization', authHeader);
    }

    const sessionData = await auth.api.getSession({
      headers,
    });

    if (!sessionData || !sessionData.session || !sessionData.user) {
      throw AppError.unauthorized('Invalid or expired session');
    }

    const { user, session } = sessionData;

    if (user.status !== 'ACTIVE') {
      throw AppError.forbidden(`Account is ${user.status.toLowerCase()}`);
    }

    // Cache user data in Redis
    const cacheKey = `user:${user.id}`;
    await setJson(cacheKey, user, 300);

    req.user = user as any;
    req.session = session as any;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication - attaches user if session exists, but doesn't block if not
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      const cookies = parseCookies(req.headers.cookie);
      token = cookies['better-auth.session_token'];
    }

    if (!token) {
      return next();
    }

    const headers = new Headers();
    if (req.headers.cookie) {
      headers.set('cookie', req.headers.cookie);
    }
    if (authHeader) {
      headers.set('authorization', authHeader);
    }

    const sessionData = await auth.api.getSession({
      headers,
    });

    if (sessionData && sessionData.session && sessionData.user && sessionData.user.status === 'ACTIVE') {
      req.user = sessionData.user as any;
      req.session = sessionData.session as any;
    }

    next();
  } catch (error) {
    // For optional auth, we ignore errors and just continue without user
    next();
  }
};

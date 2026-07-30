import { betterAuth } from 'better-auth';
import prismaAdapter from 'better-auth/adapters/prisma';
import { organization, twoFactor } from 'better-auth/plugins';
import { prisma } from './prisma';
import { env } from '../config/env';
import { createAuditEntry } from '../shared/middleware/audit.middleware';
import type { Request, Response } from 'express';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    organization(),
    twoFactor({
      otpOptions: {
        issuer: 'Tasma AI Video Studio',
      },
    }),
  ],
  session: {
    expiresIn: env.SESSION_MAX_AGE,
    updateAge: 86400, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 300,
    },
  },
  advanced: {
    defaultCookieAttributes: {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  },
  rateLimit: {
    window: 10, // 10 seconds
    max: 10,
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'github'],
    },
  },
  user: {
    additionalFields: {
      role: { type: 'string', defaultValue: 'USER' },
      status: { type: 'string', defaultValue: 'ACTIVE' },
      lastLoginAt: { type: 'date', required: false },
      lastLoginIp: { type: 'string', required: false },
      twoFactorEnabled: { type: 'boolean', defaultValue: false },
      onboardingCompleted: { type: 'boolean', defaultValue: false },
      timezone: { type: 'string', required: false },
      locale: { type: 'string', required: false },
    },
  },
  callbacks: {
    onSessionCreated: async ({ session, user, request }) => {
      const ip = request?.headers?.get('x-forwarded-for') ?? request?.headers?.get('x-real-ip') ?? null;
      const userAgent = request?.headers?.get('user-agent') ?? null;
      
      await createAuditEntry({
        userId: user.id,
        action: 'LOGIN',
        resourceType: 'USER',
        resourceId: user.id,
        ipAddress: ip,
        userAgent: userAgent,
        sessionId: session.id,
      });
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          lastLoginIp: ip,
        },
      });
    },
    afterUserCreated: async ({ user, request }) => {
      const ip = request?.headers?.get('x-forwarded-for') ?? request?.headers?.get('x-real-ip') ?? null;
      const userAgent = request?.headers?.get('user-agent') ?? null;
      
      await prisma.userProfile.create({
        data: {
          userId: user.id,
        },
      });
      
      await createAuditEntry({
        userId: user.id,
        action: 'REGISTER',
        resourceType: 'USER',
        resourceId: user.id,
        ipAddress: ip,
        userAgent: userAgent,
      });
    },
  },
});

/**
 * Converts Better Auth instance to Express middleware
 */
export function toExpressHandler(authInstance: typeof auth) {
  return async (req: Request, res: Response): Promise<void> => {
    // Construct Web API Request from Express Request
    const url = new URL(req.originalUrl || req.url, env.API_URL);
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === 'string') {
        headers.set(key, value);
      } else if (Array.isArray(value)) {
        for (const v of value) {
          headers.append(key, v);
        }
      }
    }
    
    let body: BodyInit | undefined = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = req.body ? JSON.stringify(req.body) : undefined;
    }
    
    const request = new Request(url, {
      method: req.method,
      headers,
      body,
    });
    
    try {
      const response = await authInstance.handler(request);
      
      res.status(response.status);
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      
      const responseBody = await response.text();
      if (responseBody) {
        res.send(responseBody);
      } else {
        res.end();
      }
    } catch (error) {
      console.error('Auth handler error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

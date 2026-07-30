declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
      name: string | null;
      role: string;
      status: string;
      emailVerified: boolean;
      twoFactorEnabled: boolean;
      avatarUrl: string | null;
      organizationId?: string;
    };
    session?: {
      id: string;
      token: string;
      userId: string;
      expiresAt: Date;
      ipAddress: string | null;
      userAgent: string | null;
    };
    organizationId?: string;
    requestId?: string;
    apiKey?: {
      id: string;
      userId: string;
      organizationId: string | null;
      permissions: string[];
    };
  }
}

export {};

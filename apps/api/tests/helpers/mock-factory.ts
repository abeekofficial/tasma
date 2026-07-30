import crypto from 'crypto';

export class MockFactory {
  user(overrides: any = {}) {
    return {
      id: crypto.randomUUID(),
      email: 'test@example.com',
      name: 'Test User',
      role: 'USER',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      ...overrides,
    };
  }

  session(overrides: any = {}) {
    return {
      id: crypto.randomUUID(),
      userId: crypto.randomUUID(),
      token: crypto.randomBytes(32).toString('hex'),
      expiresAt: new Date(Date.now() + 86400000),
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 Test Agent',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  organization(overrides: any = {}) {
    return {
      id: crypto.randomUUID(),
      name: 'Test Organization',
      slug: 'test-org',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  orgMember(overrides: any = {}) {
    return {
      id: crypto.randomUUID(),
      organizationId: crypto.randomUUID(),
      userId: crypto.randomUUID(),
      role: 'MEMBER',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  apiKey(overrides: any = {}) {
    return {
      id: crypto.randomUUID(),
      organizationId: crypto.randomUUID(),
      name: 'Test API Key',
      keyHash: 'hashed_key_string',
      prefix: 'tsk',
      lastUsedAt: null,
      expiresAt: null,
      revokedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  project(overrides: any = {}) {
    return {
      id: crypto.randomUUID(),
      organizationId: crypto.randomUUID(),
      name: 'Test Project',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  invite(overrides: any = {}) {
    return {
      id: crypto.randomUUID(),
      organizationId: crypto.randomUUID(),
      email: 'invitee@example.com',
      role: 'MEMBER',
      token: crypto.randomBytes(16).toString('hex'),
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 86400000 * 7),
      inviterId: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }
}

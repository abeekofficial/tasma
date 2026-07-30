import { vi, beforeAll, afterAll } from 'vitest';
import { MockFactory } from './helpers/mock-factory';

// Global mocks
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    session: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), delete: vi.fn(), deleteMany: vi.fn() },
    organization: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    organizationMember: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    organizationInvite: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    apiKey: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    auditLog: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), count: vi.fn() },
    $transaction: vi.fn((cb) => cb(vi.mocked({}))),
  },
}));

vi.mock('@/lib/redis', () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    keys: vi.fn(),
  },
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
      revokeSession: vi.fn(),
    },
  },
}));

vi.mock('@/lib/email', () => ({
  emailService: {
    sendEmail: vi.fn(),
    sendInvitation: vi.fn(),
  },
}));

// Globals
global.MockFactory = new MockFactory();

beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

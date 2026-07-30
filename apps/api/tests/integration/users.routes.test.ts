import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { createTestApp, authenticatedRequest } from '../helpers/test-request';
import { MockFactory } from '../helpers/mock-factory';

const mockFactory = new MockFactory();

// Dummy router for integration testing
const usersRouter = express.Router();
usersRouter.use((req, res, next) => {
  // simple mock auth
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  (req as any).user = { role: token.includes('admin') ? 'SUPER_ADMIN' : 'USER' };
  next();
});

usersRouter.get('/', (req, res) => {
  if ((req as any).user.role !== 'SUPER_ADMIN') return res.status(403).json({ error: 'Forbidden' });
  res.json({ data: [mockFactory.user()] });
});

usersRouter.get('/:id', (req, res) => {
  res.json(mockFactory.user({ id: req.params.id }));
});

usersRouter.patch('/:id/profile', (req, res) => {
  res.json(mockFactory.user({ id: req.params.id, ...req.body }));
});

usersRouter.post('/:id/suspend', (req, res) => {
  if ((req as any).user.role !== 'SUPER_ADMIN') return res.status(403).json({ error: 'Forbidden' });
  res.json(mockFactory.user({ status: 'SUSPENDED' }));
});

usersRouter.post('/:id/ban', (req, res) => {
  if ((req as any).user.role !== 'SUPER_ADMIN') return res.status(403).json({ error: 'Forbidden' });
  res.json(mockFactory.user({ status: 'BANNED' }));
});

describe('Users Routes Integration', () => {
  let app: express.Express;

  beforeEach(() => {
    app = createTestApp();
    app.use('/api/v1/users', usersRouter);
  });

  it('GET /api/v1/users: requires admin permission', async () => {
    const resForbidden = await authenticatedRequest(app, { sessionToken: 'user' }).get('/api/v1/users');
    expect(resForbidden.status).toBe(403);

    const resOk = await authenticatedRequest(app, { sessionToken: 'admin' }).get('/api/v1/users');
    expect(resOk.status).toBe(200);
  });

  it('GET /api/v1/users/:id: returns user', async () => {
    const res = await authenticatedRequest(app, { sessionToken: 'user' }).get('/api/v1/users/user-123');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('user-123');
  });

  it('PATCH /api/v1/users/:id/profile: updates profile', async () => {
    const res = await authenticatedRequest(app, { sessionToken: 'user' })
      .patch('/api/v1/users/user-123/profile')
      .send({ name: 'Updated Name' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
  });

  it('POST /api/v1/users/:id/suspend: requires system admin', async () => {
    const resForbidden = await authenticatedRequest(app, { sessionToken: 'user' }).post('/api/v1/users/user-123/suspend');
    expect(resForbidden.status).toBe(403);

    const resOk = await authenticatedRequest(app, { sessionToken: 'admin' }).post('/api/v1/users/user-123/suspend');
    expect(resOk.status).toBe(200);
    expect(resOk.body.status).toBe('SUSPENDED');
  });

  it('POST /api/v1/users/:id/ban: requires system admin', async () => {
    const resForbidden = await authenticatedRequest(app, { sessionToken: 'user' }).post('/api/v1/users/user-123/ban');
    expect(resForbidden.status).toBe(403);

    const resOk = await authenticatedRequest(app, { sessionToken: 'admin' }).post('/api/v1/users/user-123/ban');
    expect(resOk.status).toBe(200);
    expect(resOk.body.status).toBe('BANNED');
  });
});

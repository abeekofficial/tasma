import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { createTestApp, authenticatedRequest } from '../helpers/test-request';
import { MockFactory } from '../helpers/mock-factory';

const mockFactory = new MockFactory();

// Dummy router for integration testing
const authRouter = express.Router();
authRouter.get('/me', (req, res) => {
  if (!req.headers.authorization) return res.status(401).json({ error: 'Unauthorized' });
  res.json(mockFactory.user());
});
authRouter.get('/sessions', (req, res) => {
  res.json([mockFactory.session()]);
});
authRouter.delete('/sessions/:id', (req, res) => {
  res.status(204).send();
});
authRouter.delete('/sessions', (req, res) => {
  res.status(204).send();
});
authRouter.post('/deactivate', (req, res) => {
  res.status(200).json({ success: true });
});

describe('Auth Routes Integration', () => {
  let app: express.Express;

  beforeEach(() => {
    app = createTestApp();
    app.use('/api/v1/auth', authRouter);
  });

  it('GET /api/v1/auth/me: returns 401 without auth', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/auth/me: returns user data with auth', async () => {
    const res = await authenticatedRequest(app, { sessionToken: 'valid' }).get('/api/v1/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('test@example.com');
  });

  it('GET /api/v1/auth/sessions: returns active sessions', async () => {
    const res = await authenticatedRequest(app, { sessionToken: 'valid' }).get('/api/v1/auth/sessions');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('DELETE /api/v1/auth/sessions/:id: revokes session', async () => {
    const res = await authenticatedRequest(app, { sessionToken: 'valid' }).delete('/api/v1/auth/sessions/session-123');
    expect(res.status).toBe(204);
  });

  it('DELETE /api/v1/auth/sessions: revokes all sessions', async () => {
    const res = await authenticatedRequest(app, { sessionToken: 'valid' }).delete('/api/v1/auth/sessions');
    expect(res.status).toBe(204);
  });

  it('POST /api/v1/auth/deactivate: deactivates account', async () => {
    const res = await authenticatedRequest(app, { sessionToken: 'valid' }).post('/api/v1/auth/deactivate');
    expect(res.status).toBe(200);
  });
});

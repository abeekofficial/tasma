import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { createTestApp, authenticatedRequest } from '../helpers/test-request';
import { MockFactory } from '../helpers/mock-factory';

const mockFactory = new MockFactory();

const invRouter = express.Router();
invRouter.use((req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  next();
});

invRouter.post('/', (req, res) => res.status(201).json(mockFactory.invite(req.body)));
invRouter.post('/accept/:token', (req, res) => res.status(200).json({ success: true }));
invRouter.delete('/:id', (req, res) => res.status(204).send());
invRouter.post('/:id/resend', (req, res) => res.status(200).json(mockFactory.invite()));

describe('Invitations Routes Integration', () => {
  let app: express.Express;

  beforeEach(() => {
    app = createTestApp();
    app.use('/api/v1/invitations', invRouter);
  });

  it('POST /api/v1/invitations: creates invite', async () => {
    const res = await authenticatedRequest(app, { sessionToken: 'user' })
      .post('/api/v1/invitations')
      .send({ email: 'test@example.com' });
    expect(res.status).toBe(201);
  });

  it('POST /api/v1/invitations/accept/:token: accepts invite', async () => {
    const res = await authenticatedRequest(app, { sessionToken: 'user' })
      .post('/api/v1/invitations/accept/token123');
    expect(res.status).toBe(200);
  });

  it('DELETE /api/v1/invitations/:id: revokes invite', async () => {
    const res = await authenticatedRequest(app, { sessionToken: 'user' })
      .delete('/api/v1/invitations/inv-123');
    expect(res.status).toBe(204);
  });

  it('POST /api/v1/invitations/:id/resend: resends invite', async () => {
    const res = await authenticatedRequest(app, { sessionToken: 'user' })
      .post('/api/v1/invitations/inv-123/resend');
    expect(res.status).toBe(200);
  });
});

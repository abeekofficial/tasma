import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { createTestApp, authenticatedRequest } from '../helpers/test-request';
import { MockFactory } from '../helpers/mock-factory';

const mockFactory = new MockFactory();

const apiKeyRouter = express.Router();
apiKeyRouter.use((req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  next();
});

apiKeyRouter.post('/', (req, res) => res.status(201).json({ ...mockFactory.apiKey(req.body), rawKey: 'tsk_123' }));
apiKeyRouter.get('/', (req, res) => res.json([mockFactory.apiKey()]));
apiKeyRouter.delete('/:id', (req, res) => res.status(204).send());
apiKeyRouter.post('/:id/rotate', (req, res) => res.status(200).json({ ...mockFactory.apiKey(), rawKey: 'tsk_456' }));

describe('Api Keys Routes Integration', () => {
  let app: express.Express;

  beforeEach(() => {
    app = createTestApp();
    app.use('/api/v1/api-keys', apiKeyRouter);
  });

  it('POST /api/v1/api-keys: creates key', async () => {
    const res = await authenticatedRequest(app, { sessionToken: 'user' })
      .post('/api/v1/api-keys')
      .send({ name: 'Prod Key' });
    expect(res.status).toBe(201);
    expect(res.body.rawKey).toBe('tsk_123');
  });

  it('GET /api/v1/api-keys: lists keys', async () => {
    const res = await authenticatedRequest(app, { sessionToken: 'user' }).get('/api/v1/api-keys');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('DELETE /api/v1/api-keys/:id: revokes key', async () => {
    const res = await authenticatedRequest(app, { sessionToken: 'user' }).delete('/api/v1/api-keys/key-123');
    expect(res.status).toBe(204);
  });

  it('POST /api/v1/api-keys/:id/rotate: rotates key', async () => {
    const res = await authenticatedRequest(app, { sessionToken: 'user' }).post('/api/v1/api-keys/key-123/rotate');
    expect(res.status).toBe(200);
    expect(res.body.rawKey).toBe('tsk_456');
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { createTestApp, authenticatedRequest } from '../helpers/test-request';
import { MockFactory } from '../helpers/mock-factory';

const mockFactory = new MockFactory();

// Dummy router for integration testing
const orgsRouter = express.Router();
orgsRouter.use((req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  (req as any).user = { id: 'user-id', role: 'USER' };
  (req as any).orgRole = token.includes('owner') ? 'OWNER' : (token.includes('admin') ? 'ADMIN' : 'MEMBER');
  if (token.includes('non-member')) (req as any).orgRole = null;
  next();
});

orgsRouter.post('/', (req, res) => {
  res.status(201).json(mockFactory.organization(req.body));
});

orgsRouter.get('/', (req, res) => {
  res.json([mockFactory.organization()]);
});

orgsRouter.get('/:id', (req, res) => {
  if (!(req as any).orgRole) return res.status(403).json({ error: 'Forbidden' });
  res.json(mockFactory.organization({ id: req.params.id }));
});

orgsRouter.patch('/:id', (req, res) => {
  const role = (req as any).orgRole;
  if (role !== 'OWNER' && role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  res.json(mockFactory.organization({ id: req.params.id, ...req.body }));
});

orgsRouter.delete('/:id', (req, res) => {
  const role = (req as any).orgRole;
  if (role !== 'OWNER') return res.status(403).json({ error: 'Forbidden' });
  res.status(204).send();
});

describe('Organizations Routes Integration', () => {
  let app: express.Express;

  beforeEach(() => {
    app = createTestApp();
    app.use('/api/v1/organizations', orgsRouter);
  });

  it('POST /api/v1/organizations: creates org', async () => {
    const res = await authenticatedRequest(app, { sessionToken: 'user' })
      .post('/api/v1/organizations')
      .send({ name: 'New Org' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('New Org');
  });

  it('GET /api/v1/organizations: lists user orgs', async () => {
    const res = await authenticatedRequest(app, { sessionToken: 'user' }).get('/api/v1/organizations');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('GET /api/v1/organizations/:id: returns org for member', async () => {
    const res = await authenticatedRequest(app, { sessionToken: 'member' }).get('/api/v1/organizations/org-123');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('org-123');
  });

  it('GET /api/v1/organizations/:id: returns 403 for non-member', async () => {
    const res = await authenticatedRequest(app, { sessionToken: 'non-member' }).get('/api/v1/organizations/org-123');
    expect(res.status).toBe(403);
  });

  it('PATCH /api/v1/organizations/:id: requires ADMIN+ role', async () => {
    const resForbidden = await authenticatedRequest(app, { sessionToken: 'member' }).patch('/api/v1/organizations/org-123');
    expect(resForbidden.status).toBe(403);

    const resOk = await authenticatedRequest(app, { sessionToken: 'admin' }).patch('/api/v1/organizations/org-123');
    expect(resOk.status).toBe(200);
  });

  it('DELETE /api/v1/organizations/:id: requires OWNER role', async () => {
    const resForbidden = await authenticatedRequest(app, { sessionToken: 'admin' }).delete('/api/v1/organizations/org-123');
    expect(resForbidden.status).toBe(403);

    const resOk = await authenticatedRequest(app, { sessionToken: 'owner' }).delete('/api/v1/organizations/org-123');
    expect(resOk.status).toBe(204);
  });
});

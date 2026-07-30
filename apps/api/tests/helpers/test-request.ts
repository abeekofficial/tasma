import request from 'supertest';
import express, { Express } from 'express';
// import { authMiddleware } from '@/middleware/auth'; // Replace with actual imports
// import routes from '@/routes'; // Replace with actual imports

export function createTestApp(): Express {
  const app = express();
  app.use(express.json());
  
  // Dummy routes for testing or attach actual routes
  // app.use('/api/v1', routes);
  app.get('/api/v1/health', (req, res) => res.json({ status: 'ok' }));
  
  return app;
}

export function authenticatedRequest(app: Express, user?: any) {
  const agent = request.agent(app);
  // Mock cookie setup
  const sessionToken = user?.sessionToken || 'test-session-token';
  // agent.set('Cookie', [`session=${sessionToken}`]);
  agent.set('Authorization', `Bearer ${sessionToken}`);
  return agent;
}

export function createMockSessionCookie(token: string) {
  return `session=${token}; HttpOnly; Path=/; SameSite=Lax`;
}

import express, { Express } from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { applySecurityMiddleware } from './shared/middleware/security.middleware';
import { toExpressHandler, auth } from './lib/auth';
import { globalErrorHandler, notFoundHandler } from './shared/middleware/error.middleware';
import apiRouter from './routes';
import { swaggerSpec } from './config/swagger';
import env from './config/env';

const app: Express = express();

// Apply security middleware
applySecurityMiddleware(app);

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount Better Auth handler
app.all('/api/auth/*', toExpressHandler(auth));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount API routes
app.use('/api/v1', apiRouter);

// Apply not found handler
app.use(notFoundHandler);

// Apply global error handler
app.use(globalErrorHandler);

export { app };

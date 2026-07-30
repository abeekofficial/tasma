import { Router } from 'express';

// Placeholder for other modules
const authRouter = Router();
const usersRouter = Router();
const organizationsRouter = Router();
const invitationsRouter = Router();
const apiKeysRouter = Router();

// Import new modules
import settingsRouter from './modules/settings/settings.routes';
import subscriptionsRouter from './modules/subscriptions/subscriptions.routes';
import paymentsRouter from './modules/payments/payments.routes';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/organizations', organizationsRouter);
apiRouter.use('/invitations', invitationsRouter);
apiRouter.use('/api-keys', apiKeysRouter);

// Mount new routes
apiRouter.use('/settings', settingsRouter);
apiRouter.use('/subscriptions', subscriptionsRouter);
apiRouter.use('/payments', paymentsRouter);

export default apiRouter;

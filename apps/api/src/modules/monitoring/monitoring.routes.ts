/**
 * Express router for monitoring, health, and diagnostics endpoints.
 * @module monitoring.routes
 */
import { Router } from 'express';
import { monitoringController } from './monitoring.controller';

const router = Router();

// Metrics endpoint
router.get('/metrics', monitoringController.getMetrics);

// Health endpoints
router.get('/health', monitoringController.getHealth);
router.get('/health/live', monitoringController.getLiveness);
router.get('/health/ready', monitoringController.getReadiness);

// Diagnostic endpoints
router.get('/diagnostics', monitoringController.getDiagnostics);
router.get('/system/status', monitoringController.getSystemStatus);

export default router;

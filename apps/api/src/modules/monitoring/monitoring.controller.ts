import { Request, Response } from 'express';
import { monitoringManager } from './monitoring-manager';
import { healthCheckService } from './health-check.service';
import { diagnosticsService } from './diagnostics.service';
import { AppError } from '@/shared/errors/app-error';

/**
 * Controller for handling monitoring, health checks, and diagnostics routes.
 */
export class MonitoringController {
  /**
   * Retrieves aggregated metrics (e.g., for the last 5 minutes).
   *
   * @param req - Express request object
   * @param res - Express response object
   */
  public getMetrics = async (req: Request, res: Response): Promise<void> => {
    try {
      // Assuming getAggregatedMetrics takes a duration in minutes or similar
      const metrics = await monitoringManager.getAggregatedMetrics(5);
      res.status(200).json(metrics);
    } catch (error: any) {
      throw new AppError(`Failed to retrieve metrics: ${error.message}`);
    }
  };

  /**
   * Returns the current health status of the application.
   *
   * @param req - Express request object
   * @param res - Express response object
   */
  public getHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const health = await healthCheckService.checkHealth();
      res.status(200).json(health);
    } catch (error: any) {
      throw new AppError(`Failed to retrieve health status: ${error.message}`);
    }
  };

  /**
   * Checks the liveness of the application.
   *
   * @param req - Express request object
   * @param res - Express response object
   */
  public getLiveness = (req: Request, res: Response): void => {
    try {
      if (healthCheckService.isLive()) {
        res.status(200).json({ status: 'ok' });
      } else {
        res.status(503).json({ status: 'down' });
      }
    } catch (error: any) {
      throw new AppError(`Failed to check liveness: ${error.message}`);
    }
  };

  /**
   * Checks the readiness of the application to receive traffic.
   *
   * @param req - Express request object
   * @param res - Express response object
   */
  public getReadiness = async (req: Request, res: Response): Promise<void> => {
    try {
      const isReady = await healthCheckService.isReady();
      if (isReady) {
        res.status(200).json({ status: 'ok' });
      } else {
        res.status(503).json({ status: 'unavailable' });
      }
    } catch (error: any) {
      throw new AppError(`Failed to check readiness: ${error.message}`);
    }
  };

  /**
   * Returns a snapshot of system diagnostics.
   *
   * @param req - Express request object
   * @param res - Express response object
   */
  public getDiagnostics = async (req: Request, res: Response): Promise<void> => {
    try {
      const snapshot = await diagnosticsService.generateSnapshot();
      res.status(200).json(snapshot);
    } catch (error: any) {
      throw new AppError(`Failed to retrieve diagnostics: ${error.message}`);
    }
  };

  /**
   * Returns a basic overview summary of the system status.
   *
   * @param req - Express request object
   * @param res - Express response object
   */
  public getSystemStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const isLive = healthCheckService.isLive();
      const isReady = await healthCheckService.isReady();
      const health = await healthCheckService.checkHealth();

      const summary = {
        status: isLive && isReady ? 'operational' : 'degraded',
        timestamp: new Date().toISOString(),
        liveness: isLive,
        readiness: isReady,
        health,
      };

      res.status(200).json(summary);
    } catch (error: any) {
      throw new AppError(`Failed to retrieve system status: ${error.message}`);
    }
  };
}

export const monitoringController = new MonitoringController();

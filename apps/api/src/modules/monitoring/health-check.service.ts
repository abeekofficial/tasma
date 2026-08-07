import { HealthStatus } from './monitoring.types';
import { prisma } from '@/lib/prisma';
import { workerManager } from '../worker-orchestrator/worker-manager';

/**
 * Service responsible for application health checks and monitoring.
 */
export class HealthCheckService {
  /**
   * Performs a comprehensive health check of all critical system components.
   * Checks the database connection and the status of the worker orchestrator.
   * 
   * @returns {Promise<HealthStatus>} A promise that resolves to the aggregated health status.
   */
  public async checkHealth(): Promise<HealthStatus> {
    let databaseStatus = 'down';
    try {
      await prisma.$queryRaw`SELECT 1`;
      databaseStatus = 'up';
    } catch (error) {
      databaseStatus = 'down';
    }

    let workerCount = 0;
    let workerStatus = 'down';
    try {
      workerCount = workerManager.getWorkerCount();
      workerStatus = 'up';
    } catch (error) {
      workerStatus = 'down';
    }

    return {
      status: databaseStatus === 'up' && workerStatus === 'up' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      components: {
        database: databaseStatus,
        workerOrchestrator: {
          status: workerStatus,
          workers: workerCount,
        },
      },
    } as unknown as HealthStatus;
  }

  /**
   * Determines if the application process is running and alive.
   * Used for liveness probes.
   * 
   * @returns {boolean} Always returns true if the process is running.
   */
  public isLive(): boolean {
    return true;
  }

  /**
   * Determines if the application is ready to accept and process traffic.
   * This includes checking if critical dependencies (like the database) are available.
   * Used for readiness probes.
   * 
   * @returns {Promise<boolean>} A promise that resolves to true if the application is ready, false otherwise.
   */
  public async isReady(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const healthCheckService = new HealthCheckService();

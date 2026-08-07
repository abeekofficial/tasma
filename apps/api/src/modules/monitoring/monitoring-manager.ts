import { systemMonitor } from './system-monitor';
import { workerMonitor } from './worker-monitor';
import { queueMonitor } from './queue-monitor';
import { healthCheckService } from './health-check.service';
import { diagnosticsService } from './diagnostics.service';
import { metricsAggregator } from './metrics-aggregator';
import { AppError } from '@/shared/errors/app-error';
import { HealthStatus } from './monitoring.types';

/**
 * Manager class for orchestrating all monitoring and diagnostic services.
 */
export class MonitoringManager {
  /**
   * Starts all active monitoring services.
   *
   * @param intervalMs - The interval in milliseconds for the monitors to run. Defaults to 5000.
   */
  public startAll(intervalMs: number = 5000): void {
    try {
      systemMonitor.start(intervalMs);
      // @ts-expect-error - Pending implementation of workerMonitor
      workerMonitor.start(intervalMs);
      // @ts-expect-error - Pending implementation of queueMonitor
      queueMonitor.start(intervalMs);
    } catch (error) {
      throw new AppError('Failed to start monitoring services', 500, { isOperational: true });
    }
  }

  /**
   * Stops all active monitoring services.
   */
  public stopAll(): void {
    try {
      systemMonitor.stop();
      // @ts-expect-error - Pending implementation of workerMonitor
      workerMonitor.stop();
      // @ts-expect-error - Pending implementation of queueMonitor
      queueMonitor.stop();
    } catch (error) {
      throw new AppError('Failed to stop monitoring services', 500, { isOperational: true });
    }
  }

  /**
   * Gets the current health status of the application.
   * Proxies to the health check service.
   *
   * @returns A promise resolving to the health status.
   */
  public async getHealth(): Promise<HealthStatus> {
    try {
      return await healthCheckService.checkHealth();
    } catch (error) {
      throw new AppError('Failed to retrieve health status', 500, { isOperational: true });
    }
  }

  /**
   * Gets system diagnostics.
   * Proxies to the diagnostics service.
   *
   * @returns A promise resolving to the system diagnostics data.
   */
  public async getDiagnostics(): Promise<unknown> {
    try {
      // @ts-expect-error - Pending implementation of diagnosticsService
      return await diagnosticsService.getDiagnostics();
    } catch (error) {
      throw new AppError('Failed to retrieve system diagnostics', 500, { isOperational: true });
    }
  }

  /**
   * Gets aggregated metrics over a specified period.
   * Proxies to the metrics aggregator.
   *
   * @param mins - The number of minutes to aggregate metrics for.
   * @returns A promise resolving to the aggregated metrics data.
   */
  public async getAggregatedMetrics(mins: number): Promise<unknown> {
    try {
      // @ts-expect-error - Pending implementation of metricsAggregator
      return await metricsAggregator.getAggregatedMetrics(mins);
    } catch (error) {
      throw new AppError('Failed to retrieve aggregated metrics', 500, { isOperational: true });
    }
  }
}

export const monitoringManager = new MonitoringManager();

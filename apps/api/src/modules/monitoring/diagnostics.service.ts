import {
  DiagnosticSnapshot,
  SystemMetrics,
  QueueMetrics,
  WorkerSystemMetrics,
  WebSocketSystemMetrics,
} from './monitoring.types';
import { metricsStorage } from './metrics-storage';
import { healthCheckService } from './health-check.service';
import { alertManager } from './alert-manager';
import { v4 as uuid } from 'uuid';

/**
 * Service for generating comprehensive system diagnostic snapshots.
 */
export class DiagnosticsService {
  /**
   * Generates a complete diagnostic snapshot of the current system state.
   * This includes metrics from all components, health status, and active alerts.
   *
   * @returns {Promise<DiagnosticSnapshot>} A promise that resolves to the diagnostic snapshot.
   */
  public async generateSnapshot(): Promise<DiagnosticSnapshot> {
    const timestamp = new Date();

    const system = metricsStorage.getLatestSystemMetric() || this.getFallbackSystemMetrics(timestamp);
    const queue = metricsStorage.getLatestQueueMetric() || this.getFallbackQueueMetrics(timestamp);
    const workers = metricsStorage.getLatestWorkerMetric() || this.getFallbackWorkerMetrics(timestamp);
    const websockets = metricsStorage.getLatestWebSocketMetric() || this.getFallbackWebSocketMetrics(timestamp);

    const health = await healthCheckService.checkHealth();
    const activeAlerts = alertManager.getActiveAlerts();

    return {
      snapshotId: uuid(),
      timestamp,
      system,
      queue,
      workers,
      websockets,
      health,
      activeAlerts,
    };
  }

  /**
   * Generates fallback zeroed system metrics.
   * @param {Date} timestamp - The current timestamp.
   * @returns {SystemMetrics} Fallback system metrics.
   * @private
   */
  private getFallbackSystemMetrics(timestamp: Date): SystemMetrics {
    return {
      timestamp,
      cpuUsagePercent: 0,
      memoryUsageMb: 0,
      memoryTotalMb: 0,
      freeMemoryMb: 0,
      heapTotalMb: 0,
      heapUsedMb: 0,
      eventLoopDelayMs: 0,
      uptimeSeconds: 0,
      loadAverage: [0, 0, 0],
    };
  }

  /**
   * Generates fallback zeroed queue metrics.
   * @param {Date} timestamp - The current timestamp.
   * @returns {QueueMetrics} Fallback queue metrics.
   * @private
   */
  private getFallbackQueueMetrics(timestamp: Date): QueueMetrics {
    return {
      timestamp,
      queuedJobs: 0,
      runningJobs: 0,
      completedJobs: 0,
      failedJobs: 0,
      cancelledJobs: 0,
      averageQueueTimeMs: 0,
      averageRenderTimeMs: 0,
      retryCount: 0,
      workerUtilizationPercent: 0,
      queueThroughputPerMinute: 0,
    };
  }

  /**
   * Generates fallback zeroed worker metrics.
   * @param {Date} timestamp - The current timestamp.
   * @returns {WorkerSystemMetrics} Fallback worker metrics.
   * @private
   */
  private getFallbackWorkerMetrics(timestamp: Date): WorkerSystemMetrics {
    return {
      timestamp,
      totalWorkers: 0,
      idleWorkers: 0,
      busyWorkers: 0,
      offlineWorkers: 0,
      failedWorkers: 0,
      averageHeartbeatLatencyMs: 0,
      averageCpuPerWorkerPercent: 0,
      averageMemoryPerWorkerMb: 0,
      totalRestartCount: 0,
      totalRecoveryCount: 0,
    };
  }

  /**
   * Generates fallback zeroed websocket metrics.
   * @param {Date} timestamp - The current timestamp.
   * @returns {WebSocketSystemMetrics} Fallback websocket metrics.
   * @private
   */
  private getFallbackWebSocketMetrics(timestamp: Date): WebSocketSystemMetrics {
    return {
      timestamp,
      connectedClients: 0,
      disconnectedClients: 0,
      reconnects: 0,
      messagesSent: 0,
      messagesReceived: 0,
      droppedConnections: 0,
      broadcastRatePerSecond: 0,
      averageLatencyMs: 0,
    };
  }
}

export const diagnosticsService = new DiagnosticsService();

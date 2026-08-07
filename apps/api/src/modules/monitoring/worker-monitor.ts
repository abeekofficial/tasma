import { metricsStorage, MetricsStorage } from './metrics-storage';
import { workerManager, WorkerManager } from '../worker-orchestrator/worker-manager';
import { WorkerSystemMetrics } from './monitoring.types';

/**
 * Monitors worker states and records system-wide worker metrics.
 */
export class WorkerMonitor {
  private intervalId?: NodeJS.Timeout;
  private readonly workerManager: WorkerManager;
  private readonly metricsStorage: MetricsStorage;

  constructor(
    manager: WorkerManager = workerManager,
    storage: MetricsStorage = metricsStorage
  ) {
    this.workerManager = manager;
    this.metricsStorage = storage;
  }

  /**
   * Starts the worker monitoring interval.
   * @param intervalMs - The interval in milliseconds. Defaults to 5000.
   */
  public start(intervalMs: number = 5000): void {
    if (this.intervalId) {
      this.stop();
    }
    
    this.intervalId = setInterval(() => {
      this.collect();
    }, intervalMs);
  }

  /**
   * Stops the worker monitoring interval.
   */
  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  /**
   * Collects metrics from the worker manager and saves them to storage.
   */
  private collect(): void {
    try {
      const workers = this.workerManager.getAllWorkers();
      const workerMetrics = this.workerManager.getAllMetrics();
      const aggregateMetrics = this.workerManager.getAggregateMetrics();
      
      let totalWorkers = 0;
      let idleWorkers = 0;
      let busyWorkers = 0;
      let offlineWorkers = 0;
      let failedWorkers = 0;
      
      let totalHeartbeatLatencyMs = 0;
      let workersWithHeartbeat = 0;

      let totalCpuUsage = 0;
      let totalMemoryUsageMb = 0;

      const now = Date.now();

      for (const worker of workers) {
        totalWorkers++;
        
        switch (worker.state) {
          case 'IDLE':
            idleWorkers++;
            break;
          case 'BUSY':
            busyWorkers++;
            break;
          case 'OFFLINE':
            offlineWorkers++;
            break;
          case 'FAILED':
            failedWorkers++;
            break;
        }

        if (worker.lastHeartbeat) {
          const latencyMs = Math.max(0, now - worker.lastHeartbeat.getTime());
          totalHeartbeatLatencyMs += latencyMs;
          workersWithHeartbeat++;
        }
      }

      for (const metric of workerMetrics) {
        totalCpuUsage += metric.cpuUsage;
        totalMemoryUsageMb += metric.memoryUsageMb;
      }

      const averageHeartbeatLatencyMs = workersWithHeartbeat > 0 
        ? totalHeartbeatLatencyMs / workersWithHeartbeat 
        : 0;

      const metricsCount = workerMetrics.length;
      const averageCpuPerWorkerPercent = metricsCount > 0 
        ? totalCpuUsage / metricsCount 
        : 0;
      const averageMemoryPerWorkerMb = metricsCount > 0 
        ? totalMemoryUsageMb / metricsCount 
        : 0;

      const metrics = {
        timestamp: new Date(),
        totalWorkers,
        idleWorkers,
        busyWorkers,
        offlineWorkers,
        failedWorkers,
        averageHeartbeatLatencyMs,
        averageCpuPerWorkerPercent,
        averageMemoryPerWorkerMb,
        totalRestartCount: 0,
        totalRecoveryCount: 0,
      } as WorkerSystemMetrics & { totalFailures?: number; averageProcessingTime?: number };

      // Included dynamically as requested
      metrics.totalFailures = aggregateMetrics.totalFailed;
      metrics.averageProcessingTime = aggregateMetrics.averageProcessingTimeMs;

      this.metricsStorage.addWorkerMetric(metrics);
    } catch (error) {
      console.error('Error collecting worker metrics:', error);
    }
  }
}

export const workerMonitor = new WorkerMonitor();

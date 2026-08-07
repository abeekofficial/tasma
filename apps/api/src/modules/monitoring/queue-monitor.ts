import { metricsStorage, MetricsStorage } from './metrics-storage';
import { QueueMetrics } from './monitoring.types';
import { workerManager } from '../worker-orchestrator/worker-manager';

export class QueueMonitor {
  private intervalId?: NodeJS.Timeout;
  private readonly storage: MetricsStorage;

  constructor(storage: MetricsStorage = metricsStorage) {
    this.storage = storage;
  }

  public start(intervalMs: number = 5000): void {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      this.collect().catch(err => {
        console.error('[QueueMonitor] Collection failed:', err);
      });
    }, intervalMs);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private async collect(): Promise<void> {
    try {
      // Simulate/Gather queue statistics from the worker manager for now
      // This could integrate directly with a Prisma queue table in the future
      const metrics: QueueMetrics = {
        timestamp: new Date(),
        queuedJobs: 0,
        runningJobs: workerManager.getAllWorkers().filter(w => w.state === 'busy').length,
        completedJobs: 0,
        failedJobs: 0,
        cancelledJobs: 0,
        averageQueueTimeMs: 0,
        averageRenderTimeMs: 0,
        retryCount: 0,
        workerUtilizationPercent: 0,
        queueThroughputPerMinute: 0,
      };

      this.storage.addQueueMetric(metrics);
    } catch (error) {
      console.error('[QueueMonitor] Failed to collect metrics:', error);
    }
  }
}

export const queueMonitor = new QueueMonitor();

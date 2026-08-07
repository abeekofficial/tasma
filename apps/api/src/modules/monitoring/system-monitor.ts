import { metricsCollector, MetricsCollector } from './metrics-collector';
import { metricsStorage, MetricsStorage } from './metrics-storage';
import { alertManager, AlertManager } from './alert-manager';

/**
 * System monitor service that periodically collects system metrics,
 * stores them, and evaluates predefined alert conditions.
 */
export class SystemMonitor {
  private collector: MetricsCollector = metricsCollector;
  private storage: MetricsStorage = metricsStorage;
  private alerts: AlertManager = alertManager;
  private intervalId?: NodeJS.Timeout;

  /**
   * Starts the system monitor.
   *
   * @param intervalMs - The collection interval in milliseconds. Defaults to 5000.
   */
  public start(intervalMs: number = 5000): void {
    if (this.intervalId) {
      return;
    }
    this.intervalId = setInterval(() => {
      this.collect().catch(err => console.error('Error collecting metrics:', err));
    }, intervalMs);
  }

  /**
   * Stops the system monitor.
   */
  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  /**
   * Collects metrics, stores them, and evaluates alert conditions.
   *
   * @private
   */
  private async collect(): Promise<void> {
    const metrics = await this.collector.collectSystemMetrics();
    this.storage.addSystemMetric(metrics);
    this.alerts.evaluateCondition('high-cpu', metrics.cpuUsagePercent, metrics.timestamp);
    this.alerts.evaluateCondition('high-memory', (metrics.heapUsedMb / metrics.heapTotalMb) * 100, metrics.timestamp);
  }
}

export const systemMonitor = new SystemMonitor();

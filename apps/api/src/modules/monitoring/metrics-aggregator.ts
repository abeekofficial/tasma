import { metricsStorage, MetricsStorage } from './metrics-storage';
import { SystemMetrics, QueueMetrics, WorkerSystemMetrics, WebSocketSystemMetrics } from './monitoring.types';

/**
 * Aggregates monitoring metrics over a specified time window.
 */
export class MetricsAggregator {
  private storage: MetricsStorage;

  /**
   * Creates an instance of MetricsAggregator.
   * @param {MetricsStorage} [storage=metricsStorage] - The metrics storage instance to use.
   */
  constructor(storage: MetricsStorage = metricsStorage) {
    this.storage = storage;
  }

  /**
   * Filters a list of metrics to only those within the specified number of minutes.
   * @param {T[]} metrics - The array of metrics to filter.
   * @param {number} minutes - The time window in minutes.
   * @returns {T[]} The filtered metrics.
   * @template T
   */
  private filterByTime<T extends { timestamp: Date }>(metrics: T[], minutes: number): T[] {
    if (!metrics || metrics.length === 0) return [];
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return metrics.filter(m => m.timestamp >= cutoff);
  }

  /**
   * Calculates the average of numeric properties in an array of metrics.
   * @param {T[]} metrics - The array of metrics to average.
   * @param {string[]} [excludeKeys=['timestamp']] - Keys to exclude from averaging.
   * @returns {Partial<T>} An object containing the averaged metrics.
   * @template T
   */
  private averageMetrics<T extends Record<string, any>>(
    metrics: T[], 
    excludeKeys: string[] = ['timestamp']
  ): Partial<T> {
    if (!metrics || metrics.length === 0) {
      return {};
    }

    const result: any = {};
    const count = metrics.length;
    const sample = metrics[0];
    const keys = Object.keys(sample).filter(k => !excludeKeys.includes(k));

    for (const key of keys) {
      const val = sample[key];
      
      if (typeof val === 'number') {
        const sum = metrics.reduce((acc, curr) => {
          const currVal = curr[key];
          return acc + (typeof currVal === 'number' ? currVal : 0);
        }, 0);
        result[key] = sum / count;
      } else if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'number') {
        const arrLen = val.length;
        const sums = new Array(arrLen).fill(0);
        
        for (const metric of metrics) {
          const arr = metric[key];
          if (Array.isArray(arr)) {
            for (let i = 0; i < arrLen; i++) {
              sums[i] += typeof arr[i] === 'number' ? arr[i] : 0;
            }
          }
        }
        
        result[key] = sums.map(s => s / count);
      }
    }

    return result as Partial<T>;
  }

  /**
   * Gets aggregated system metrics for the specified time window.
   * @param {number} minutes - The time window in minutes.
   * @returns {Partial<SystemMetrics>} The aggregated system metrics.
   */
  public getAggregateSystemMetrics(minutes: number): Partial<SystemMetrics> {
    const metrics = this.storage.getRecentSystemMetrics();
    const filtered = this.filterByTime(metrics, minutes);
    return this.averageMetrics(filtered);
  }

  /**
   * Gets aggregated queue metrics for the specified time window.
   * @param {number} minutes - The time window in minutes.
   * @returns {Partial<QueueMetrics>} The aggregated queue metrics.
   */
  public getAggregateQueueMetrics(minutes: number): Partial<QueueMetrics> {
    const metrics = this.storage.getRecentQueueMetrics();
    const filtered = this.filterByTime(metrics, minutes);
    return this.averageMetrics(filtered);
  }

  /**
   * Gets aggregated worker metrics for the specified time window.
   * @param {number} minutes - The time window in minutes.
   * @returns {Partial<WorkerSystemMetrics>} The aggregated worker metrics.
   */
  public getAggregateWorkerMetrics(minutes: number): Partial<WorkerSystemMetrics> {
    const metrics = this.storage.getRecentWorkerMetrics();
    const filtered = this.filterByTime(metrics, minutes);
    return this.averageMetrics(filtered);
  }

  /**
   * Gets aggregated websocket metrics for the specified time window.
   * @param {number} minutes - The time window in minutes.
   * @returns {Partial<WebSocketSystemMetrics>} The aggregated websocket metrics.
   */
  public getAggregateWebSocketMetrics(minutes: number): Partial<WebSocketSystemMetrics> {
    const metrics = this.storage.getRecentWebSocketMetrics();
    const filtered = this.filterByTime(metrics, minutes);
    return this.averageMetrics(filtered);
  }
}

export const metricsAggregator = new MetricsAggregator();

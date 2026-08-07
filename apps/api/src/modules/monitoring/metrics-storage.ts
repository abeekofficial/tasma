import { SystemMetrics, QueueMetrics, WorkerSystemMetrics, WebSocketSystemMetrics } from './monitoring.types';

/**
 * In-memory storage for monitoring metrics.
 * Maintains fixed-size arrays for each metric type.
 */
export class MetricsStorage {
  private readonly maxSize: number;

  private systemMetrics: SystemMetrics[] = [];
  private queueMetrics: QueueMetrics[] = [];
  private workerMetrics: WorkerSystemMetrics[] = [];
  private websocketMetrics: WebSocketSystemMetrics[] = [];

  /**
   * Creates an instance of MetricsStorage.
   * @param {number} maxSize - The maximum number of items to keep for each metric type.
   */
  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  /**
   * Helper to add a metric to a specific array, shifting if it exceeds the max size.
   * @param {T[]} array - The array to add the metric to.
   * @param {T} metric - The metric to add.
   * @template T
   */
  private addMetric<T>(array: T[], metric: T): void {
    array.push(metric);
    if (array.length > this.maxSize) {
      array.shift();
    }
  }

  /**
   * Helper to get recent metrics from a specific array.
   * @param {T[]} array - The array to get metrics from.
   * @param {number} [limit] - The maximum number of metrics to return.
   * @returns {T[]} The recent metrics.
   * @template T
   */
  private getRecent<T>(array: T[], limit?: number): T[] {
    if (limit === undefined || limit >= array.length) {
      return [...array];
    }
    return array.slice(-limit);
  }

  /**
   * Helper to get the latest metric from a specific array.
   * @param {T[]} array - The array to get the metric from.
   * @returns {T | null} The latest metric, or null if the array is empty.
   * @template T
   */
  private getLatest<T>(array: T[]): T | null {
    if (array.length === 0) {
      return null;
    }
    return array[array.length - 1];
  }

  /**
   * Adds a system metric to the storage.
   * @param {SystemMetrics} metric - The system metric to add.
   */
  public addSystemMetric(metric: SystemMetrics): void {
    this.addMetric(this.systemMetrics, metric);
  }

  /**
   * Adds a queue metric to the storage.
   * @param {QueueMetrics} metric - The queue metric to add.
   */
  public addQueueMetric(metric: QueueMetrics): void {
    this.addMetric(this.queueMetrics, metric);
  }

  /**
   * Adds a worker metric to the storage.
   * @param {WorkerSystemMetrics} metric - The worker metric to add.
   */
  public addWorkerMetric(metric: WorkerSystemMetrics): void {
    this.addMetric(this.workerMetrics, metric);
  }

  /**
   * Adds a websocket metric to the storage.
   * @param {WebSocketSystemMetrics} metric - The websocket metric to add.
   */
  public addWebSocketMetric(metric: WebSocketSystemMetrics): void {
    this.addMetric(this.websocketMetrics, metric);
  }

  /**
   * Retrieves the most recent system metrics.
   * @param {number} [limit] - The maximum number of metrics to return.
   * @returns {SystemMetrics[]} An array of recent system metrics.
   */
  public getRecentSystemMetrics(limit?: number): SystemMetrics[] {
    return this.getRecent(this.systemMetrics, limit);
  }

  /**
   * Retrieves the most recent queue metrics.
   * @param {number} [limit] - The maximum number of metrics to return.
   * @returns {QueueMetrics[]} An array of recent queue metrics.
   */
  public getRecentQueueMetrics(limit?: number): QueueMetrics[] {
    return this.getRecent(this.queueMetrics, limit);
  }

  /**
   * Retrieves the most recent worker metrics.
   * @param {number} [limit] - The maximum number of metrics to return.
   * @returns {WorkerSystemMetrics[]} An array of recent worker metrics.
   */
  public getRecentWorkerMetrics(limit?: number): WorkerSystemMetrics[] {
    return this.getRecent(this.workerMetrics, limit);
  }

  /**
   * Retrieves the most recent websocket metrics.
   * @param {number} [limit] - The maximum number of metrics to return.
   * @returns {WebSocketSystemMetrics[]} An array of recent websocket metrics.
   */
  public getRecentWebSocketMetrics(limit?: number): WebSocketSystemMetrics[] {
    return this.getRecent(this.websocketMetrics, limit);
  }

  /**
   * Retrieves the latest system metric.
   * @returns {SystemMetrics | null} The latest system metric, or null if none exist.
   */
  public getLatestSystemMetric(): SystemMetrics | null {
    return this.getLatest(this.systemMetrics);
  }

  /**
   * Retrieves the latest queue metric.
   * @returns {QueueMetrics | null} The latest queue metric, or null if none exist.
   */
  public getLatestQueueMetric(): QueueMetrics | null {
    return this.getLatest(this.queueMetrics);
  }

  /**
   * Retrieves the latest worker metric.
   * @returns {WorkerSystemMetrics | null} The latest worker metric, or null if none exist.
   */
  public getLatestWorkerMetric(): WorkerSystemMetrics | null {
    return this.getLatest(this.workerMetrics);
  }

  /**
   * Retrieves the latest websocket metric.
   * @returns {WebSocketSystemMetrics | null} The latest websocket metric, or null if none exist.
   */
  public getLatestWebSocketMetric(): WebSocketSystemMetrics | null {
    return this.getLatest(this.websocketMetrics);
  }

  /**
   * Clears all stored metrics.
   */
  public clearAll(): void {
    this.systemMetrics = [];
    this.queueMetrics = [];
    this.workerMetrics = [];
    this.websocketMetrics = [];
  }
}

export const metricsStorage = new MetricsStorage();

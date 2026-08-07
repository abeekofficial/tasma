import * as os from 'os';
import * as v8 from 'v8';
import { performance } from 'perf_hooks';
import { SystemMetrics } from './monitoring.types';
import { AppError } from '@/shared/errors/app-error';

/**
 * Service responsible for collecting system and process metrics.
 */
export class MetricsCollector {
  private lastCpuUsage: NodeJS.CpuUsage;
  private lastCpuTime: number;

  constructor() {
    this.lastCpuUsage = process.cpuUsage();
    this.lastCpuTime = performance.now();
  }

  /**
   * Calculates the approximate CPU usage percentage since the last measurement.
   *
   * @returns The CPU usage percentage.
   */
  private calculateCpuUsage(): number {
    const currentCpuUsage = process.cpuUsage();
    const currentCpuTime = performance.now();

    const userTime = currentCpuUsage.user - this.lastCpuUsage.user;
    const systemTime = currentCpuUsage.system - this.lastCpuUsage.system;

    const elapsedTime = (currentCpuTime - this.lastCpuTime) * 1000; // converted to microseconds
    const totalCpuTime = userTime + systemTime;

    const cpuUsagePercent = elapsedTime > 0 ? (totalCpuTime / elapsedTime) * 100 : 0;

    this.lastCpuUsage = currentCpuUsage;
    this.lastCpuTime = currentCpuTime;

    return cpuUsagePercent;
  }

  /**
   * Measures the current event loop delay.
   *
   * @returns A promise that resolves to the delay in milliseconds.
   */
  private measureEventLoopDelay(): Promise<number> {
    return new Promise((resolve) => {
      const start = performance.now();
      setTimeout(() => {
        resolve(performance.now() - start);
      }, 0);
    });
  }

  /**
   * Collects comprehensive system and process metrics.
   *
   * @returns A promise that resolves to the system metrics.
   * @throws {AppError} If an error occurs during metric collection.
   */
  public async collectSystemMetrics(): Promise<SystemMetrics> {
    try {
      const cpuUsagePercent = this.calculateCpuUsage();
      const eventLoopDelay = await this.measureEventLoopDelay();

      const memory = {
        totalMem: os.totalmem(),
        freeMem: os.freemem(),
        processMemoryUsage: process.memoryUsage(),
      };

      const heap = v8.getHeapStatistics();
      const loadAverage = os.loadavg();
      const uptime = process.uptime();

      return {
        cpuUsagePercent,
        memory,
        heap,
        loadAverage,
        uptime,
        eventLoopDelay,
      } as unknown as SystemMetrics;
    } catch (error) {
      throw new AppError('Failed to collect system metrics', 500, error);
    }
  }
}

export const metricsCollector = new MetricsCollector();

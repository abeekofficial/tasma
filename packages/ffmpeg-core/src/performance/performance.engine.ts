import { ResourceMonitor, SystemResources } from './resource.monitor';
import { BenchmarkService } from './benchmark.service';

export interface JobRequirements {
  maxCpuUsagePercentage?: number;
  minFreeMemoryBytes?: number;
  maxGpuUtilizationPercentage?: number;
  weight?: number; // Concurrency tokens required
}

export interface EngineConfig {
  maxConcurrentJobs: number;
}

export class PerformanceEngine {
  private readonly resourceMonitor: ResourceMonitor;
  private readonly benchmarkService: BenchmarkService;
  private activeTokens: number = 0;
  private readonly maxTokens: number;
  private queue: Array<() => void> = [];

  constructor(
    resourceMonitor: ResourceMonitor,
    benchmarkService: BenchmarkService,
    config: EngineConfig = { maxConcurrentJobs: 4 }
  ) {
    this.resourceMonitor = resourceMonitor;
    this.benchmarkService = benchmarkService;
    this.maxTokens = config.maxConcurrentJobs;
  }

  /**
   * Evaluates current system resource load against job requirements.
   * Returns true if system has enough capacity to handle the job.
   */
  public async canAcceptJob(jobRequirements: JobRequirements): Promise<boolean> {
    const resources: SystemResources = await this.resourceMonitor.poll();

    if (
      jobRequirements.maxCpuUsagePercentage !== undefined &&
      resources.cpuUsagePercentage > jobRequirements.maxCpuUsagePercentage
    ) {
      return false;
    }

    if (
      jobRequirements.minFreeMemoryBytes !== undefined &&
      resources.freeMemoryBytes < jobRequirements.minFreeMemoryBytes
    ) {
      return false;
    }

    if (
      jobRequirements.maxGpuUtilizationPercentage !== undefined &&
      resources.gpuUtilizationPercentage > jobRequirements.maxGpuUtilizationPercentage
    ) {
      return false;
    }

    return true;
  }

  /**
   * Acquires a concurrency token, waiting in queue if limit is reached.
   */
  public async acquireToken(weight: number = 1): Promise<void> {
    return new Promise((resolve) => {
      const tryAcquire = () => {
        if (this.activeTokens + weight <= this.maxTokens) {
          this.activeTokens += weight;
          resolve();
        } else {
          this.queue.push(tryAcquire);
        }
      };

      tryAcquire();
    });
  }

  /**
   * Releases a concurrency token and processes the next task in queue.
   */
  public releaseToken(weight: number = 1): void {
    this.activeTokens = Math.max(0, this.activeTokens - weight);
    this.processQueue();
  }

  private processQueue(): void {
    if (this.queue.length === 0) {
      return;
    }

    const nextTasks = [...this.queue];
    this.queue = [];

    for (const task of nextTasks) {
      task();
    }
  }
}

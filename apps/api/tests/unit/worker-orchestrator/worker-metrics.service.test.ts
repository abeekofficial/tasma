import { describe, it, expect, beforeEach } from 'vitest';
import { WorkerMetricsService } from '../../../src/modules/worker-orchestrator/worker-metrics.service';
import { WorkerRegistry } from '../../../src/modules/worker-orchestrator/worker-registry';

describe('WorkerMetricsService', () => {
  let service: WorkerMetricsService;
  let registry: WorkerRegistry;

  beforeEach(() => {
    registry = new WorkerRegistry();
    service = new WorkerMetricsService(registry);
  });

  it('initializeMetrics sets up default zeroed metrics for a worker', () => {
    service.initializeMetrics('worker-1');

    const metrics = service.getMetrics('worker-1');
    expect(metrics).toBeDefined();
    expect(metrics?.workerId).toBe('worker-1');
    expect(metrics?.totalJobsProcessed).toBe(0);
    expect(metrics?.totalJobsCompleted).toBe(0);
    expect(metrics?.totalJobsFailed).toBe(0);
    expect(metrics?.averageProcessingTimeMs).toBe(0);
    expect(metrics?.lastJobAt).toBeNull();
    expect(metrics?.cpuUsage).toBe(0);
    expect(metrics?.memoryUsageMb).toBe(0);
    expect(metrics?.uptime).toBeGreaterThanOrEqual(0);
  });

  it('recordJobStarted auto-initializes metrics if not present', () => {
    service.recordJobStarted('worker-1');
    const metrics = service.getMetrics('worker-1');
    expect(metrics).toBeDefined();
  });

  it('recordJobCompleted increments counters and updates running average correctly', () => {
    service.initializeMetrics('worker-1');

    service.recordJobCompleted('worker-1', 100);
    let metrics = service.getMetrics('worker-1');
    expect(metrics?.totalJobsProcessed).toBe(1);
    expect(metrics?.totalJobsCompleted).toBe(1);
    expect(metrics?.averageProcessingTimeMs).toBe(100);
    expect(metrics?.lastJobAt).toBeInstanceOf(Date);

    service.recordJobCompleted('worker-1', 200);
    metrics = service.getMetrics('worker-1');
    expect(metrics?.totalJobsProcessed).toBe(2);
    expect(metrics?.totalJobsCompleted).toBe(2);
    expect(metrics?.averageProcessingTimeMs).toBe(150);

    service.recordJobCompleted('worker-1', 600);
    metrics = service.getMetrics('worker-1');
    expect(metrics?.totalJobsProcessed).toBe(3);
    expect(metrics?.totalJobsCompleted).toBe(3);
    expect(metrics?.averageProcessingTimeMs).toBe(300);
  });

  it('recordJobFailed increments processed and failed counters', () => {
    service.initializeMetrics('worker-1');

    service.recordJobFailed('worker-1');
    const metrics = service.getMetrics('worker-1');
    expect(metrics?.totalJobsProcessed).toBe(1);
    expect(metrics?.totalJobsFailed).toBe(1);
    expect(metrics?.totalJobsCompleted).toBe(0);
    expect(metrics?.lastJobAt).toBeInstanceOf(Date);
  });

  it('getMetrics returns undefined for unknown worker', () => {
    expect(service.getMetrics('non-existent')).toBeUndefined();
  });

  it('getAllMetrics returns metrics for all initialized workers', () => {
    service.initializeMetrics('worker-1');
    service.initializeMetrics('worker-2');

    const all = service.getAllMetrics();
    expect(all).toHaveLength(2);
    expect(all.map((m) => m.workerId)).toEqual(['worker-1', 'worker-2']);
  });

  it('getAggregateMetrics computes global metrics and rates accurately across multiple workers', () => {
    service.initializeMetrics('worker-1');
    service.initializeMetrics('worker-2');

    // worker-1: 2 completed (avg 150ms), 1 failed => processed 3
    service.recordJobCompleted('worker-1', 100);
    service.recordJobCompleted('worker-1', 200);
    service.recordJobFailed('worker-1');

    // worker-2: 1 completed (avg 300ms), 0 failed => processed 1
    service.recordJobCompleted('worker-2', 300);

    const agg = service.getAggregateMetrics();
    expect(agg.totalProcessed).toBe(4);
    expect(agg.totalCompleted).toBe(3);
    expect(agg.totalFailed).toBe(1);
    // (100 + 200 + 300) / 3 = 200
    expect(agg.averageProcessingTimeMs).toBe(200);
    expect(agg.successRate).toBe(75);
    expect(agg.failureRate).toBe(25);
    expect(agg.workerCount).toBe(2);
  });

  it('getAggregateMetrics returns zero defaults when no jobs have been processed', () => {
    const agg = service.getAggregateMetrics();
    expect(agg.totalProcessed).toBe(0);
    expect(agg.totalCompleted).toBe(0);
    expect(agg.totalFailed).toBe(0);
    expect(agg.averageProcessingTimeMs).toBe(0);
    expect(agg.successRate).toBe(0);
    expect(agg.failureRate).toBe(0);
    expect(agg.workerCount).toBe(0);
  });

  it('resetMetrics resets counters to zero', () => {
    service.initializeMetrics('worker-1');
    service.recordJobCompleted('worker-1', 100);
    service.resetMetrics('worker-1');

    const metrics = service.getMetrics('worker-1');
    expect(metrics?.totalJobsProcessed).toBe(0);
    expect(metrics?.totalJobsCompleted).toBe(0);
    expect(metrics?.averageProcessingTimeMs).toBe(0);
  });

  it('resetAllMetrics resets metrics for all workers', () => {
    service.initializeMetrics('worker-1');
    service.initializeMetrics('worker-2');
    service.recordJobCompleted('worker-1', 100);
    service.recordJobCompleted('worker-2', 200);

    service.resetAllMetrics();

    expect(service.getMetrics('worker-1')?.totalJobsProcessed).toBe(0);
    expect(service.getMetrics('worker-2')?.totalJobsProcessed).toBe(0);
  });

  it('getUptime returns 0 for non-tracked worker and > 0 for tracked worker', () => {
    expect(service.getUptime('unknown')).toBe(0);

    service.initializeMetrics('worker-1');
    expect(service.getUptime('worker-1')).toBeGreaterThanOrEqual(0);
  });

  it('updateResourceUsage updates cpuUsage and memoryUsageMb', () => {
    service.initializeMetrics('worker-1');
    service.updateResourceUsage('worker-1', 45.5, 512);

    const metrics = service.getMetrics('worker-1');
    expect(metrics?.cpuUsage).toBe(45.5);
    expect(metrics?.memoryUsageMb).toBe(512);
  });
});

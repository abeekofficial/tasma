import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { systemMonitor } from '@/modules/monitoring/system-monitor';
import { workerMonitor } from '@/modules/monitoring/worker-monitor';
import { metricsCollector } from '@/modules/monitoring/metrics-collector';
import { metricsStorage } from '@/modules/monitoring/metrics-storage';
import { alertManager } from '@/modules/monitoring/alert-manager';
import { metricsAggregator } from '@/modules/monitoring/metrics-aggregator';
import { workerManager } from '@/modules/worker-orchestrator/worker-manager';
import { SystemMetrics } from '@/modules/monitoring/monitoring.types';

describe('Monitoring Integration Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    metricsStorage.clearAll();
    alertManager.clearAlerts();
    
    // Clear mock calls
    vi.restoreAllMocks();
    
    // Stop monitors in case they are running
    systemMonitor.stop();
    workerMonitor.stop();
  });

  afterEach(() => {
    systemMonitor.stop();
    workerMonitor.stop();
    vi.useRealTimers();
  });

  describe('System Metrics Collection & Alert Threshold Evaluation', () => {
    it('should collect metrics and trigger alerts when thresholds are exceeded', async () => {
      // 1. Register alert definitions
      alertManager.registerDefinition({
        id: 'high-cpu',
        name: 'High CPU Alert',
        type: 'system',
        severity: 'critical',
        condition: 'CPU usage > 90%',
        threshold: 90,
      });
      alertManager.registerDefinition({
        id: 'high-memory',
        name: 'High Memory Alert',
        type: 'system',
        severity: 'warning',
        condition: 'Memory usage > 80%',
        threshold: 80, // Note: systemMonitor calculates this as (heapUsedMb / heapTotalMb) * 100
      });

      // 2. Mock metrics collector to return high CPU and Memory
      const mockMetrics: SystemMetrics = {
        timestamp: new Date(),
        cpuUsagePercent: 95, // Above 90
        memoryUsageMb: 100,
        memoryTotalMb: 1000,
        freeMemoryMb: 900,
        heapTotalMb: 100,
        heapUsedMb: 85, // 85%, above 80
        eventLoopDelayMs: 10,
        uptimeSeconds: 100,
        loadAverage: [1, 1, 1],
      };
      
      vi.spyOn(metricsCollector, 'collectSystemMetrics').mockResolvedValue(mockMetrics);

      // 3. Start system monitor and wait for collection
      systemMonitor.start(1000);
      
      // Advance time to trigger interval
      await vi.advanceTimersByTimeAsync(1000);

      // 4. Verify metrics were stored
      const recentMetrics = metricsStorage.getRecentSystemMetrics();
      expect(recentMetrics.length).toBeGreaterThan(0);
      expect(recentMetrics[0].cpuUsagePercent).toBe(95);

      // 5. Verify alerts were triggered
      const activeAlerts = alertManager.getActiveAlerts();
      expect(activeAlerts.length).toBe(2);

      const cpuAlert = activeAlerts.find(a => a.definitionId === 'high-cpu');
      expect(cpuAlert).toBeDefined();
      expect(cpuAlert?.triggerValue).toBe(95);
      
      const memAlert = activeAlerts.find(a => a.definitionId === 'high-memory');
      expect(memAlert).toBeDefined();
      expect(memAlert?.triggerValue).toBe(85);
    });
  });

  describe('Worker Metrics Aggregation', () => {
    it('should collect worker metrics and aggregate them correctly', () => {
      // 1. Mock workerManager dependencies
      vi.spyOn(workerManager, 'getAllWorkers').mockReturnValue([
        { id: 'w1', state: 'BUSY', lastHeartbeat: new Date() } as any,
        { id: 'w2', state: 'IDLE', lastHeartbeat: new Date() } as any,
        { id: 'w3', state: 'OFFLINE', lastHeartbeat: new Date(Date.now() - 10000) } as any,
      ]);

      vi.spyOn(workerManager, 'getAllMetrics').mockReturnValue([
        { workerId: 'w1', cpuUsage: 60, memoryUsageMb: 120 } as any,
        { workerId: 'w2', cpuUsage: 20, memoryUsageMb: 80 } as any,
      ]);

      vi.spyOn(workerManager, 'getAggregateMetrics').mockReturnValue({
        totalProcessed: 100,
        totalCompleted: 95,
        totalFailed: 5,
        averageProcessingTimeMs: 250,
        successRate: 95,
        failureRate: 5,
        workerCount: 3,
      });

      // 2. Start worker monitor
      workerMonitor.start(1000);
      
      // Advance timers by 1 second to trigger one collection
      vi.advanceTimersByTime(1000);

      // 3. Verify storage has the latest metrics
      const storedMetrics = metricsStorage.getRecentWorkerMetrics();
      expect(storedMetrics.length).toBe(1);
      
      const latestMetric = storedMetrics[0];
      expect(latestMetric.totalWorkers).toBe(3);
      expect(latestMetric.busyWorkers).toBe(1);
      expect(latestMetric.idleWorkers).toBe(1);
      expect(latestMetric.offlineWorkers).toBe(1);
      
      // (60 + 20) / 2 = 40
      expect(latestMetric.averageCpuPerWorkerPercent).toBe(40);
      // (120 + 80) / 2 = 100
      expect(latestMetric.averageMemoryPerWorkerMb).toBe(100);

      // Advance time for a second collection with different mocked values
      vi.spyOn(workerManager, 'getAllMetrics').mockReturnValue([
        { workerId: 'w1', cpuUsage: 80, memoryUsageMb: 160 } as any,
        { workerId: 'w2', cpuUsage: 40, memoryUsageMb: 120 } as any,
      ]);
      
      vi.advanceTimersByTime(1000);

      expect(metricsStorage.getRecentWorkerMetrics().length).toBe(2);

      // 4. Test Aggregation
      // getAggregateWorkerMetrics averages the metrics from the time window.
      // previous avg cpu = 40. new avg cpu = 60. (40 + 60) / 2 = 50.
      const aggregated = metricsAggregator.getAggregateWorkerMetrics(5); // 5 minutes window
      expect(aggregated.averageCpuPerWorkerPercent).toBe(50);
      expect(aggregated.averageMemoryPerWorkerMb).toBe(120); // (100 + 140)/2 = 120
      expect(aggregated.totalWorkers).toBe(3);
    });
  });
});

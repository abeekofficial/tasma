import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WorkerManager } from '@/modules/worker-orchestrator/worker-manager';
import { WorkerEventBus } from '@/modules/worker-orchestrator/worker-event-bus';
import { WorkerRegistry } from '@/modules/worker-orchestrator/worker-registry';
import { WorkerPool } from '@/modules/worker-orchestrator/worker-pool';
import { WorkerScheduler } from '@/modules/worker-orchestrator/worker-scheduler';
import { WorkerFactory } from '@/modules/worker-orchestrator/worker-factory';
import { WorkerLifecycleService } from '@/modules/worker-orchestrator/worker-lifecycle.service';
import { WorkerHeartbeatService } from '@/modules/worker-orchestrator/worker-heartbeat.service';
import { WorkerRecoveryService } from '@/modules/worker-orchestrator/worker-recovery.service';
import { WorkerHealthService } from '@/modules/worker-orchestrator/worker-health.service';
import { WorkerMetricsService } from '@/modules/worker-orchestrator/worker-metrics.service';

describe('WorkerOrchestrator Integration', () => {
  let eventBus: WorkerEventBus;
  let registry: WorkerRegistry;
  let pool: WorkerPool;
  let scheduler: WorkerScheduler;
  let factory: WorkerFactory;
  let lifecycle: WorkerLifecycleService;
  let heartbeat: WorkerHeartbeatService;
  let recovery: WorkerRecoveryService;
  let health: WorkerHealthService;
  let metrics: WorkerMetricsService;
  let manager: WorkerManager;

  beforeEach(() => {
    vi.useFakeTimers();

    eventBus = new WorkerEventBus();
    registry = new WorkerRegistry(eventBus);
    pool = new WorkerPool(registry, eventBus);
    scheduler = new WorkerScheduler(pool, registry, eventBus);
    factory = new WorkerFactory(registry, eventBus);
    lifecycle = new WorkerLifecycleService(registry, pool, scheduler, eventBus);
    heartbeat = new WorkerHeartbeatService(registry, eventBus);
    recovery = new WorkerRecoveryService(registry, pool, scheduler, lifecycle, eventBus);
    health = new WorkerHealthService(registry, pool, heartbeat, scheduler);
    metrics = new WorkerMetricsService(registry);

    manager = new WorkerManager(
      registry,
      pool,
      scheduler,
      factory,
      lifecycle,
      heartbeat,
      recovery,
      health,
      metrics,
      eventBus
    );

    manager.initialize();
  });

  afterEach(async () => {
    await manager.shutdown();
    vi.useRealTimers();
  });

  describe('Worker Registration', () => {
    it('should register a new worker and initialize its metrics', () => {
      const worker = manager.createWorker({ name: 'test-worker', capabilities: ['PREVIEW'] });
      
      expect(worker.id).toBeDefined();
      expect(worker.name).toBe('test-worker');
      expect(worker.state).toBe('IDLE');
      
      const metricsData = manager.getWorkerMetrics(worker.id);
      expect(metricsData).toBeDefined();
      expect(metricsData?.workerId).toBe(worker.id);
      
      const allWorkers = manager.getAllWorkers();
      expect(allWorkers.length).toBe(1);
    });

    it('should unregister a worker and remove it from registry', () => {
      const worker = manager.createWorker({ name: 'test-worker' });
      expect(manager.getWorkerCount()).toBe(1);

      manager.removeWorker(worker.id);
      expect(manager.getWorkerCount()).toBe(0);
      expect(manager.getWorker(worker.id)).toBeUndefined();
    });
  });

  describe('Worker Assignment', () => {
    it('should assign a job to an available worker with matching capability', () => {
      const worker = manager.createWorker({ capabilities: ['EXPORT'] });
      
      // Request assignment
      const assignment = manager.assignJob('job-1', 'EXPORT', 'HIGH');
      
      expect(assignment).toBeDefined();
      expect(assignment?.jobId).toBe('job-1');
      expect(assignment?.workerId).toBe(worker.id);
      
      // Worker state should reflect the lock
      const updatedWorker = manager.getWorker(worker.id);
      expect(updatedWorker?.state).toBe('BUSY');
      expect(updatedWorker?.currentLoad).toBe(1);
      
      // Active assignments should have the job
      expect(manager.getActiveAssignments().length).toBe(1);
    });

    it('should queue the job if no worker is available', () => {
      manager.createWorker({ capabilities: ['PREVIEW'] });
      
      // Request assignment for a capability no worker has
      const assignment = manager.assignJob('job-1', 'EXPORT', 'HIGH');
      
      expect(assignment).toBeNull();
      expect(manager.getPendingJobCount()).toBe(1);
    });
    
    it('should release a worker when job completes', () => {
      const worker = manager.createWorker({ capabilities: ['EXPORT'] });
      manager.assignJob('job-1', 'EXPORT', 'NORMAL');
      
      let updatedWorker = manager.getWorker(worker.id);
      expect(updatedWorker?.state).toBe('BUSY');
      
      // Complete the job
      manager.completeJob('job-1', 1500);
      
      updatedWorker = manager.getWorker(worker.id);
      expect(updatedWorker?.state).toBe('IDLE');
      expect(updatedWorker?.currentLoad).toBe(0);
      
      // Metrics should be updated
      const metricsData = manager.getWorkerMetrics(worker.id);
      expect(metricsData?.totalJobsCompleted).toBe(1);
      expect(metricsData?.averageProcessingTimeMs).toBe(1500);
    });
  });

  describe('Heartbeat Monitoring', () => {
    it('should detect a stale worker on missed heartbeats', () => {
      const worker = manager.createWorker();
      manager.setHeartbeatTimeout(worker.id, 1000); // Set short timeout for test
      
      // Start worker
      manager.startWorker(worker.id);
      
      // Wait for timeout to expire
      vi.advanceTimersByTime(2000);
      
      // Perform maintenance checks
      manager.performMaintenance();
      
      // The recovery service should mark the worker as FAILED or handle it
      const updatedWorker = manager.getWorker(worker.id);
      expect(updatedWorker?.state).toBe('IDLE'); // Recovered back to IDLE by recoverStaleWorkers
    });
    
    it('should update lastHeartbeat when heartbeat is recorded', () => {
      const worker = manager.createWorker();
      const initialHeartbeat = worker.lastHeartbeat.getTime();
      
      vi.advanceTimersByTime(5000);
      
      manager.recordHeartbeat(worker.id);
      
      const updatedWorker = manager.getWorker(worker.id);
      expect(updatedWorker?.lastHeartbeat.getTime()).toBeGreaterThan(initialHeartbeat);
    });
  });

  describe('Graceful Shutdown', () => {
    it('should shut down a worker and change state to OFFLINE', async () => {
      const worker = manager.createWorker();
      
      const updatedWorker = await manager.gracefulShutdown(worker.id);
      expect(updatedWorker.state).toBe('OFFLINE');
    });

    it('should run shutdown callbacks during graceful shutdown', async () => {
      const worker = manager.createWorker();
      const mockCallback = vi.fn().mockResolvedValue(undefined);
      
      lifecycle.registerShutdownCallback(worker.id, mockCallback);
      
      await manager.gracefulShutdown(worker.id);
      
      expect(mockCallback).toHaveBeenCalled();
    });
    
    it('should shut down all active workers', async () => {
      manager.createWorkerPool(3);
      
      const count = await manager.shutdown();
      
      expect(count).toBe(3);
      const workers = manager.getAllWorkers();
      workers.forEach(w => expect(w.state).toBe('OFFLINE'));
    });
  });
});

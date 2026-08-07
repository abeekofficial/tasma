import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  WorkerHeartbeatService,
  DEFAULT_HEARTBEAT_TIMEOUT_MS,
  DEFAULT_CHECK_INTERVAL_MS,
} from '../../../src/modules/worker-orchestrator/worker-heartbeat.service';
import { WorkerRegistry } from '../../../src/modules/worker-orchestrator/worker-registry';
import { WorkerEventBus } from '../../../src/modules/worker-orchestrator/worker-event-bus';
import { AppError } from '@/shared/errors/app-error';

describe('WorkerHeartbeatService', () => {
  let registry: WorkerRegistry;
  let eventBus: WorkerEventBus;
  let service: WorkerHeartbeatService;

  beforeEach(() => {
    vi.useFakeTimers();
    eventBus = new WorkerEventBus();
    registry = new WorkerRegistry(eventBus);
    service = new WorkerHeartbeatService(registry, eventBus, 1000);
  });

  afterEach(() => {
    service.stopMonitoring();
    vi.useRealTimers();
  });

  describe('recordHeartbeat', () => {
    it('updates worker heartbeat in registry and emits WORKER_HEARTBEAT', () => {
      const worker = registry.register({ name: 'worker-1', capabilities: ['PREVIEW'] });
      const emitSpy = vi.spyOn(eventBus, 'emit');

      vi.advanceTimersByTime(5000);
      service.recordHeartbeat(worker.id);

      const updated = registry.getWorker(worker.id);
      expect(updated?.lastHeartbeat.getTime()).toBeGreaterThan(worker.registeredAt.getTime());
      expect(emitSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'WORKER_HEARTBEAT',
          workerId: worker.id,
        })
      );
    });

    it('throws AppError notFound if worker does not exist', () => {
      expect(() => service.recordHeartbeat('non-existent')).toThrow(AppError);
    });
  });

  describe('setHeartbeatTimeout & getHeartbeatTimeout', () => {
    it('returns default timeout when not explicitly set', () => {
      expect(service.getHeartbeatTimeout('w-1')).toBe(DEFAULT_HEARTBEAT_TIMEOUT_MS);
    });

    it('returns configured timeout when set', () => {
      service.setHeartbeatTimeout('w-1', 45000);
      expect(service.getHeartbeatTimeout('w-1')).toBe(45000);
    });
  });

  describe('isHeartbeatExpired', () => {
    it('returns false for non-existent worker', () => {
      expect(service.isHeartbeatExpired('unknown')).toBe(false);
    });

    it('returns false when heartbeat is within timeout', () => {
      const worker = registry.register({ name: 'worker-1', capabilities: [] });
      expect(service.isHeartbeatExpired(worker.id)).toBe(false);
    });

    it('returns true when heartbeat exceeds timeout', () => {
      const worker = registry.register({ name: 'worker-1', capabilities: [] });
      service.setHeartbeatTimeout(worker.id, 10000);
      vi.advanceTimersByTime(10001);
      expect(service.isHeartbeatExpired(worker.id)).toBe(true);
    });
  });

  describe('getTimeSinceLastHeartbeat', () => {
    it('returns elapsed time in ms', () => {
      const worker = registry.register({ name: 'worker-1', capabilities: [] });
      vi.advanceTimersByTime(5000);
      expect(service.getTimeSinceLastHeartbeat(worker.id)).toBe(5000);
    });

    it('throws AppError notFound if worker does not exist', () => {
      expect(() => service.getTimeSinceLastHeartbeat('invalid')).toThrow(AppError);
    });
  });

  describe('startMonitoring & stopMonitoring', () => {
    it('starts monitoring interval and checks heartbeats periodically', () => {
      const worker = registry.register({ name: 'worker-1', capabilities: [] });
      service.setHeartbeatTimeout(worker.id, 5000);

      const emitSpy = vi.spyOn(eventBus, 'emit');
      service.startMonitoring();

      vi.advanceTimersByTime(6000); // Trigger check cycle

      expect(emitSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'WORKER_HEARTBEAT_MISSED',
          workerId: worker.id,
        })
      );
    });

    it('does not create multiple timers if startMonitoring is called repeatedly', () => {
      service.startMonitoring();
      service.startMonitoring();
      service.stopMonitoring();
    });
  });

  describe('checkAllHeartbeats behavior', () => {
    it('skips workers in OFFLINE or FAILED state', () => {
      const offlineWorker = registry.register({ name: 'offline-w', capabilities: [] });
      registry.updateState(offlineWorker.id, 'OFFLINE');

      const failedWorker = registry.register({ name: 'failed-w', capabilities: [] });
      registry.updateState(failedWorker.id, 'FAILED');

      service.setHeartbeatTimeout(offlineWorker.id, 5000);
      service.setHeartbeatTimeout(failedWorker.id, 5000);

      const emitSpy = vi.spyOn(eventBus, 'emit');
      service.startMonitoring();
      vi.advanceTimersByTime(6000);

      expect(emitSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: 'WORKER_HEARTBEAT_MISSED' })
      );
    });

    it('emits WORKER_TIMEOUT when heartbeat age exceeds 2x timeout', () => {
      const worker = registry.register({ name: 'worker-1', capabilities: [] });
      service.setHeartbeatTimeout(worker.id, 5000);

      const emitSpy = vi.spyOn(eventBus, 'emit');
      service.startMonitoring();

      vi.advanceTimersByTime(11000); // > 2 * 5000ms

      expect(emitSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'WORKER_TIMEOUT',
          workerId: worker.id,
        })
      );
    });
  });

  describe('getStaleWorkers', () => {
    it('returns only workers with expired heartbeats', () => {
      const w1 = registry.register({ name: 'w1', capabilities: [] });
      const w2 = registry.register({ name: 'w2', capabilities: [] });

      service.setHeartbeatTimeout(w1.id, 5000);
      service.setHeartbeatTimeout(w2.id, 20000);

      vi.advanceTimersByTime(10000);

      const stale = service.getStaleWorkers();
      expect(stale).toHaveLength(1);
      expect(stale[0].id).toBe(w1.id);
    });
  });
});

import { AppError } from '@/shared/errors/app-error';
import { workerEventBus, WorkerEventBus } from './worker-event-bus';
import { workerRegistry, WorkerRegistry } from './worker-registry';
import { WorkerConfig, WorkerInfo } from './worker.types';

const DEFAULT_CAPABILITIES = ['PREVIEW', 'EXPORT', 'THUMBNAIL', 'SOCIAL_PUBLISH'];
const DEFAULT_MAX_CONCURRENCY = 1;
const DEFAULT_HEARTBEAT_INTERVAL_MS = 30000;
const DEFAULT_HEARTBEAT_TIMEOUT_MS = 90000;

/**
 * WorkerFactory creates and configures worker instances with sensible defaults,
 * supports creating specialized workers and worker pools, and registers them
 * with the WorkerRegistry.
 */
export class WorkerFactory {
  private readonly registry: WorkerRegistry;
  private readonly eventBus: WorkerEventBus;
  private workerCounter: number;

  /**
   * Creates a new instance of WorkerFactory.
   *
   * @param registry - WorkerRegistry instance (defaults to singleton workerRegistry)
   * @param eventBus - WorkerEventBus instance (defaults to singleton workerEventBus)
   */
  constructor(
    registry: WorkerRegistry = workerRegistry,
    eventBus: WorkerEventBus = workerEventBus
  ) {
    this.registry = registry;
    this.eventBus = eventBus;
    this.workerCounter = 0;
  }

  /**
   * Creates a new worker instance, filling in default values for name, capabilities,
   * maxConcurrency, heartbeat intervals, and metadata, then registering it in the registry.
   *
   * @param config - Optional partial worker configuration
   * @returns Newly created and registered WorkerInfo object
   */
  public createWorker(config: Partial<WorkerConfig> = {}): WorkerInfo {
    const name = config.name ?? `worker-${this.workerCounter++}`;
    const capabilities =
      config.capabilities && config.capabilities.length > 0
        ? [...config.capabilities]
        : [...DEFAULT_CAPABILITIES];
    const maxConcurrency = config.maxConcurrency ?? DEFAULT_MAX_CONCURRENCY;
    const heartbeatIntervalMs = config.heartbeatIntervalMs ?? DEFAULT_HEARTBEAT_INTERVAL_MS;
    const heartbeatTimeoutMs = config.heartbeatTimeoutMs ?? DEFAULT_HEARTBEAT_TIMEOUT_MS;
    const metadata = config.metadata ? { ...config.metadata } : {};

    const fullConfig: WorkerConfig = {
      name,
      capabilities,
      maxConcurrency,
      heartbeatIntervalMs,
      heartbeatTimeoutMs,
      metadata,
    };

    return this.registry.register(fullConfig);
  }

  /**
   * Creates a pool of workers with sequential indexed names (e.g. `${baseName}-${i}`).
   *
   * @param count - Number of worker instances to create
   * @param baseConfig - Optional base configuration to apply to all workers in pool
   * @returns Array of newly created WorkerInfo objects
   * @throws AppError 400 if count is negative or invalid
   */
  public createWorkerPool(count: number, baseConfig: Partial<WorkerConfig> = {}): WorkerInfo[] {
    if (count < 0 || !Number.isInteger(count)) {
      throw AppError.badRequest('Pool count must be a non-negative integer');
    }

    const baseName = baseConfig.name ?? 'worker';
    const workers: WorkerInfo[] = [];

    for (let i = 0; i < count; i++) {
      const worker = this.createWorker({
        ...baseConfig,
        name: `${baseName}-${i}`,
      });
      workers.push(worker);
    }

    return workers;
  }

  /**
   * Creates a specialized worker configured with only a single capability.
   * Auto-generates a name formatted like 'specialized-{capability}-{counter}' if name is not provided.
   *
   * @param capability - The single capability string assigned to the worker
   * @param config - Optional partial worker configuration
   * @returns Newly created WorkerInfo object
   * @throws AppError 400 if capability is missing or empty
   */
  public createSpecializedWorker(
    capability: string,
    config: Partial<WorkerConfig> = {}
  ): WorkerInfo {
    if (!capability || capability.trim() === '') {
      throw AppError.badRequest('Worker capability must be a non-empty string');
    }

    const normalizedCapability = capability.trim();
    const defaultName = `specialized-${normalizedCapability.toLowerCase()}-${this.workerCounter++}`;
    const name = config.name ?? defaultName;

    return this.createWorker({
      ...config,
      name,
      capabilities: [normalizedCapability],
    });
  }

  /**
   * Returns a complete, fully-populated WorkerConfig object filled with default values.
   *
   * @returns Required<WorkerConfig> object containing default values
   */
  public getDefaultConfig(): Required<WorkerConfig> {
    return {
      name: 'worker-default',
      capabilities: [...DEFAULT_CAPABILITIES],
      maxConcurrency: DEFAULT_MAX_CONCURRENCY,
      heartbeatIntervalMs: DEFAULT_HEARTBEAT_INTERVAL_MS,
      heartbeatTimeoutMs: DEFAULT_HEARTBEAT_TIMEOUT_MS,
      metadata: {},
    };
  }
}

export const workerFactory = new WorkerFactory();

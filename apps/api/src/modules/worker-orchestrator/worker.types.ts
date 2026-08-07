export type WorkerState = 'IDLE' | 'BUSY' | 'PAUSED' | 'OFFLINE' | 'RESTARTING' | 'FAILED' | 'STOPPING';

export interface WorkerInfo {
  id: string;
  name: string;
  state: WorkerState;
  capabilities: string[];
  maxConcurrency: number;
  currentLoad: number;
  currentJobId: string | null;
  lastHeartbeat: Date;
  registeredAt: Date;
  metadata: Record<string, unknown>;
}

export interface WorkerConfig {
  name: string;
  capabilities: string[];
  maxConcurrency?: number;
  heartbeatIntervalMs?: number;
  heartbeatTimeoutMs?: number;
  metadata?: Record<string, unknown>;
}

export interface WorkerMetrics {
  workerId: string;
  totalJobsProcessed: number;
  totalJobsFailed: number;
  totalJobsCompleted: number;
  averageProcessingTimeMs: number;
  uptime: number;
  lastJobAt: Date | null;
  cpuUsage: number;
  memoryUsageMb: number;
}

export interface JobAssignment {
  jobId: string;
  workerId: string;
  assignedAt: Date;
  priority: string;
  type: string;
}

export interface WorkerEvent {
  type: WorkerEventType;
  workerId: string;
  timestamp: Date;
  data?: Record<string, unknown>;
}

export type WorkerEventType =
  | 'WORKER_REGISTERED'
  | 'WORKER_UNREGISTERED'
  | 'WORKER_STATE_CHANGED'
  | 'WORKER_HEARTBEAT'
  | 'WORKER_HEARTBEAT_MISSED'
  | 'WORKER_TIMEOUT'
  | 'WORKER_RECOVERED'
  | 'WORKER_FAILED'
  | 'WORKER_RESTARTING'
  | 'WORKER_STOPPING'
  | 'JOB_ASSIGNED'
  | 'JOB_CLAIMED'
  | 'JOB_RELEASED'
  | 'JOB_REQUEUED'
  | 'JOB_COMPLETED'
  | 'JOB_FAILED';

export interface WorkerLease {
  workerId: string;
  jobId: string;
  leasedAt: Date;
  expiresAt: Date;
  renewed: number;
}

export interface WorkerHealthReport {
  workerId: string;
  state: WorkerState;
  healthy: boolean;
  lastHeartbeat: Date;
  heartbeatAge: number;
  currentLoad: number;
  maxConcurrency: number;
  issues: string[];
}

export interface PoolStatus {
  totalWorkers: number;
  idleWorkers: number;
  busyWorkers: number;
  pausedWorkers: number;
  offlineWorkers: number;
  failedWorkers: number;
  totalCapacity: number;
  currentLoad: number;
  utilizationPercent: number;
}

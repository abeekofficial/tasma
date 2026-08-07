export interface SystemMetrics {
  timestamp: Date;
  cpuUsagePercent: number;
  memoryUsageMb: number;
  memoryTotalMb: number;
  freeMemoryMb: number;
  heapTotalMb: number;
  heapUsedMb: number;
  eventLoopDelayMs: number;
  uptimeSeconds: number;
  loadAverage: [number, number, number];
}

export interface QueueMetrics {
  timestamp: Date;
  queuedJobs: number;
  runningJobs: number;
  completedJobs: number;
  failedJobs: number;
  cancelledJobs: number;
  averageQueueTimeMs: number;
  averageRenderTimeMs: number;
  retryCount: number;
  workerUtilizationPercent: number;
  queueThroughputPerMinute: number;
}

export interface WorkerSystemMetrics {
  timestamp: Date;
  totalWorkers: number;
  idleWorkers: number;
  busyWorkers: number;
  offlineWorkers: number;
  failedWorkers: number;
  averageHeartbeatLatencyMs: number;
  averageCpuPerWorkerPercent: number;
  averageMemoryPerWorkerMb: number;
  totalRestartCount: number;
  totalRecoveryCount: number;
}

export interface WebSocketSystemMetrics {
  timestamp: Date;
  connectedClients: number;
  disconnectedClients: number;
  reconnects: number;
  messagesSent: number;
  messagesReceived: number;
  droppedConnections: number;
  broadcastRatePerSecond: number;
  averageLatencyMs: number;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  components: {
    database: { status: 'up' | 'down'; latencyMs: number; message?: string };
    workerOrchestrator: { status: 'up' | 'down'; activeWorkers: number; message?: string };
    renderQueue: { status: 'up' | 'down'; pendingJobs: number; message?: string };
    websocket: { status: 'up' | 'down'; connectedClients: number; message?: string };
  };
}

export interface AlertDefinition {
  id: string;
  name: string;
  type: 'system' | 'queue' | 'worker' | 'websocket';
  severity: 'info' | 'warning' | 'error' | 'critical';
  condition: string; // Text description
  threshold: number;
  cooldownMs?: number;
}

export interface ActiveAlert {
  id: string;
  definitionId: string;
  name: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  triggerValue: number;
  triggeredAt: Date;
  resolvedAt?: Date;
}

export interface DiagnosticSnapshot {
  snapshotId: string;
  timestamp: Date;
  system: SystemMetrics;
  queue: QueueMetrics;
  workers: WorkerSystemMetrics;
  websockets: WebSocketSystemMetrics;
  health: HealthStatus;
  activeAlerts: ActiveAlert[];
}

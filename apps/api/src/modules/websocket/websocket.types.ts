import { WorkerState } from '../worker-orchestrator/worker.types';

export interface WebSocketClient {
  id: string;
  userId: string;
  sessionId: string;
  workspaceId?: string;
  roles: string[];
  connectedAt: Date;
  lastPing: Date;
  lastPong: Date;
  status: 'CONNECTED' | 'IDLE' | 'DISCONNECTED';
  ipAddress?: string;
  userAgent?: string;
}

export interface ClientSession {
  sessionId: string;
  userId: string;
  workspaceId?: string;
  deviceType?: string;
  activeConnections: string[];
  lastActive: Date;
}

export type ChannelType = 
  | 'user' 
  | 'workspace' 
  | 'project' 
  | 'job' 
  | 'worker' 
  | 'admin';

export interface ChannelSubscription {
  clientId: string;
  channelId: string;
  channelType: ChannelType;
  subscribedAt: Date;
}

export type ServerToClientEventType = 
  // Worker Events
  | 'WORKER_REGISTERED'
  | 'WORKER_REMOVED'
  | 'WORKER_ONLINE'
  | 'WORKER_OFFLINE'
  | 'WORKER_RESTARTED'
  | 'WORKER_FAILED'
  | 'WORKER_RECOVERED'
  // Queue Events
  | 'QUEUE_UPDATED'
  | 'QUEUE_PAUSED'
  | 'QUEUE_RESUMED'
  // Job Events
  | 'JOB_CREATED'
  | 'JOB_STARTED'
  | 'JOB_PROGRESS'
  | 'JOB_PAUSED'
  | 'JOB_RESUMED'
  | 'JOB_COMPLETED'
  | 'JOB_FAILED'
  | 'JOB_CANCELLED'
  | 'JOB_RETRIED'
  // Render Events
  | 'RENDER_STARTED'
  | 'RENDER_COMPLETED'
  | 'RENDER_FAILED'
  // System Events
  | 'SYSTEM_NOTIFICATION'
  | 'ERROR'
  | 'PONG';

export type ClientToServerEventType = 
  | 'SUBSCRIBE'
  | 'UNSUBSCRIBE'
  | 'PING'
  | 'AUTHENTICATE';

export interface WebSocketMessage<T = unknown> {
  type: ServerToClientEventType | ClientToServerEventType;
  payload: T;
  timestamp?: string;
  id?: string;
}

export interface JobProgressPayload {
  jobId: string;
  projectId?: string;
  progress: number; // 0-100
  etaMs?: number;
  currentStage: string;
  completedPercent: number;
  frameProgress?: {
    current: number;
    total: number;
  };
  fps?: number;
  remainingTimeMs?: number;
  workerId?: string;
  queuePosition?: number;
}

export interface SystemNotificationPayload {
  level: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface WorkerUpdatePayload {
  workerId: string;
  state: WorkerState;
  capabilities: string[];
  currentLoad: number;
  maxConcurrency: number;
}

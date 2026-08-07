import { workerEventBus } from '../worker-orchestrator/worker-event-bus';
import { WorkerEvent, WorkerEventType } from '../worker-orchestrator/worker.types';
import { progressBroadcaster, ProgressBroadcaster } from './progress-broadcaster';
import { notificationDispatcher, NotificationDispatcher } from './notification-dispatcher';
import { subscriptionManager, SubscriptionManager } from './subscription-manager';
import { connectionManager, ConnectionManager } from './connection-manager';
import { AppError } from '@/shared/errors/app-error';

/**
 * Dispatches events from the WorkerEventBus to connected WebSocket clients.
 */
export class EventDispatcher {
  constructor(
    private readonly workerBus = workerEventBus,
    private readonly progBroadcaster: ProgressBroadcaster = progressBroadcaster,
    private readonly notifDispatcher: NotificationDispatcher = notificationDispatcher,
    private readonly subManager: SubscriptionManager = subscriptionManager,
    private readonly connManager: ConnectionManager = connectionManager
  ) {}

  /**
   * Initializes the event dispatcher by registering listeners on the worker event bus.
   */
  public initialize(): void {
    const relevantEvents: WorkerEventType[] = [
      'WORKER_REGISTERED',
      'WORKER_UNREGISTERED',
      'WORKER_STATE_CHANGED',
      'WORKER_FAILED',
      'JOB_ASSIGNED',
      'JOB_CLAIMED',
      'JOB_COMPLETED',
      'JOB_FAILED'
    ];

    for (const eventType of relevantEvents) {
      this.workerBus.on(eventType, (event) => this.handleEvent(event));
    }

    // Register handlers for events that may not be in WorkerEventType strictly yet
    const extraEvents = ['JOB_STARTED', 'JOB_PROGRESS'];
    for (const eventType of extraEvents) {
      this.workerBus.on(eventType as WorkerEventType, (event) => this.handleEvent(event));
    }
  }

  /**
   * Handles an incoming worker event.
   * 
   * @param event The event emitted by the worker event bus.
   */
  private handleEvent(event: WorkerEvent): void {
    const type = event.type as string;

    // Route job-related events to the progress broadcaster
    const jobEvents = ['JOB_STARTED', 'JOB_PROGRESS', 'JOB_ASSIGNED', 'JOB_CLAIMED', 'JOB_COMPLETED', 'JOB_FAILED'];
    if (jobEvents.includes(type)) {
      const payload: any = {
        jobId: (event.data?.jobId || event.data?.id || 'unknown') as string,
        status: type,
        workerId: event.workerId,
        ...event.data
      };
      this.progBroadcaster.broadcastProgress(payload);
    }

    // Route worker failures to admin notifications
    if (type === 'WORKER_FAILED') {
      const notifPayload: any = {
        title: 'Worker Failure',
        message: `Worker ${event.workerId} encountered a failure.`,
        level: 'error',
        type: 'WORKER_FAILED',
        timestamp: event.timestamp,
        ...event.data
      };
      this.notifDispatcher.broadcastToAdmin(notifPayload);
    }

    // Broadcast all general events to the admin system channel
    this.broadcastEvent(event, 'admin:system');
  }

  /**
   * Broadcasts a raw worker event to a specific channel.
   * 
   * @param event The worker event to broadcast.
   * @param channelName The channel to broadcast to.
   */
  public broadcastEvent(event: WorkerEvent, channelName: string): void {
    try {
      const clients = this.subManager.getChannelClients(channelName);
      if (!clients || clients.length === 0) {
        return;
      }

      const payloadString = JSON.stringify({
        type: 'WORKER_EVENT',
        payload: event,
        timestamp: new Date().toISOString()
      });

      for (const clientId of clients) {
        const conn = this.connManager.getConnection(clientId);
        if (conn && conn.ws) {
          // Send if readyState is OPEN (1)
          if (typeof conn.ws.readyState === 'number') {
            if (conn.ws.readyState === 1) {
              conn.ws.send(payloadString);
            }
          } else {
            conn.ws.send(payloadString);
          }
        }
      }
    } catch (error) {
      throw new AppError('BROADCAST_ERROR', 'Failed to broadcast event to channel: ' + channelName);
    }
  }
}

export const eventDispatcher = new EventDispatcher();

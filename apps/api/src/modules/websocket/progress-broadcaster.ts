import { JobProgressPayload, ServerToClientEventType, WebSocketMessage } from './websocket.types';
import { subscriptionManager, SubscriptionManager } from './subscription-manager';
import { connectionManager, ConnectionManager } from './connection-manager';

/**
 * Service for broadcasting job progress updates to connected WebSocket clients.
 */
export class ProgressBroadcaster {
  /**
   * Creates an instance of ProgressBroadcaster.
   * 
   * @param subscriptionManager - The subscription manager instance.
   * @param connectionManager - The connection manager instance.
   */
  constructor(
    private readonly subscriptionManager: SubscriptionManager,
    private readonly connectionManager: ConnectionManager
  ) {}

  /**
   * Broadcasts a job progress update to all clients subscribed to the job or its workspace.
   * 
   * @param payload - The job progress data to broadcast.
   */
  public broadcastProgress(payload: JobProgressPayload): void {
    const targetClientIds = new Set<string>();

    if (payload.jobId) {
      const jobClients = this.subscriptionManager.getChannelClients(`job:${payload.jobId}`);
      for (const clientId of jobClients) {
        targetClientIds.add(clientId);
      }
    }

    if (payload.projectId) {
      const workspaceClients = this.subscriptionManager.getChannelClients(`workspace:${payload.projectId}`);
      for (const clientId of workspaceClients) {
        targetClientIds.add(clientId);
      }
    }

    if (targetClientIds.size === 0) {
      return;
    }

    const message: WebSocketMessage = {
      type: 'JOB_PROGRESS' as unknown as ServerToClientEventType,
      payload,
    };

    const messageString = JSON.stringify(message);

    for (const clientId of targetClientIds) {
      const conn = this.connectionManager.getConnection(clientId);
      if (conn && conn.ws) {
        // Check readyState if available (1 corresponds to WebSocket.OPEN)
        if (typeof conn.ws.readyState === 'number') {
          if (conn.ws.readyState === 1) {
            conn.ws.send(messageString);
          }
        } else {
          conn.ws.send(messageString);
        }
      }
    }
  }
}

export const progressBroadcaster = new ProgressBroadcaster(
  subscriptionManager,
  connectionManager
);

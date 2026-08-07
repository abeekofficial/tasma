import { SystemNotificationPayload, WebSocketMessage } from './websocket.types';
import { subscriptionManager, SubscriptionManager } from './subscription-manager';
import { connectionManager, ConnectionManager } from './connection-manager';

/**
 * Handles dispatching system notifications to connected WebSocket clients based on their subscriptions.
 */
export class NotificationDispatcher {
  /**
   * Creates an instance of NotificationDispatcher.
   *
   * @param subManager - The subscription manager instance.
   * @param connManager - The connection manager instance.
   */
  constructor(
    private readonly subManager: SubscriptionManager = subscriptionManager,
    private readonly connManager: ConnectionManager = connectionManager
  ) {}

  /**
   * Broadcasts a system notification to all clients subscribed to a specific workspace.
   *
   * @param workspaceId - The unique identifier of the workspace.
   * @param payload - The notification payload to send.
   */
  public broadcastToWorkspace(workspaceId: string, payload: SystemNotificationPayload): void {
    const channel = `workspace:${workspaceId}`;
    const clients = this.subManager.getChannelClients(channel);
    const message: WebSocketMessage = { type: 'SYSTEM_NOTIFICATION', payload };

    for (const clientId of clients) {
      const conn = this.connManager.getConnection(clientId);
      if (conn?.ws?.readyState === 1) conn.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Broadcasts a system notification to all clients subscribed to a specific user.
   *
   * @param userId - The unique identifier of the user.
   * @param payload - The notification payload to send.
   */
  public broadcastToUser(userId: string, payload: SystemNotificationPayload): void {
    const channel = `user:${userId}`;
    const clients = this.subManager.getChannelClients(channel);
    const message: WebSocketMessage = { type: 'SYSTEM_NOTIFICATION', payload };

    for (const clientId of clients) {
      const conn = this.connManager.getConnection(clientId);
      if (conn?.ws?.readyState === 1) conn.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Broadcasts a system notification to all clients subscribed to the admin system channel.
   *
   * @param payload - The notification payload to send.
   */
  public broadcastToAdmin(payload: SystemNotificationPayload): void {
    const channel = 'admin:system';
    const clients = this.subManager.getChannelClients(channel);
    const message: WebSocketMessage = { type: 'SYSTEM_NOTIFICATION', payload };

    for (const clientId of clients) {
      const conn = this.connManager.getConnection(clientId);
      if (conn?.ws?.readyState === 1) conn.ws.send(JSON.stringify(message));
    }
  }
}

export const notificationDispatcher = new NotificationDispatcher();

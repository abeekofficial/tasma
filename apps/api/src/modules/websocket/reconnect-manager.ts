import { connectionManager, ConnectionManager } from './connection-manager';
import { sessionManager, SessionManager } from './session-manager';
import { subscriptionManager, SubscriptionManager } from './subscription-manager';

export class ReconnectManager {
  private readonly connectionManager: ConnectionManager;
  private readonly sessionManager: SessionManager;
  private readonly subscriptionManager: SubscriptionManager;

  constructor(
    connManager: ConnectionManager = connectionManager,
    sessManager: SessionManager = sessionManager,
    subManager: SubscriptionManager = subscriptionManager
  ) {
    this.connectionManager = connManager;
    this.sessionManager = sessManager;
    this.subscriptionManager = subManager;
  }

  /**
   * Handles reconnect logic for a client.
   * Can restore subscriptions from a previous session state or sync missed events.
   */
  public handleReconnect(clientId: string, sessionId: string): void {
    const session = this.sessionManager.getSessionBySessionId(sessionId);
    if (!session) {
      return; // No active session to recover
    }

    // Example logic: auto-subscribe to user channel
    this.subscriptionManager.subscribe(clientId, `user:${session.userId}`);
    
    if (session.workspaceId) {
      this.subscriptionManager.subscribe(clientId, `workspace:${session.workspaceId}`);
    }
  }
}

export const reconnectManager = new ReconnectManager();

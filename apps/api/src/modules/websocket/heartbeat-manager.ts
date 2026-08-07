import { WebSocket } from 'ws';
import { WebSocketClient } from './websocket.types';

/**
 * Manages the heartbeat mechanism for WebSocket connections.
 * It periodically pings active connections to ensure they are still alive
 * and terminates unresponsive clients.
 */
export class HeartbeatManager {
  private intervalMs: number;
  private intervalTimer: NodeJS.Timeout | null = null;

  /**
   * Creates a new HeartbeatManager instance.
   *
   * @param {number} intervalMs - The interval in milliseconds between each heartbeat ping. Defaults to 30000ms.
   */
  constructor(intervalMs: number = 30000) {
    this.intervalMs = intervalMs;
  }

  /**
   * Starts the heartbeat interval timer.
   *
   * @param {() => Map<string, { ws: WebSocket; client: WebSocketClient }>} getClients - A function that returns a map of active clients.
   * @param {(clientId: string) => void} onTerminate - A callback function invoked when a client is deemed unresponsive and should be terminated.
   */
  public startHeartbeat(
    getClients: () => Map<string, { ws: WebSocket; client: WebSocketClient }>,
    onTerminate: (clientId: string) => void
  ): void {
    this.stopHeartbeat();

    this.intervalTimer = setInterval(() => {
      const clients = getClients();
      
      for (const [clientId, { ws, client }] of clients.entries()) {
        if (client.status === 'IDLE') {
          onTerminate(clientId);
        } else {
          client.status = 'IDLE';
          ws.ping();
        }
      }
    }, this.intervalMs);
  }

  /**
   * Handles a pong message from a client, marking it as connected and updating the last pong timestamp.
   *
   * @param {WebSocketClient} client - The client object associated with the connection.
   */
  public handlePong(client: WebSocketClient): void {
    client.status = 'CONNECTED';
    client.lastPong = new Date();
  }

  /**
   * Stops the heartbeat interval timer.
   */
  public stopHeartbeat(): void {
    if (this.intervalTimer !== null) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
  }
}

export const heartbeatManager = new HeartbeatManager();

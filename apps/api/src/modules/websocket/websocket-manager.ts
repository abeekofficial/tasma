import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket, ServerOptions } from 'ws';
import { connectionManager, ConnectionManager } from './connection-manager';
import { heartbeatManager, HeartbeatManager } from './heartbeat-manager';
import { eventDispatcher, EventDispatcher } from './event-dispatcher';
import { AppError } from '@/shared/errors/app-error';

export class WebSocketManager {
  private wss: WebSocketServer | null = null;
  private readonly connectionManager: ConnectionManager;
  private readonly heartbeatManager: HeartbeatManager;
  private readonly eventDispatcher: EventDispatcher;

  constructor(
    connManager: ConnectionManager = connectionManager,
    hbManager: HeartbeatManager = heartbeatManager,
    evDispatcher: EventDispatcher = eventDispatcher
  ) {
    this.connectionManager = connManager;
    this.heartbeatManager = hbManager;
    this.eventDispatcher = evDispatcher;
  }

  /**
   * Initializes the WebSocket server and binds it to the HTTP server.
   */
  public initialize(server: HttpServer): void {
    if (this.wss) {
      throw AppError.internal('WebSocket server is already initialized');
    }

    const options: ServerOptions = {
      noServer: true, // We handle upgrade manually to inject auth
    };

    this.wss = new WebSocketServer(options);

    // Handle the upgrade event on the HTTP server
    server.on('upgrade', (request, socket, head) => {
      this.wss?.handleUpgrade(request, socket, head, (ws: WebSocket) => {
        this.wss?.emit('connection', ws, request);
      });
    });

    this.wss.on('connection', async (ws: WebSocket, request) => {
      try {
        await this.connectionManager.handleConnection(ws, request);
      } catch (error) {
        console.error('Failed to handle WebSocket connection:', error);
        ws.close(1011, 'Internal Server Error');
      }
    });

    // Start heartbeat monitor
    this.heartbeatManager.startHeartbeat(
      () => this.connectionManager.getActiveConnections(),
      (connectionId: string) => this.connectionManager.handleDisconnect(connectionId)
    );

    // Wire up event dispatcher to backend events
    this.eventDispatcher.initialize();

    console.log('WebSocket server initialized and ready');
  }

  /**
   * Gracefully shuts down the WebSocket server and drops all connections.
   */
  public shutdown(): void {
    if (!this.wss) return;

    this.heartbeatManager.stopHeartbeat();
    
    // Close all connections
    for (const client of this.wss.clients) {
      client.close(1001, 'Server shutting down');
    }

    this.wss.close();
    this.wss = null;
    console.log('WebSocket server shut down gracefully');
  }
}

export const webSocketManager = new WebSocketManager();

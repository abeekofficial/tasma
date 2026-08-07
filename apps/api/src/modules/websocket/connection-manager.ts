import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { WebSocketClient } from './websocket.types';
import { sessionManager, SessionManager } from './session-manager';
import { auth } from '@/lib/auth';
import { v4 as uuid } from 'uuid';
import { AppError } from '@/shared/errors/app-error';

export class ConnectionManager {
  private activeConnections: Map<string, { ws: WebSocket; client: WebSocketClient }> = new Map();

  constructor(private readonly sessionMgr: SessionManager) {}

  public async handleConnection(ws: WebSocket, request: IncomingMessage): Promise<void> {
    try {
      const headers = new Headers();

      if (request.headers.cookie) {
        headers.set('cookie', request.headers.cookie);
      }
      
      if (request.headers.authorization) {
        headers.set('authorization', request.headers.authorization);
      }

      const authSession = await auth.api.getSession({ headers });

      if (!authSession) {
        ws.close(4001, 'Unauthorized');
        return;
      }

      const userId = authSession.user.id;
      const sessionId = authSession.session.id;

      let session = this.sessionMgr.getSession(sessionId);
      if (!session) {
        session = this.sessionMgr.createSession(sessionId, userId);
      }

      const connectionId = uuid();
      const now = new Date();

      const client: WebSocketClient = {
        id: connectionId,
        userId,
        sessionId,
        roles: [], // Should be populated if available from authSession
        connectedAt: now,
        lastPing: now,
        lastPong: now,
        status: 'CONNECTED',
      };

      this.activeConnections.set(connectionId, { ws, client });
      this.sessionMgr.addConnection(sessionId, connectionId);

      ws.on('close', () => {
        this.handleDisconnect(connectionId);
      });

      // Emit an initial AUTHENTICATED message back
      ws.send(JSON.stringify({
        type: 'AUTHENTICATED',
        payload: {
          connectionId,
          sessionId,
          userId
        },
        timestamp: new Date().toISOString()
      }));

    } catch (error) {
      ws.close(4001, 'Unauthorized');
      throw new AppError('Failed to handle WebSocket connection', 4001);
    }
  }

  public handleDisconnect(connectionId: string): void {
    const connection = this.activeConnections.get(connectionId);
    
    if (connection) {
      const { client } = connection;
      this.activeConnections.delete(connectionId);
      
      try {
        this.sessionMgr.removeConnection(client.sessionId, connectionId);
      } catch (error) {
        // Log or handle error if needed
      }
    }
  }

  public getConnection(connectionId: string): { ws: WebSocket; client: WebSocketClient } | undefined {
    return this.activeConnections.get(connectionId);
  }

  public getActiveConnections(): Map<string, { ws: WebSocket; client: WebSocketClient }> {
    return this.activeConnections;
  }
}

export const connectionManager = new ConnectionManager(sessionManager);

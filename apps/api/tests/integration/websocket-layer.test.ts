import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createServer, Server as HttpServer } from 'http';
import WebSocket from 'ws';
import { webSocketManager } from '@/modules/websocket/websocket-manager';
import { subscriptionManager } from '@/modules/websocket/subscription-manager';
import { progressBroadcaster } from '@/modules/websocket/progress-broadcaster';
import { notificationDispatcher } from '@/modules/websocket/notification-dispatcher';
import { connectionManager } from '@/modules/websocket/connection-manager';

// Mock auth dependency
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    }
  }
}));

import { auth } from '@/lib/auth';

describe('WebSocket Layer Integration', () => {
  let server: HttpServer;
  let wsClient: WebSocket;
  let port: number;

  beforeEach(async () => {
    vi.resetAllMocks();

    // Clear internal state from possible previous test runs
    connectionManager.getActiveConnections().clear();

    server = createServer();
    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        port = (server.address() as import('net').AddressInfo).port;
        resolve();
      });
    });

    // Ensure we start fresh
    webSocketManager.shutdown();
    webSocketManager.initialize(server);
  });

  afterEach(async () => {
    if (wsClient && wsClient.readyState !== WebSocket.CLOSED) {
      wsClient.close();
    }
    webSocketManager.shutdown();
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  const connectClient = (token: string): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
      const client = new WebSocket(`ws://127.0.0.1:${port}`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      
      const onOpen = () => {
        client.removeListener('error', onError);
        resolve(client);
      };
      
      const onError = (err: Error) => {
        client.removeListener('open', onOpen);
        reject(err);
      };
      
      client.once('open', onOpen);
      client.once('error', onError);
    });
  };

  const waitForMessage = (client: WebSocket): Promise<any> => {
    return new Promise((resolve) => {
      client.once('message', (data) => {
        resolve(JSON.parse(data.toString()));
      });
    });
  };

  it('rejects connection without valid authentication', async () => {
    // Return null to simulate invalid auth
    (auth.api.getSession as any).mockResolvedValue(null);

    wsClient = await connectClient('invalid-token');
    
    const closeEvent = await new Promise<any>((resolve) => {
      wsClient.on('close', (code, reason) => {
        resolve({ code, reason: reason.toString() });
      });
    });

    expect(closeEvent.code).toBe(4001);
    expect(closeEvent.reason).toBe('Unauthorized');
  });

  it('authenticates and establishes connection', async () => {
    // Simulate valid auth session
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: 'user-1' },
      session: { id: 'sess-1' }
    });

    wsClient = await connectClient('valid-token');
    
    // Wait for the AUTHENTICATED message
    const msg = await waitForMessage(wsClient);
    
    expect(msg.type).toBe('AUTHENTICATED');
    expect(msg.payload.userId).toBe('user-1');
    expect(msg.payload.sessionId).toBe('sess-1');
    expect(msg.payload.connectionId).toBeDefined();
    
    // Verify connection manager tracked the connection
    const connId = msg.payload.connectionId;
    const activeConn = connectionManager.getConnection(connId);
    expect(activeConn).toBeDefined();
    expect(activeConn?.client.userId).toBe('user-1');
  });

  it('handles channel subscriptions and broadcasts JOB_PROGRESS', async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: 'user-1' },
      session: { id: 'sess-1' }
    });

    wsClient = await connectClient('valid-token');
    const authMsg = await waitForMessage(wsClient);
    const connectionId = authMsg.payload.connectionId;

    // Simulate backend handling subscription to a job channel
    subscriptionManager.subscribe(connectionId, 'job:job-123');
    expect(subscriptionManager.hasSubscription(connectionId, 'job:job-123')).toBe(true);

    // Broadcast a job progress event
    const payload = {
      jobId: 'job-123',
      progress: 50,
      currentStage: 'rendering',
      completedPercent: 50
    };
    
    progressBroadcaster.broadcastProgress(payload);

    // Client should receive the progress update
    const msg = await waitForMessage(wsClient);
    expect(msg.type).toBe('JOB_PROGRESS');
    expect(msg.payload).toEqual(payload);
  });

  it('broadcasts SYSTEM_NOTIFICATION to workspace channels', async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: 'user-1' },
      session: { id: 'sess-1' }
    });

    wsClient = await connectClient('valid-token');
    const authMsg = await waitForMessage(wsClient);
    const connectionId = authMsg.payload.connectionId;

    // Subscribe to a workspace channel
    subscriptionManager.subscribe(connectionId, 'workspace:ws-1');
    
    // Broadcast a system notification to the workspace
    const payload = {
      level: 'info' as const,
      title: 'Test Notification',
      message: 'Workspace updated'
    };
    
    notificationDispatcher.broadcastToWorkspace('ws-1', payload);

    // Client should receive the system notification
    const msg = await waitForMessage(wsClient);
    expect(msg.type).toBe('SYSTEM_NOTIFICATION');
    expect(msg.payload).toEqual(payload);
  });
});

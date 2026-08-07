import { ClientSession } from './websocket.types';
import { AppError } from '@/shared/errors/app-error';
import { v4 as uuid } from 'uuid';

/**
 * Manages WebSocket client sessions.
 */
export class SessionManager {
  private sessions: Map<string, ClientSession> = new Map();

  /**
   * Creates and returns a new session for a user.
   * If a session already exists for the user, it will be overwritten.
   *
   * @param userId - The unique identifier of the user
   * @param workspaceId - The optional identifier of the workspace
   * @param deviceType - The optional device type string
   * @returns The newly created client session
   */
  public createSession(userId: string, workspaceId?: string, deviceType?: string): ClientSession {
    const session: ClientSession = {
      sessionId: uuid(),
      userId,
      workspaceId,
      deviceType,
      activeConnections: [],
      lastActive: new Date()
    };

    this.sessions.set(userId, session);
    return session;
  }

  /**
   * Retrieves the current session for a user.
   *
   * @param userId - The unique identifier of the user
   * @returns The client session if it exists, otherwise undefined
   */
  public getSession(userId: string): ClientSession | undefined {
    return this.sessions.get(userId);
  }

  /**
   * Adds a connection to the active connections array of a user's session and updates lastActive.
   *
   * @param userId - The unique identifier of the user
   * @param connectionId - The unique identifier of the WebSocket connection
   * @throws {AppError} If the user session does not exist
   */
  public addConnection(userId: string, connectionId: string): void {
    const session = this.sessions.get(userId);
    
    if (!session) {
      throw new AppError('Session not found for user.', 404);
    }

    if (!session.activeConnections.includes(connectionId)) {
      session.activeConnections.push(connectionId);
    }
    
    session.lastActive = new Date();
  }

  /**
   * Removes a connection from the active connections array of a user's session.
   *
   * @param userId - The unique identifier of the user
   * @param connectionId - The unique identifier of the WebSocket connection
   * @throws {AppError} If the user session does not exist
   */
  public removeConnection(userId: string, connectionId: string): void {
    const session = this.sessions.get(userId);
    
    if (!session) {
      throw new AppError('Session not found for user.', 404);
    }

    session.activeConnections = session.activeConnections.filter(id => id !== connectionId);
    session.lastActive = new Date();
  }

  /**
   * Checks whether a user has any active connections.
   *
   * @param userId - The unique identifier of the user
   * @returns True if the user has active connections, false otherwise
   */
  public hasActiveConnections(userId: string): boolean {
    const session = this.sessions.get(userId);
    
    if (!session) {
      return false;
    }

    return session.activeConnections.length > 0;
  }

  /**
   * Terminates a user's session entirely by removing it from the manager.
   *
   * @param userId - The unique identifier of the user
   */
  public terminateSession(userId: string): void {
    this.sessions.delete(userId);
  }
}

export const sessionManager = new SessionManager();

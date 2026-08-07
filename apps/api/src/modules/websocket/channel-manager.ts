import { ChannelType } from './websocket.types';
import { AppError } from '@/shared/errors/app-error';

export class ChannelManager {
  /**
   * In-memory map to track valid channel types.
   */
  private readonly validChannelTypes: Map<string, boolean> = new Map([
    ['user', true],
    ['workspace', true],
    ['project', true],
    ['job', true],
    ['worker', true],
    ['admin', true],
  ]);

  /**
   * Builds a standardized channel name.
   * 
   * @param type - The channel type (e.g., 'user', 'job')
   * @param id - The unique identifier
   * @returns The formatted channel name string
   */
  public buildChannelName(type: ChannelType, id: string): string {
    if (!this.validChannelTypes.has(type)) {
      throw new AppError(`Invalid channel type: ${type}`, 400);
    }
    if (!id || id.trim().length === 0) {
      throw new AppError('Channel ID cannot be empty', 400);
    }
    return `${type}:${id}`;
  }

  /**
   * Parses a channel name into its type and id components.
   * 
   * @param channelName - The full channel name
   * @returns An object containing the channel type and id
   */
  public parseChannelName(channelName: string): { type: ChannelType; id: string } {
    if (!channelName) {
      throw new AppError('Channel name cannot be empty', 400);
    }

    const parts = channelName.split(':');
    
    if (parts.length !== 2) {
      throw new AppError(`Invalid channel format: ${channelName}. Expected format type:id`, 400);
    }

    const [type, id] = parts;
    
    if (!this.validChannelTypes.has(type)) {
      throw new AppError(`Invalid channel type: ${type}`, 400);
    }

    if (!id || id.trim().length === 0) {
      throw new AppError(`Invalid channel ID for channel: ${channelName}`, 400);
    }

    return { type: type as ChannelType, id };
  }

  /**
   * Validates a channel name format (type:id) and ensures the type is valid.
   * 
   * @param channelName - The channel name to validate
   * @returns True if the channel name is valid, false otherwise
   */
  public isValidChannel(channelName: string): boolean {
    if (!channelName || typeof channelName !== 'string') {
      return false;
    }

    const parts = channelName.split(':');
    if (parts.length !== 2) {
      return false;
    }
    
    const [type, id] = parts;
    return this.validChannelTypes.has(type) && id.trim().length > 0;
  }

  /**
   * Gets the required role to access a specific channel type.
   * 
   * @param channelType - The type of the channel
   * @returns The role required to access, e.g., 'admin', or null for others
   */
  public getRequiredRole(channelType: ChannelType): string | null {
    if (channelType === 'admin') {
      return 'admin';
    }
    return null;
  }
}

export const channelManager = new ChannelManager();

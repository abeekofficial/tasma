import { ChannelSubscription, ChannelType } from './websocket.types';
import { channelManager, ChannelManager } from './channel-manager';
import { AppError } from '@/shared/errors/app-error';

/**
 * Manages WebSocket client subscriptions to channels.
 */
export class SubscriptionManager {
  private subscriptionsByClient: Map<string, Set<string>> = new Map();
  private clientsByChannel: Map<string, Set<string>> = new Map();

  /**
   * Creates an instance of SubscriptionManager.
   * 
   * @param channelMgr The ChannelManager instance to use for channel validation.
   */
  constructor(private readonly channelMgr: ChannelManager = channelManager) {}

  /**
   * Subscribes a client to a channel.
   * 
   * @param clientId The ID of the client.
   * @param channelName The name of the channel.
   * @throws {AppError} If the channel does not exist.
   */
  public subscribe(clientId: string, channelName: string): void {
    if (!this.channelMgr.getChannel(channelName)) {
      throw new AppError('NOT_FOUND', `Channel not found: ${channelName}`);
    }

    if (!this.subscriptionsByClient.has(clientId)) {
      this.subscriptionsByClient.set(clientId, new Set());
    }
    this.subscriptionsByClient.get(clientId)!.add(channelName);

    if (!this.clientsByChannel.has(channelName)) {
      this.clientsByChannel.set(channelName, new Set());
    }
    this.clientsByChannel.get(channelName)!.add(clientId);
  }

  /**
   * Unsubscribes a client from a channel.
   * 
   * @param clientId The ID of the client.
   * @param channelName The name of the channel.
   */
  public unsubscribe(clientId: string, channelName: string): void {
    const clientSubscriptions = this.subscriptionsByClient.get(clientId);
    if (clientSubscriptions) {
      clientSubscriptions.delete(channelName);
      if (clientSubscriptions.size === 0) {
        this.subscriptionsByClient.delete(clientId);
      }
    }

    const channelClients = this.clientsByChannel.get(channelName);
    if (channelClients) {
      channelClients.delete(clientId);
      if (channelClients.size === 0) {
        this.clientsByChannel.delete(channelName);
      }
    }
  }

  /**
   * Unsubscribes a client from all channels.
   * 
   * @param clientId The ID of the client.
   */
  public unsubscribeAll(clientId: string): void {
    const channels = this.subscriptionsByClient.get(clientId);
    if (channels) {
      // Create a shallow copy to iterate over, as unsubscribe modifies the set
      const channelsToUnsubscribe = Array.from(channels);
      for (const channelName of channelsToUnsubscribe) {
        this.unsubscribe(clientId, channelName);
      }
    }
  }

  /**
   * Gets all channels a client is subscribed to.
   * 
   * @param clientId The ID of the client.
   * @returns An array of channel names.
   */
  public getClientChannels(clientId: string): string[] {
    const channels = this.subscriptionsByClient.get(clientId);
    return channels ? Array.from(channels) : [];
  }

  /**
   * Gets all clients subscribed to a channel.
   * 
   * @param channelName The name of the channel.
   * @returns An array of client IDs.
   */
  public getChannelClients(channelName: string): string[] {
    const clients = this.clientsByChannel.get(channelName);
    return clients ? Array.from(clients) : [];
  }

  /**
   * Checks if a client is subscribed to a channel.
   * 
   * @param clientId The ID of the client.
   * @param channelName The name of the channel.
   * @returns True if subscribed, false otherwise.
   */
  public hasSubscription(clientId: string, channelName: string): boolean {
    const channels = this.subscriptionsByClient.get(clientId);
    return channels ? channels.has(channelName) : false;
  }
}

export const subscriptionManager = new SubscriptionManager();

import { MetadataCacheEntry } from '../types';

export class MetadataCacheManager {
  private cache: Map<string, MetadataCacheEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupTask();
  }

  public set(fileHash: string, data: any, ttlSeconds?: number): void {
    const timestamp = Date.now();
    const expiresAt = ttlSeconds ? timestamp + ttlSeconds * 1000 : undefined;
    
    this.cache.set(fileHash, {
      timestamp,
      expiresAt,
      data,
    });
  }

  public get(fileHash: string): any | null {
    const entry = this.cache.get(fileHash);
    
    if (!entry) {
      return null;
    }

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(fileHash);
      return null;
    }

    return entry.data;
  }

  public invalidate(fileHash: string): void {
    this.cache.delete(fileHash);
  }

  public cleanupExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt && now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.cache.clear();
  }

  private startCleanupTask(): void {
    // Run cleanup every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpired();
    }, 60 * 1000);
    // Prevent the interval from keeping the Node process alive
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }
}

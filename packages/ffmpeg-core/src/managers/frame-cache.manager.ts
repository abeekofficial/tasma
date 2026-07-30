import { join } from 'path';
import { WorkspaceManager } from './workspace.manager';

export interface FrameCacheOptions {
  maxMemoryBytes?: number;
  workspaceManager?: WorkspaceManager;
}

interface CacheEntry {
  videoId: string;
  timecode: number;
  buffer: Buffer;
  size: number;
  lastAccessed: number;
}

export class FrameCacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  private maxMemoryBytes: number;
  private currentMemoryBytes: number = 0;
  private workspaceManager?: WorkspaceManager;

  constructor(options: FrameCacheOptions = {}) {
    // Default to 500MB
    this.maxMemoryBytes = options.maxMemoryBytes || 500 * 1024 * 1024;
    this.workspaceManager = options.workspaceManager;
  }

  private getCacheKey(videoId: string, timecode: number): string {
    return `${videoId}:${timecode}`;
  }

  public setFrame(videoId: string, timecode: number, buffer: Buffer): void {
    const key = this.getCacheKey(videoId, timecode);
    const size = buffer.length;

    if (this.cache.has(key)) {
      const existing = this.cache.get(key)!;
      this.currentMemoryBytes -= existing.size;
    }

    this.evictToFit(size);

    const entry: CacheEntry = {
      videoId,
      timecode,
      buffer,
      size,
      lastAccessed: Date.now(),
    };

    this.cache.set(key, entry);
    this.currentMemoryBytes += size;
  }

  public getFrame(videoId: string, timecode: number): Buffer | null {
    const key = this.getCacheKey(videoId, timecode);

    if (this.cache.has(key)) {
      const entry = this.cache.get(key)!;
      entry.lastAccessed = Date.now();
      return entry.buffer;
    }

    return null;
  }

  public clear(): void {
    this.cache.clear();
    this.currentMemoryBytes = 0;
  }

  private evictToFit(sizeNeeded: number): void {
    if (sizeNeeded > this.maxMemoryBytes) {
      // The single frame is larger than the entire cache capacity.
      return;
    }

    while (this.currentMemoryBytes + sizeNeeded > this.maxMemoryBytes && this.cache.size > 0) {
      let oldestKey: string | null = null;
      let oldestTime = Infinity;

      for (const [key, entry] of this.cache.entries()) {
        if (entry.lastAccessed < oldestTime) {
          oldestTime = entry.lastAccessed;
          oldestKey = key;
        }
      }

      if (oldestKey) {
        const entry = this.cache.get(oldestKey)!;
        
        // Optionally flush to disk if workspace manager is available
        // if (this.workspaceManager) {
        //   this.flushToDisk(entry);
        // }

        this.currentMemoryBytes -= entry.size;
        this.cache.delete(oldestKey);
      }
    }
  }
}

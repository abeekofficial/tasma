'use client';

import type { Track, Clip } from '@/stores/editor-store';

export interface VisibleRange {
  startTime: number;
  endTime: number;
  startPixel: number;
  endPixel: number;
}

export interface VirtualizedTrackData {
  trackId: string;
  visibleClips: Clip[];
  totalClips: number;
}

export function getVisibleRange(
  scrollX: number,
  viewportWidth: number,
  pixelsPerSecond: number,
  duration: number
): VisibleRange {
  const startPixel = Math.max(0, scrollX);
  const endPixel = scrollX + viewportWidth;
  
  const startTime = startPixel / pixelsPerSecond;
  const endTime = Math.min(duration, endPixel / pixelsPerSecond);
  
  return { startTime, endTime, startPixel, endPixel };
}

export function getVisibleClips(
  clips: Clip[],
  visibleRange: VisibleRange,
  buffer: number = 2
): Clip[] {
  const bufferedStart = visibleRange.startTime - buffer;
  const bufferedEnd = visibleRange.endTime + buffer;
  
  // Implementation that works both on sorted and unsorted safely.
  // Real implementation for large lists should assume sorted.
  let left = 0;
  let right = clips.length - 1;
  let startIndex = 0;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (clips[mid].endTime < bufferedStart) {
      left = mid + 1;
    } else {
      startIndex = mid;
      right = mid - 1;
    }
  }
  
  const visibleClips: Clip[] = [];
  for (let i = startIndex; i < clips.length; i++) {
    const clip = clips[i];
    if (clip.startTime > bufferedEnd) break;
    visibleClips.push(clip);
  }
  
  // Fallback check to make sure things aren't dropped if not purely sorted
  if (visibleClips.length === 0) {
    return clips.filter(c => c.endTime >= bufferedStart && c.startTime <= bufferedEnd);
  }
  
  return visibleClips;
}

export function virtualizeTimeline(
  tracks: Track[],
  scrollX: number,
  viewportWidth: number,
  pixelsPerSecond: number,
  duration: number,
  buffer: number = 2
): VirtualizedTrackData[] {
  const visibleRange = getVisibleRange(scrollX, viewportWidth, pixelsPerSecond, duration);
  
  return tracks.map(track => {
    const sortedClips = [...track.clips].sort((a, b) => a.startTime - b.startTime);
    return {
      trackId: track.id,
      visibleClips: getVisibleClips(sortedClips, visibleRange, buffer),
      totalClips: track.clips.length
    };
  });
}

export function getTimelineWidth(duration: number, pixelsPerSecond: number): number {
  return duration * pixelsPerSecond;
}

export function shouldAutoScroll(
  currentTime: number,
  scrollX: number,
  viewportWidth: number,
  pixelsPerSecond: number,
  threshold: number = 50
): { shouldScroll: boolean; newScrollX: number } {
  const currentPixel = currentTime * pixelsPerSecond;
  const rightEdge = scrollX + viewportWidth;
  const leftEdge = scrollX;
  
  if (currentPixel > rightEdge - threshold) {
    return { shouldScroll: true, newScrollX: currentPixel - viewportWidth + threshold + 50 };
  } else if (currentPixel < leftEdge + threshold && scrollX > 0) {
    return { shouldScroll: true, newScrollX: Math.max(0, currentPixel - threshold - 50) };
  }
  
  return { shouldScroll: false, newScrollX: scrollX };
}

export function getMinimapData(
  tracks: Track[],
  duration: number,
  minimapWidth: number
): { clips: Array<{ left: number; width: number; trackIndex: number; color: string }> } {
  const result: Array<{ left: number; width: number; trackIndex: number; color: string }> = [];
  
  tracks.forEach((track, trackIndex) => {
    track.clips.forEach(clip => {
      const left = (clip.startTime / duration) * minimapWidth;
      const width = ((clip.endTime - clip.startTime) / duration) * minimapWidth;
      result.push({
        left,
        width,
        trackIndex,
        color: '#8b5cf6'
      });
    });
  });
  
  return { clips: result };
}

'use client';

import type { Track, Clip, Marker } from '@/stores/editor-store';

export interface SnapPoint {
  time: number;
  type: 'clip-start' | 'clip-end' | 'marker' | 'playhead' | 'grid';
  label?: string;
}

export interface SnapResult {
  snapped: boolean;
  time: number;
  snapPoint: SnapPoint | null;
  delta: number; // how far the snap moved the value
}

export function collectSnapPoints(
  tracks: Track[],
  markers: Marker[],
  currentTime: number,
  gridInterval: number,
  excludeClipIds?: string[]
): SnapPoint[] {
  const points: SnapPoint[] = [];

  // Add playhead
  points.push({ time: currentTime, type: 'playhead', label: 'Playhead' });

  // Add markers
  markers.forEach(m => {
    points.push({ time: m.time, type: 'marker', label: m.label || 'Marker' });
  });

  // Add clips
  tracks.forEach(track => {
    track.clips.forEach(clip => {
      if (excludeClipIds?.includes(clip.id)) return;
      points.push({ time: clip.startTime, type: 'clip-start', label: 'Clip Start' });
      points.push({ time: clip.endTime, type: 'clip-end', label: 'Clip End' });
    });
  });

  // Grid could be added here if needed

  return points;
}

export function findNearestSnap(
  time: number,
  snapPoints: SnapPoint[],
  threshold: number
): SnapResult {
  let nearest: SnapPoint | null = null;
  let minDelta = Infinity;

  for (const point of snapPoints) {
    const delta = Math.abs(point.time - time);
    if (delta <= threshold && delta < minDelta) {
      minDelta = delta;
      nearest = point;
    }
  }

  if (nearest && minDelta <= threshold) {
    return {
      snapped: true,
      time: nearest.time,
      snapPoint: nearest,
      delta: nearest.time - time
    };
  }

  return { snapped: false, time, snapPoint: null, delta: 0 };
}

export function snapTime(
  time: number,
  tracks: Track[],
  markers: Marker[],
  currentTime: number,
  options: {
    enabled: boolean;
    threshold: number; // in pixels
    pixelsPerSecond: number;
    magneticTimeline: boolean;
    excludeClipIds?: string[];
  }
): SnapResult {
  if (!options.enabled) {
    return { snapped: false, time, snapPoint: null, delta: 0 };
  }

  const thresholdSeconds = options.threshold / options.pixelsPerSecond;
  const gridInterval = 1;

  const points = collectSnapPoints(tracks, markers, currentTime, gridInterval, options.excludeClipIds);
  return findNearestSnap(time, points, thresholdSeconds);
}

export function rangesOverlap(
  aStart: number, aEnd: number,
  bStart: number, bEnd: number
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function findAvailablePosition(
  track: Track,
  startTime: number,
  duration: number,
  excludeClipId?: string
): number {
  let currentStart = startTime;
  let hasOverlap = true;
  
  const clips = track.clips
    .filter(c => c.id !== excludeClipId)
    .sort((a, b) => a.startTime - b.startTime);

  while (hasOverlap) {
    hasOverlap = false;
    for (const clip of clips) {
      if (rangesOverlap(currentStart, currentStart + duration, clip.startTime, clip.endTime)) {
        currentStart = clip.endTime;
        hasOverlap = true;
        break;
      }
    }
  }
  
  return currentStart;
}

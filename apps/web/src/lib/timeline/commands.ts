'use client';

import type { Track, Clip } from '@/stores/editor-store';

export interface Command {
  id: string;
  type: string;
  label: string;
  timestamp: number;
  execute: () => void;
  undo: () => void;
}

export interface HistorySnapshot {
  tracks: Track[];
  selectedTrackId: string | null;
  selectedClipIds: string[];
  currentTime: number;
  duration: number;
}

export interface HistoryEntry {
  id: string;
  label: string;
  timestamp: number;
  snapshot: HistorySnapshot;
}

export function deepCloneTracks(tracks: Track[]): Track[] {
  return structuredClone(tracks);
}

export function createSnapshot(
  tracks: Track[],
  selectedClipIds: string[],
  selectedTrackId: string | null,
  currentTime: number,
  duration: number
): HistorySnapshot {
  return {
    tracks: deepCloneTracks(tracks),
    selectedClipIds: [...selectedClipIds],
    selectedTrackId,
    currentTime,
    duration
  };
}

export function restoreSnapshot(snapshot: HistorySnapshot): HistorySnapshot {
  return {
    tracks: deepCloneTracks(snapshot.tracks),
    selectedClipIds: [...snapshot.selectedClipIds],
    selectedTrackId: snapshot.selectedTrackId,
    currentTime: snapshot.currentTime,
    duration: snapshot.duration
  };
}

export function compressHistory(entries: HistoryEntry[], maxSize: number): HistoryEntry[] {
  if (entries.length <= 1) return entries;
  
  const compressed: HistoryEntry[] = [];
  let current = entries[0];
  
  for (let i = 1; i < entries.length; i++) {
    const next = entries[i];
    if (current.label === next.label && (next.timestamp - current.timestamp) < 500) {
      current = { ...next, timestamp: current.timestamp, id: current.id };
    } else {
      compressed.push(current);
      current = next;
    }
  }
  compressed.push(current);
  
  if (compressed.length > maxSize) {
    return compressed.slice(compressed.length - maxSize);
  }
  
  return compressed;
}

export function createHistoryLabel(actionType: string, details?: string): string {
  const labels: Record<string, string> = {
    'MOVE_CLIP': 'Move Clip',
    'RESIZE_CLIP': 'Resize Clip',
    'ADD_TRACK': 'Add Track',
    'DELETE_CLIP': 'Delete Clip',
    'ADD_CLIP': 'Add Clip',
    'SPLIT_CLIP': 'Split Clip',
  };
  
  const label = labels[actionType] || actionType;
  return details ? `${label} (${details})` : label;
}

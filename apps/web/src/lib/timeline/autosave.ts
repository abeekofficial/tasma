'use client';

import type { Track } from '@/stores/editor-store';

export interface ProjectSnapshot {
  id: string;
  timestamp: number;
  label: string;
  tracks: Track[];
  duration: number;
  resolution: { width: number; height: number };
  currentTime: number;
  projectName: string;
}

export function saveToLocalStorage(projectId: string, snapshot: ProjectSnapshot): void {
  try {
    const key = `tasma:autosave:${projectId}`;
    localStorage.setItem(key, JSON.stringify(snapshot));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function loadFromLocalStorage(projectId: string): ProjectSnapshot | null {
  try {
    const key = `tasma:autosave:${projectId}`;
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return null;
}

export function saveSnapshot(projectId: string, snapshot: ProjectSnapshot): void {
  try {
    const key = `tasma:snapshots:${projectId}`;
    const snapshots = loadSnapshots(projectId);
    snapshots.push(snapshot);
    localStorage.setItem(key, JSON.stringify(snapshots));
    pruneSnapshots(projectId, 10);
  } catch (error) {
    console.error('Failed to save snapshot:', error);
  }
}

export function loadSnapshots(projectId: string): ProjectSnapshot[] {
  try {
    const key = `tasma:snapshots:${projectId}`;
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load snapshots:', error);
  }
  return [];
}

export function pruneSnapshots(projectId: string, maxSnapshots: number): void {
  try {
    const key = `tasma:snapshots:${projectId}`;
    const snapshots = loadSnapshots(projectId);
    if (snapshots.length > maxSnapshots) {
      const pruned = snapshots.slice(snapshots.length - maxSnapshots);
      localStorage.setItem(key, JSON.stringify(pruned));
    }
  } catch (error) {
    console.error('Failed to prune snapshots:', error);
  }
}

export function hasRecoveryData(projectId: string): boolean {
  try {
    const key = `tasma:recovery:${projectId}`;
    return localStorage.getItem(key) !== null;
  } catch (error) {
    return false;
  }
}

export function createAutosaveManager(
  projectId: string,
  interval: number,
  getState: () => ProjectSnapshot,
  onSave?: () => void
): { start: () => void; stop: () => void; saveNow: () => void } {
  let intervalId: number | null = null;
  
  const saveNow = () => {
    const state = getState();
    saveToLocalStorage(projectId, state);
    if (onSave) onSave();
  };
  
  const start = () => {
    if (intervalId !== null) return;
    intervalId = window.setInterval(saveNow, interval);
  };
  
  const stop = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
  
  return { start, stop, saveNow };
}

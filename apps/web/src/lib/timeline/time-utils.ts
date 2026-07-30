'use client';

export function formatTimecode(seconds: number, fps: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return "00:00:00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const f = Math.floor((seconds % 1) * fps);
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
}

export function parseTimecode(timecode: string, fps: number): number {
  const parts = timecode.split(':').map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return 0;
  const [h, m, s, f] = parts;
  return h * 3600 + m * 60 + s + (f / fps);
}

export function formatTimeShort(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(m)}:${pad(s)}`;
}

export function frameToSeconds(frame: number, fps: number): number {
  if (isNaN(frame) || !isFinite(frame) || fps <= 0) return 0;
  return frame / fps;
}

export function secondsToFrame(seconds: number, fps: number): number {
  if (isNaN(seconds) || !isFinite(seconds) || fps <= 0) return 0;
  return Math.round(seconds * fps);
}

export function clampTime(time: number, duration: number): number {
  if (isNaN(time)) return 0;
  return Math.max(0, Math.min(time, duration));
}

export function snapToFrame(time: number, fps: number): number {
  if (isNaN(time) || !isFinite(time) || fps <= 0) return 0;
  const frame = Math.round(time * fps);
  return frame / fps;
}

export function timeToPixels(time: number, pixelsPerSecond: number): number {
  if (isNaN(time) || !isFinite(time)) return 0;
  return time * pixelsPerSecond;
}

export function pixelsToTime(pixels: number, pixelsPerSecond: number): number {
  if (isNaN(pixels) || !isFinite(pixels) || pixelsPerSecond <= 0) return 0;
  return pixels / pixelsPerSecond;
}

export function durationToPixels(duration: number, pixelsPerSecond: number): number {
  if (isNaN(duration) || !isFinite(duration)) return 0;
  return duration * pixelsPerSecond;
}

'use client';

import type { Clip, Track } from '@/stores/editor-store';

export function prepareClipsForCopy(clips: Clip[]): Clip[] {
  if (!clips.length) return [];
  
  const clonedClips = structuredClone(clips);
  const minStartTime = Math.min(...clonedClips.map(c => c.startTime));
  
  return clonedClips.map(clip => {
    clip.startTime -= minStartTime;
    clip.endTime -= minStartTime;
    return clip;
  });
}

export function createPastedClips(
  clipboardClips: Clip[],
  targetTime: number,
  targetTrackId: string,
  tracks: Track[]
): Clip[] {
  if (!clipboardClips.length) return [];
  
  return clipboardClips.map(clip => {
    const newClip = structuredClone(clip);
    newClip.id = crypto.randomUUID();
    newClip.trackId = targetTrackId;
    
    const duration = newClip.endTime - newClip.startTime;
    newClip.startTime += targetTime;
    newClip.endTime = newClip.startTime + duration;
    
    return newClip;
  });
}

export function duplicateClips(
  clips: Clip[],
  offsetSeconds: number = 0.5
): Clip[] {
  return clips.map(clip => {
    const newClip = structuredClone(clip);
    newClip.id = crypto.randomUUID();
    newClip.startTime += offsetSeconds;
    newClip.endTime += offsetSeconds;
    return newClip;
  });
}

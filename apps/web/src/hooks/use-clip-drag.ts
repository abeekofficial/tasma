'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { pixelsToTime, timeToPixels, clampTime } from '@/lib/timeline/time-utils';
import { snapTime, findAvailablePosition, rangesOverlap } from '@/lib/timeline/snap-engine';

interface UseClipDragOptions {
  clipId: string;
  trackId: string;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

interface UseClipDragReturn {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  handleMouseDown: (e: React.MouseEvent) => void;
}

export function useClipDrag(options: UseClipDragOptions): UseClipDragReturn {
  const { clipId, trackId, onDragStart, onDragEnd } = options;
  const store = useEditorStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragState = useRef({
    startX: 0,
    startY: 0,
    initialStartTime: 0,
    initialTrackId: '',
    clipOffsets: {} as Record<string, { startTime: number, trackId: string }>,
  });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const track = store.tracks.find(t => t.id === trackId);
    if (track?.locked) return;
    
    const clip = track?.clips.find(c => c.id === clipId);
    if (!clip) return;

    onDragStart?.();
    setIsDragging(true);
    setDragOffset({ x: 0, y: 0 });
    
    const selectedIds = store.selectedClipIds.includes(clipId) 
      ? store.selectedClipIds 
      : [clipId];

    const clipOffsets: Record<string, { startTime: number, trackId: string }> = {};
    for (const t of store.tracks) {
      for (const c of t.clips) {
        if (selectedIds.includes(c.id)) {
          clipOffsets[c.id] = { startTime: c.startTime, trackId: t.id };
        }
      }
    }

    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialStartTime: clip.startTime,
      initialTrackId: trackId,
      clipOffsets,
    };
    
    store.pushHistory('Move Clip');

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - dragState.current.startX;
      const deltaY = moveEvent.clientY - dragState.current.startY;
      setDragOffset({ x: deltaX, y: deltaY });

      const deltaTime = pixelsToTime(deltaX, store.pixelsPerSecond, store.zoom);
      
      const trackHeight = 80; // Estimated height for drop targets
      const trackIndexDelta = Math.round(deltaY / trackHeight);
      
      for (const [id, initialPos] of Object.entries(dragState.current.clipOffsets)) {
        let newStartTime = initialPos.startTime + deltaTime;
        
        if (store.snapEnabled) {
           newStartTime = snapTime(newStartTime, store.tracks, store.markers, store.snapThreshold);
        }
        
        newStartTime = clampTime(newStartTime, 0, store.duration);
        
        let newTrackId = initialPos.trackId;
        const currentTrackIndex = store.tracks.findIndex(t => t.id === initialPos.trackId);
        if (currentTrackIndex !== -1) {
          let newTrackIndex = currentTrackIndex + trackIndexDelta;
          newTrackIndex = Math.max(0, Math.min(store.tracks.length - 1, newTrackIndex));
          const targetTrack = store.tracks[newTrackIndex];
          if (targetTrack && !targetTrack.locked) {
            newTrackId = targetTrack.id;
          }
        }
        
        if (store.magneticTimeline) {
          // Additional checks can be applied using findAvailablePosition
        }

        store.moveClip(id, newTrackId, newStartTime);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
      onDragEnd?.();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [clipId, trackId, store, onDragStart, onDragEnd]);

  useEffect(() => {
    return () => {
      setIsDragging(false);
    };
  }, []);

  return { isDragging, dragOffset, handleMouseDown };
}

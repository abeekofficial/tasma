'use client';

import { useState, useCallback, useRef } from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { pixelsToTime, clampTime } from '@/lib/timeline/time-utils';
import { snapTime } from '@/lib/timeline/snap-engine';

interface UseClipResizeOptions {
  clipId: string;
  edge: 'start' | 'end';
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
}

interface UseClipResizeReturn {
  isResizing: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
}

export function useClipResize(options: UseClipResizeOptions): UseClipResizeReturn {
  const { clipId, edge, onResizeStart, onResizeEnd } = options;
  const store = useEditorStore();
  const [isResizing, setIsResizing] = useState(false);
  const dragState = useRef({
    startX: 0,
    initialStartTime: 0,
    initialEndTime: 0,
  });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    let targetClip: any = null;
    let trackLocked = false;
    for (const t of store.tracks) {
      const c = t.clips.find((c: any) => c.id === clipId);
      if (c) {
        targetClip = c;
        trackLocked = t.locked;
        break;
      }
    }
    
    if (!targetClip || trackLocked) return;

    onResizeStart?.();
    setIsResizing(true);
    
    dragState.current = {
      startX: e.clientX,
      initialStartTime: targetClip.startTime,
      initialEndTime: targetClip.endTime || (targetClip.startTime + targetClip.duration),
    };
    
    store.pushHistory('Trim Clip');

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - dragState.current.startX;
      const deltaTime = pixelsToTime(deltaX, store.pixelsPerSecond, store.zoom);
      
      if (edge === 'start') {
        let newStartTime = dragState.current.initialStartTime + deltaTime;
        if (store.snapEnabled) {
          newStartTime = snapTime(newStartTime, store.tracks, store.markers, store.snapThreshold);
        }
        newStartTime = clampTime(newStartTime, 0, dragState.current.initialEndTime - 0.1);
        store.trimClipStart(clipId, newStartTime);
      } else {
        let newEndTime = dragState.current.initialEndTime + deltaTime;
        if (store.snapEnabled) {
          newEndTime = snapTime(newEndTime, store.tracks, store.markers, store.snapThreshold);
        }
        newEndTime = clampTime(newEndTime, dragState.current.initialStartTime + 0.1, store.duration);
        store.trimClipEnd(clipId, newEndTime);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setIsResizing(false);
      onResizeEnd?.();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [clipId, edge, store, onResizeStart, onResizeEnd]);

  return { isResizing, handleMouseDown };
}

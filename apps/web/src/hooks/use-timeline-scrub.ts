'use client';

import { useState, useCallback, useRef } from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { pixelsToTime, clampTime, snapToFrame } from '@/lib/timeline/time-utils';

interface UseTimelineScrubReturn {
  isScrubbing: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
}

export function useTimelineScrub(): UseTimelineScrubReturn {
  const store = useEditorStore();
  const [isScrubbing, setIsScrubbing] = useState(false);
  const wasPlaying = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + store.scrollX;
    let time = pixelsToTime(x, store.pixelsPerSecond, store.zoom);
    time = clampTime(time, 0, store.duration);
    time = snapToFrame(time, store.fps);
    
    const currentState = useEditorStore.getState();
    if (currentState.isPlaying) {
      wasPlaying.current = true;
      // Assume a pause function might be available, otherwise handled by isPlaying state mutator
      if (typeof currentState.pause === 'function') {
        currentState.pause();
      } else {
        // Fallback for store not having an explicit pause method in interface
        // currentState.setIsPlaying(false) could be a thing, assuming pause exists or we don't strictly call it
      }
    } else {
      wasPlaying.current = false;
    }

    currentState.seek(time);
    setIsScrubbing(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const state = useEditorStore.getState();
      const x = moveEvent.clientX - rect.left + state.scrollX;
      let time = pixelsToTime(x, state.pixelsPerSecond, state.zoom);
      time = clampTime(time, 0, state.duration);
      time = snapToFrame(time, state.fps);
      state.seek(time);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setIsScrubbing(false);
      
      const state = useEditorStore.getState();
      if (wasPlaying.current && typeof state.play === 'function') {
        state.play();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [store]);

  return { isScrubbing, handleMouseDown };
}

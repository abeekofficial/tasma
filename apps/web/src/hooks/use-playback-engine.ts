'use client';

import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { snapToFrame } from '@/lib/timeline/time-utils';

export function usePlaybackEngine(): void {
  const store = useEditorStore();
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  useEffect(() => {
    // We assume the store has `isPlaying`, `currentTime`, `duration`, `fps`, `seek`, and `pause` 
    // properties, matching typical useEditorStore definitions.
    const state = useEditorStore.getState();
    const isPlaying = (state as any).isPlaying;
    
    if (!isPlaying) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = undefined;
      return;
    }

    const animate = (time: number) => {
      if (lastTimeRef.current !== undefined) {
        const deltaTimeMs = time - lastTimeRef.current;
        const deltaTimeSec = deltaTimeMs / 1000;
        
        const currentState = useEditorStore.getState();
        let newTime = currentState.currentTime + deltaTimeSec;
        
        if (newTime >= currentState.duration) {
          currentState.seek(0);
          if (typeof (currentState as any).pause === 'function') {
            (currentState as any).pause();
          }
          lastTimeRef.current = undefined;
          return;
        } else {
          const frameAccurateTime = snapToFrame(newTime, currentState.fps);
          if (frameAccurateTime !== currentState.currentTime) {
            currentState.seek(frameAccurateTime);
          }
        }
      }
      
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [(store as any).isPlaying]); // Subscribe to isPlaying
}

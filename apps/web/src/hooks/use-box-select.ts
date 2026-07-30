'use client';

import { useState, useCallback, useRef } from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { pixelsToTime } from '@/lib/timeline/time-utils';
import { rangesOverlap } from '@/lib/timeline/snap-engine';

interface UseBoxSelectReturn {
  isSelecting: boolean;
  selectionRect: { x: number; y: number; width: number; height: number } | null;
  handleMouseDown: (e: React.MouseEvent) => void;
}

export function useBoxSelect(): UseBoxSelectReturn {
  const store = useEditorStore();
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.clip-element')) return;
    
    startPos.current = { x: e.clientX, y: e.clientY };
    const rect = e.currentTarget.getBoundingClientRect();
    const containerOffsetX = e.clientX - rect.left + store.scrollX;
    const containerOffsetY = e.clientY - rect.top;

    setIsSelecting(true);
    setSelectionRect({ x: containerOffsetX, y: containerOffsetY, width: 0, height: 0 });
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.clientX;
      const currentY = moveEvent.clientY;
      
      const width = Math.abs(currentX - startPos.current.x);
      const height = Math.abs(currentY - startPos.current.y);
      
      const x = Math.min(currentX, startPos.current.x) - rect.left + store.scrollX;
      const y = Math.min(currentY, startPos.current.y) - rect.top;
      
      setSelectionRect({ x, y, width, height });
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      const state = useEditorStore.getState();
      
      // We rely on closure state for startPos
      if (startPos.current.x !== upEvent.clientX || startPos.current.y !== upEvent.clientY) {
         const width = Math.abs(upEvent.clientX - startPos.current.x);
         const height = Math.abs(upEvent.clientY - startPos.current.y);
         const rx = Math.min(upEvent.clientX, startPos.current.x) - rect.left + state.scrollX;
         const ry = Math.min(upEvent.clientY, startPos.current.y) - rect.top;
         
         const startTime = pixelsToTime(rx, state.pixelsPerSecond, state.zoom);
         const endTime = pixelsToTime(rx + width, state.pixelsPerSecond, state.zoom);
         
         const selectedClipIds: string[] = [];
         
         let trackStartY = 0;
         const trackHeight = 80;
         for (const track of state.tracks) {
           const trackEndY = trackStartY + trackHeight;
           
           const verticallyOverlaps = ry < trackEndY && (ry + height) > trackStartY;
           
           if (verticallyOverlaps) {
             for (const clip of track.clips) {
               const clipEndTime = clip.endTime || (clip.startTime + clip.duration);
               if (rangesOverlap(startTime, endTime, clip.startTime, clipEndTime)) {
                 selectedClipIds.push(clip.id);
               }
             }
           }
           trackStartY = trackEndY;
         }
         
         if (selectedClipIds.length > 0) {
           state.selectClips(selectedClipIds, upEvent.shiftKey);
         } else if (!upEvent.shiftKey) {
           state.clearSelection();
         }
      } else if (!upEvent.shiftKey) {
          state.clearSelection();
      }
      
      setIsSelecting(false);
      setSelectionRect(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [store]);

  return { isSelecting, selectionRect, handleMouseDown };
}

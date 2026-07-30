'use client';

import { useState, useCallback, useRef } from 'react';
import { useEditorStore } from '@/stores/editor-store';

interface UseTrackReorderOptions {
  trackId: string;
}

interface UseTrackReorderReturn {
  isDragging: boolean;
  dragOverIndex: number | null;
  handleDragStart: (e: React.MouseEvent) => void;
}

export function useTrackReorder(options: UseTrackReorderOptions): UseTrackReorderReturn {
  const { trackId } = options;
  const store = useEditorStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  const dragState = useRef({
    startY: 0,
    initialIndex: 0,
  });

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    const track = store.tracks.find(t => t.id === trackId);
    if (track?.locked) return;
    
    const initialIndex = store.tracks.findIndex(t => t.id === trackId);
    if (initialIndex === -1) return;

    setIsDragging(true);
    setDragOverIndex(initialIndex);
    
    dragState.current = {
      startY: e.clientY,
      initialIndex,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - dragState.current.startY;
      const trackHeight = 80;
      const indexOffset = Math.round(deltaY / trackHeight);
      let newIndex = dragState.current.initialIndex + indexOffset;
      
      const tracks = useEditorStore.getState().tracks;
      newIndex = Math.max(0, Math.min(tracks.length - 1, newIndex));
      
      setDragOverIndex(newIndex);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      const state = useEditorStore.getState();
      
      setDragOverIndex(currentDragOver => {
        if (currentDragOver !== null && currentDragOver !== dragState.current.initialIndex) {
          const trackIds = state.tracks.map(t => t.id);
          trackIds.splice(dragState.current.initialIndex, 1);
          trackIds.splice(currentDragOver, 0, trackId);
          
          state.reorderTracks(trackIds);
          state.pushHistory('Reorder Tracks');
        }
        return null;
      });
      
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [trackId, store]);

  return { isDragging, dragOverIndex, handleDragStart };
}

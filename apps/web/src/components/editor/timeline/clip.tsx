'use client';

import React from 'react';
import { cn } from '@/components/ui/button';
import { useEditor } from '@/hooks/use-editor-state';

// Using local type
interface ClipType {
  id: string;
  trackId: string;
  type: 'video' | 'audio' | 'image' | 'text' | 'shape' | 'subtitle';
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  locked: boolean;
}

interface ClipProps {
  clip: ClipType;
  pixelsPerSecond: number;
}

export const Clip = React.memo(({ clip, pixelsPerSecond }: ClipProps) => {
  const { state, dispatch } = useEditor();
  const isSelected = state.selectedClipIds?.includes(clip.id);

  const left = clip.startTime * pixelsPerSecond;
  const width = clip.duration * pixelsPerSecond;

  const colorStyles = {
    video: 'bg-blue-500/20 border-blue-500/40',
    audio: 'bg-emerald-500/20 border-emerald-500/40',
    text: 'bg-amber-500/20 border-amber-500/40',
    image: 'bg-purple-500/20 border-purple-500/40',
    subtitle: 'bg-cyan-500/20 border-cyan-500/40',
    shape: 'bg-rose-500/20 border-rose-500/40',
  }[clip.type];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      // Add to selection
      dispatch({ type: 'SELECT_CLIPS', payload: { clipIds: [...(state.selectedClipIds || []), clip.id] } });
    } else {
      // Select only this
      dispatch({ type: 'SELECT_CLIPS', payload: { clipIds: [clip.id] } });
    }
  };

  return (
    <div
      className={cn(
        "absolute h-12 rounded-md border flex items-center overflow-hidden group cursor-pointer transition-shadow",
        colorStyles,
        isSelected && "ring-2 ring-violet-500 shadow-lg shadow-violet-500/10 z-10",
        clip.locked && "opacity-50 cursor-not-allowed"
      )}
      style={{ left: `${left}px`, width: `${width}px`, top: '50%', transform: 'translateY(-50%)' }}
      onClick={handleClick}
    >
      {/* Left Resize Handle */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/0 group-hover:bg-white/20 cursor-ew-resize hover:bg-white/40 transition-colors" />
      
      {/* Content */}
      <div className="px-2 w-full truncate">
        <span className="text-xs text-zinc-200 font-medium drop-shadow-sm select-none">
          {clip.name}
        </span>
      </div>

      {/* Right Resize Handle */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/0 group-hover:bg-white/20 cursor-ew-resize hover:bg-white/40 transition-colors" />
    </div>
  );
});
Clip.displayName = 'Clip';

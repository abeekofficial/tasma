'use client';

import React from 'react';
import { Film, Music, Type, Image as ImageIcon, Sparkles, Captions, Lock, Unlock, Eye, EyeOff, Volume2, VolumeX, GripVertical } from 'lucide-react';
import { cn } from '@/components/ui/button';
import { Clip as ClipComponent } from './clip';
import { useEditor } from '@/hooks/use-editor-state';

// Using types locally since they aren't generated yet
interface TrackType {
  id: string;
  type: 'video' | 'audio' | 'text' | 'image' | 'effect' | 'subtitle';
  name: string;
  isLocked: boolean;
  isVisible: boolean;
  isMuted: boolean;
  volume: number;
  clips: any[];
}

interface TrackProps {
  track: TrackType;
  index: number;
  pixelsPerSecond: number;
}

export const Track = React.memo(({ track, index, pixelsPerSecond }: TrackProps) => {
  const { state, dispatch } = useEditor();
  const isSelected = state.selectedTrackId === track.id;

  const TrackIcon = {
    video: Film,
    audio: Music,
    text: Type,
    image: ImageIcon,
    effect: Sparkles,
    subtitle: Captions,
  }[track.type];

  const handleTrackClick = () => {
    dispatch({ type: 'SELECT_TRACK', payload: { trackId: track.id } });
  };

  const handleEmptyAreaClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      dispatch({ type: 'CLEAR_SELECTION' });
    }
  };

  return (
    <div className="flex relative h-16 group">
      {/* Track Header (Overlaying the left side, fixed via parent but here rendered for reference or moved to parent) - In actual implementation, headers are usually fixed on the left and content scrolls. Assuming we inject this via portal or absolute positioning if needed, but for simplicity in this DOM structure, we let the parent handle the left panel and this just renders the row background and clips. Wait, the prompt says "Track Component" handles both? The layout requested split them. Let's make this component just the track row content, and assume the parent uses a similar loop for headers. OR we can use CSS grid. 
      Let's render just the content area here and assume TimelinePanel handles headers to keep scroll sync simple.
      Wait, the prompt says: "Track Content (right side, scrollable)".
      We will just render the content area.
      */}
      <div 
        className={cn(
          "w-full h-full relative border-b border-zinc-800/50 flex items-center",
          index % 2 === 0 ? "bg-zinc-900" : "bg-zinc-900/70"
        )}
        onClick={handleEmptyAreaClick}
      >
        {track.clips.map(clip => (
          <ClipComponent key={clip.id} clip={clip} pixelsPerSecond={pixelsPerSecond} />
        ))}
      </div>
    </div>
  );
});
Track.displayName = 'Track';

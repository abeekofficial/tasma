'use client';

import React from 'react';
import { Plus, Play, Pause, Square, Maximize2 } from 'lucide-react';
import { cn } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEditor } from '@/hooks/use-editor-state';
import { TimeRuler } from './time-ruler';
import { Track } from './track';
import { Playhead } from './playhead';

export function TimelinePanel() {
  const { state, dispatch } = useEditor();

  const handlePlayPause = () => {
    dispatch({ type: 'SET_PLAYING', payload: { isPlaying: !state.isPlaying } });
  };

  const handleStop = () => {
    dispatch({ type: 'SET_PLAYING', payload: { isPlaying: false } });
    dispatch({ type: 'SET_CURRENT_TIME', payload: { currentTime: 0 } });
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    const frames = Math.floor((time % 1) * 30);
    return `00:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  const pixelsPerSecond = 60 * state.zoom;
  const timelineWidth = state.duration * pixelsPerSecond;

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-t border-zinc-800">
      {/* Timeline Header */}
      <div className="flex items-center justify-between h-10 px-4 bg-zinc-900 border-b border-zinc-800 shrink-0">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-7 px-2">
            <Plus className="w-4 h-4 mr-1" />
            <span className="text-xs">Add Track</span>
          </Button>
          <div className="w-px h-4 bg-zinc-800 mx-2" />
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handlePlayPause}>
            {state.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleStop}>
            <Square className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-center">
          <Input 
            value={formatTime(state.currentTime)}
            readOnly
            className="w-28 h-7 text-center font-mono text-xs bg-zinc-950 border-zinc-800"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input 
            type="range" 
            min="0.1" 
            max="10" 
            step="0.1" 
            value={state.zoom}
            readOnly
            className="w-24 accent-violet-500 bg-zinc-800 rounded-lg h-1"
          />
          <span className="text-xs text-zinc-400 font-mono w-12 text-right">
            {Math.round(state.zoom * 100)}%
          </span>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 ml-1">
            <Maximize2 className="w-4 h-4 text-zinc-400" />
          </Button>
        </div>
      </div>

      {/* Timeline Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Track Headers (Fixed Left) */}
        <div className="w-48 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0 overflow-y-auto hidden-scrollbar">
          <div className="h-6 shrink-0" /> {/* Ruler spacer */}
          {state.tracks.map(track => (
            <div key={track.id} className="h-16 shrink-0 border-b border-zinc-800/50 flex items-center px-2">
               {/* Track header content rendered by Track component logic normally, simplified here or rendered via Track component if we change structure. For now just placeholder to align with tracks */}
               <span className="text-xs text-zinc-400 truncate">{track.name}</span>
            </div>
          ))}
           <div className="flex-1 min-h-[4rem] flex items-center justify-center border-t border-zinc-800/50">
             <Button variant="ghost" size="sm" className="text-xs text-zinc-500">
               + Add Track
             </Button>
           </div>
        </div>

        {/* Tracks Content (Scrollable Right) */}
        <div className="flex-1 overflow-auto relative bg-[#18181b]">
          <div style={{ width: `${timelineWidth}px`, minWidth: '100%' }} className="relative h-full">
            <TimeRuler zoom={state.zoom} duration={state.duration} currentTime={state.currentTime} />
            <div className="relative w-full" style={{ minHeight: 'calc(100% - 1.5rem)' }}>
              {state.tracks.map((track, index) => (
                <Track key={track.id} track={track} index={index} pixelsPerSecond={pixelsPerSecond} />
              ))}
              <Playhead currentTime={state.currentTime} pixelsPerSecond={pixelsPerSecond} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

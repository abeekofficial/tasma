'use client';

import React from 'react';
import { SkipBack, Play, Pause, SkipForward, Square, Volume2, Maximize, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { useEditor } from '@/hooks/use-editor-state';

export function VideoPreview() {
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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <div className="flex flex-col h-full bg-[#18181b] border-b border-zinc-800">
      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-4 bg-zinc-950 overflow-hidden relative">
        <div className="relative w-full max-w-4xl aspect-video bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#3f3f46 1px, transparent 1px), linear-gradient(90deg, #3f3f46 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <span className="text-zinc-500 font-medium select-none z-10">Preview</span>

          {/* Safe Area Guide */}
          {state.showSafeArea && (
            <div className="absolute inset-[10%] border-2 border-dashed border-yellow-500/50 pointer-events-none z-20" />
          )}

          {/* Center Guides */}
          {state.showGuides && (
            <>
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-cyan-500/50 pointer-events-none z-20" />
              <div className="absolute left-0 right-0 top-1/2 h-px bg-cyan-500/50 pointer-events-none z-20" />
            </>
          )}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="h-14 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between px-4 shrink-0">
        {/* Left Controls */}
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <SkipBack className="w-4 h-4 text-zinc-400" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("w-10 h-10 p-0 rounded-full", state.isPlaying && "bg-violet-600 hover:bg-violet-700 text-white")}
            onClick={handlePlayPause}
          >
            {state.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <SkipForward className="w-4 h-4 text-zinc-400" />
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 ml-1" onClick={handleStop}>
            <Square className="w-4 h-4 text-zinc-400" />
          </Button>

          <div className="text-xs font-mono text-zinc-400 ml-4 select-none">
            <span className="text-zinc-200">{formatTime(state.currentTime)}</span>
            <span className="mx-1">/</span>
            <span>{formatTime(state.duration)}</span>
          </div>
        </div>

        {/* Progress Scrubber */}
        <div className="flex-1 max-w-md mx-6 group cursor-pointer h-6 flex items-center">
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden relative">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-violet-500 group-hover:bg-violet-400 transition-colors"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-zinc-400" />
            <input type="range" min="0" max="1" step="0.01" value={state.volume} readOnly className="w-16 h-1 accent-violet-500 bg-zinc-800 rounded-lg" />
          </div>
          
          <div className="w-px h-4 bg-zinc-800" />

          <select disabled className="bg-transparent text-xs text-zinc-400 outline-none cursor-not-allowed">
            <option>1080p</option>
          </select>

          <div className="w-px h-4 bg-zinc-800" />

          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="w-7 h-7 p-0">
              <ZoomOut className="w-3.5 h-3.5 text-zinc-400" />
            </Button>
            <span className="text-[10px] font-mono text-zinc-400 w-8 text-center">{Math.round((state.previewScale || 1) * 100)}%</span>
            <Button variant="ghost" size="sm" className="w-7 h-7 p-0">
              <ZoomIn className="w-3.5 h-3.5 text-zinc-400" />
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 ml-1">
            <Maximize className="w-4 h-4 text-zinc-400" />
          </Button>
        </div>
      </div>
    </div>
  );
}

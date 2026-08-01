'use client';

import React from 'react';
import { useEditorStore } from '@/stores/editor-store';
import { MousePointer2, Grid3X3, Layers } from 'lucide-react';

export const StatusBar = React.memo(() => {
  const currentTime = useEditorStore(state => state.currentTime);
  const duration = useEditorStore(state => state.duration);
  const fps = useEditorStore(state => state.fps);
  const resolution = useEditorStore(state => state.resolution);
  const zoom = useEditorStore(state => state.zoom);
  const snapEnabled = useEditorStore(state => state.snapEnabled);
  const selectedClipIds = useEditorStore(state => state.selectedClipIds);
  const isPlaying = useEditorStore(state => state.isPlaying);
  
  const formatTimecode = (seconds: number, fps: number = 30) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const f = Math.floor((seconds % 1) * fps);
    
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
  };
  
  const resString = `${resolution.width} × ${resolution.height}`;

  return (
    <div className="h-7 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between px-3 text-[11px] text-zinc-500 flex-shrink-0 select-none shadow-[0_-1px_4px_rgba(0,0,0,0.5)] z-50">
      
      {/* Left - Timecode & State */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 font-mono">
          <span className="text-zinc-300 font-medium tracking-wide">{formatTimecode(currentTime, fps)}</span>
          <div className="w-[1px] h-3 bg-zinc-800" />
          <span className="tracking-wide">{formatTimecode(duration, fps)}</span>
        </div>
        
        {isPlaying && (
           <span className="text-indigo-400 font-semibold px-2 border-l border-zinc-800">PLAYING</span>
        )}
      </div>

      {/* Center - Project Settings & Status */}
      <div className="flex items-center space-x-4">
        <span>{resString}</span>
        <span>{fps} fps</span>
        
        <div className="flex items-center gap-1.5 ml-2">
           <Grid3X3 size={12} className={snapEnabled ? "text-emerald-500" : "text-zinc-600"} />
           <span className={snapEnabled ? "text-zinc-300" : "text-zinc-600"}>Snap</span>
        </div>
        
        {selectedClipIds.length > 0 && (
          <div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded">
            <Layers size={12} />
            <span>{selectedClipIds.length} Selected</span>
          </div>
        )}
      </div>

      {/* Right - View & Shortcuts */}
      <div className="flex items-center space-x-4">
        <span className="font-mono">Zoom: {Math.round(zoom * 100)}%</span>
        <span className="text-zinc-600 border-l border-zinc-800 pl-4">⌘Z Undo • ⌘S Save • Space Play</span>
      </div>
    </div>
  );
});

StatusBar.displayName = 'StatusBar';

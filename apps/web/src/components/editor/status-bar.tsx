'use client';

import React from 'react';
import { useEditor } from '@/hooks/use-editor-state';

export const StatusBar = React.memo(() => {
  const { state } = useEditor();
  
  // Safe defaults if state parts are missing
  const currentTime = state?.playback?.currentTime || 0;
  const duration = state?.project?.duration || 60; // 1 minute default
  
  const formatTimecode = (seconds: number, fps: number = 30) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const f = Math.floor((seconds % 1) * fps);
    
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
  };
  
  const fps = state?.project?.settings?.fps || 30;
  const resolution = state?.project?.settings?.resolution || '1080 × 1920';
  const zoom = state?.editor?.zoom || 100;

  return (
    <div className="h-7 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between px-3 text-[11px] text-zinc-500 flex-shrink-0 select-none">
      {/* Left */}
      <div className="flex items-center space-x-2 font-mono">
        <span className="text-zinc-300 font-medium">{formatTimecode(currentTime, fps)}</span>
        <div className="w-[1px] h-3 bg-zinc-800" />
        <span>/ {formatTimecode(duration, fps)}</span>
      </div>

      {/* Center */}
      <div className="flex items-center space-x-4">
        <span>{resolution}</span>
        <span>{fps} fps</span>
      </div>

      {/* Right */}
      <div className="flex items-center space-x-4">
        <span>Zoom: {Math.round(zoom)}%</span>
        <span className="text-zinc-600">⌘Z Undo • ⌘S Save • Space Play</span>
      </div>
    </div>
  );
});

StatusBar.displayName = 'StatusBar';

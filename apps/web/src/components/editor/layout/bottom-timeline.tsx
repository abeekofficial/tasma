"use client";

import React, { useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { TimelineWorkspace } from "../timeline/timeline-workspace";
import { PlaybackControls } from "../timeline/playback-controls";
import { TimelineMinimap } from "../timeline/timeline-minimap";

export const BottomTimeline = () => {
  const [zoom, setZoom] = useState(50);

  return (
    <div className="flex flex-col h-72 border-t border-zinc-900 bg-zinc-950 text-zinc-300 text-sm shrink-0">
      {/* Top Toolbar */}
      <div className="h-12 border-b border-zinc-900 flex items-center justify-between px-4 bg-zinc-950 shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-30">
        
        {/* Playback Controls Component */}
        <div className="w-1/3 flex items-center">
          <PlaybackControls />
        </div>

        {/* Timecode & Minimap */}
        <div className="w-1/3 flex flex-col items-center justify-center gap-1">
          <div className="font-mono text-indigo-400 text-lg tracking-widest font-bold bg-black/50 px-4 py-0.5 rounded border border-zinc-800 shadow-inner shadow-black/80">
            00:00:12:15
          </div>
        </div>

        {/* Zoom Controls & Minimap */}
        <div className="w-1/3 flex items-center justify-end gap-4">
          <TimelineMinimap />
          <div className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-lg border border-zinc-800/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.5)]">
            <ZoomOut size={16} className="text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors" />
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-24 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500"
            />
            <ZoomIn size={16} className="text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      {/* Main Timeline Workspace Component */}
      <TimelineWorkspace />
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, ZoomIn, ZoomOut } from "lucide-react";

export const BottomTimeline = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(50);

  return (
    <div className="flex flex-col h-72 border-t border-zinc-800 bg-zinc-950 text-zinc-300 text-sm shrink-0">
      {/* Top Toolbar */}
      <div className="h-10 border-b border-zinc-800/50 flex items-center justify-between px-4 bg-zinc-900/50">
        
        {/* Playback Controls */}
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors" title="Step Back">
            <SkipBack size={14} />
          </button>
          <button 
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-200 transition-colors"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          </button>
          <button className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors" title="Step Forward">
            <SkipForward size={14} />
          </button>
        </div>

        {/* Timecode */}
        <div className="flex-1 flex justify-center">
          <div className="font-mono text-indigo-400 text-lg tracking-wider font-semibold bg-zinc-950 px-3 py-0.5 rounded border border-zinc-800 shadow-inner shadow-black/50">
            00:00:12:15
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <ZoomOut size={14} className="text-zinc-500" />
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-24 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <ZoomIn size={14} className="text-zinc-500" />
        </div>
      </div>

      {/* Main Timeline Area Placeholder */}
      <div className="flex flex-1 overflow-hidden">
        {/* Track Headers */}
        <div className="w-64 border-r border-zinc-800 bg-zinc-900/80 flex flex-col pt-6 shrink-0">
          <div className="h-20 border-b border-zinc-800/50 p-2 flex flex-col justify-center bg-zinc-900 hover:bg-zinc-800/80 transition-colors">
            <span className="text-xs font-medium text-zinc-400">V1</span>
          </div>
          <div className="h-20 border-b border-zinc-800/50 p-2 flex flex-col justify-center bg-zinc-900 hover:bg-zinc-800/80 transition-colors">
            <span className="text-xs font-medium text-zinc-400">V2</span>
          </div>
          <div className="h-20 border-b border-zinc-800/50 p-2 flex flex-col justify-center bg-zinc-900/60 hover:bg-zinc-800/80 transition-colors">
            <span className="text-xs font-medium text-zinc-400">A1</span>
          </div>
        </div>

        {/* Tracks / Clips */}
        <div className="flex-1 bg-zinc-950 relative overflow-hidden">
          {/* Time Ruler Placeholder */}
          <div className="h-6 border-b border-zinc-800/50 bg-zinc-900/30 w-full absolute top-0 left-0 flex items-end px-2">
             {/* Small ticks could go here */}
          </div>
          
          {/* Playhead Placeholder */}
          <div className="absolute top-0 bottom-0 w-[1px] bg-red-500 left-1/3 z-10 shadow-[0_0_8px_rgba(239,68,68,0.5)]">
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-red-500 absolute -top-0 -left-[4.5px]" />
          </div>

          <div className="pt-6 h-full flex flex-col relative">
             {/* Clip in V1 */}
            <div className="h-20 border-b border-zinc-800/50 relative group">
              <div className="absolute top-2 left-20 w-48 h-16 bg-indigo-600/20 border border-indigo-500/50 rounded flex items-center px-2 hover:border-indigo-400 cursor-pointer transition-colors">
                <span className="text-xs text-indigo-300 truncate">main_clip_01.mp4</span>
              </div>
            </div>
            {/* Clip in V2 */}
            <div className="h-20 border-b border-zinc-800/50 relative group">
              <div className="absolute top-2 left-40 w-32 h-16 bg-purple-600/20 border border-purple-500/50 rounded flex items-center px-2 hover:border-purple-400 cursor-pointer transition-colors">
                <span className="text-xs text-purple-300 truncate">overlay_text.png</span>
              </div>
            </div>
            {/* Clip in A1 */}
            <div className="h-20 border-b border-zinc-800/50 relative group">
              <div className="absolute top-2 left-20 w-48 h-16 bg-emerald-600/20 border border-emerald-500/50 rounded flex items-center px-2 hover:border-emerald-400 cursor-pointer transition-colors">
                 <span className="text-xs text-emerald-300 truncate">audio_track_01.wav</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

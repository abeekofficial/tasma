"use client";

import React, { useState } from "react";
import { SkipBack, StepBack, Play, Pause, Square, StepForward, SkipForward, Repeat } from "lucide-react";

export const PlayControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  return (
    <div className="flex items-center gap-1 bg-zinc-900/80 p-1.5 rounded-lg border border-zinc-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.5)]">
      <button className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors" title="Jump to Start">
        <SkipBack size={16} />
      </button>
      <button className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors" title="Previous Frame">
        <StepBack size={16} />
      </button>
      
      <button 
        className="p-1.5 text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700/50 shadow-sm transition-colors"
        onClick={() => setIsPlaying(!isPlaying)}
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={18} className="fill-zinc-200" /> : <Play size={18} className="fill-zinc-200 ml-0.5" />}
      </button>
      
      <button className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors" title="Stop">
        <Square size={16} className="fill-current" />
      </button>
      <button className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors" title="Next Frame">
        <StepForward size={16} />
      </button>
      <button className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors" title="Jump to End">
        <SkipForward size={16} />
      </button>

      <div className="w-px h-5 bg-zinc-800 mx-1" />

      <button 
        className={`p-1.5 rounded transition-colors ${isLooping ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'}`}
        onClick={() => setIsLooping(!isLooping)}
        title="Toggle Loop"
      >
        <Repeat size={16} />
      </button>
    </div>
  );
};

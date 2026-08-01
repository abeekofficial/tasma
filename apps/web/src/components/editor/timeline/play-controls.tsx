"use client";

import React from "react";
import { SkipBack, StepBack, Play, Pause, Square, StepForward, SkipForward, Repeat, Volume2, VolumeX, Gauge } from "lucide-react";
import { usePlayback, useEditor } from "@/hooks/use-editor-state";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

export const PlayControls = () => {
  const { 
    isPlaying, 
    togglePlayPause, 
    stop, 
    stepFrame, 
    seek, 
    duration,
    volume,
    isMuted,
    setVolume,
    toggleMute
  } = usePlayback();
  
  const { state } = useEditor();
  const [isLooping, setIsLooping] = React.useState(false);

  return (
    <div className="flex items-center gap-1 bg-zinc-900/90 backdrop-blur-xl p-1.5 rounded-xl border border-zinc-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_10px_rgba(0,0,0,0.5)]">
      
      {/* Speed & Loop */}
      <div className="flex items-center gap-0.5 px-1">
        <button 
          className={`p-1.5 rounded-lg transition-all duration-200 ${isLooping ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'}`}
          onClick={() => setIsLooping(!isLooping)}
          title="Toggle Loop"
        >
          <Repeat size={14} />
        </button>
        <button className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-all duration-200" title="Playback Speed">
          <Gauge size={14} />
        </button>
      </div>

      <div className="w-px h-5 bg-zinc-800 mx-1" />

      {/* Main Controls */}
      <button 
        onClick={() => seek(0)}
        className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors" title="Jump to Start"
      >
        <SkipBack size={16} />
      </button>
      <button 
        onClick={() => stepFrame(-1)}
        className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors" title="Previous Frame"
      >
        <StepBack size={16} />
      </button>
      
      <button 
        className="p-2.5 mx-1 text-zinc-100 bg-zinc-800 hover:bg-zinc-700 hover:text-white rounded-lg border border-zinc-700/50 shadow-sm transition-all duration-200 active:scale-95"
        onClick={togglePlayPause}
        title={isPlaying ? "Pause (Space)" : "Play (Space)"}
      >
        {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current ml-0.5" />}
      </button>
      
      <button 
        onClick={stop}
        className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors" title="Stop"
      >
        <Square size={16} className="fill-current" />
      </button>
      <button 
        onClick={() => stepFrame(1)}
        className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors" title="Next Frame"
      >
        <StepForward size={16} />
      </button>
      <button 
        onClick={() => seek(duration)}
        className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors" title="Jump to End"
      >
        <SkipForward size={16} />
      </button>

      <div className="w-px h-5 bg-zinc-800 mx-1" />

      {/* Volume */}
      <div className="flex items-center px-1">
        <Popover>
          <PopoverTrigger asChild>
            <button className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors">
              {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-32 p-3 bg-zinc-900 border-zinc-800 mb-2">
            <div className="flex items-center gap-3">
              <button onClick={toggleMute} className="text-zinc-400 hover:text-white">
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                min={0}
                max={100}
                step={1}
                onValueChange={(val) => {
                  if (isMuted && val[0] > 0) toggleMute();
                  setVolume(val[0] / 100);
                }}
                className="flex-1"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>

    </div>
  );
};

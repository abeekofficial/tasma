"use client";

import React, { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, StepBack, StepForward } from "lucide-react";
import { motion } from "framer-motion";

export const PlaybackControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-1 border border-zinc-800/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.5)]">
      <motion.button 
        whileTap={{ scale: 0.95 }}
        className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors shadow-sm" 
        title="Jump to Start"
      >
        <SkipBack size={16} />
      </motion.button>
      <motion.button 
        whileTap={{ scale: 0.95 }}
        className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors shadow-sm" 
        title="Step Back Frame"
      >
        <StepBack size={16} />
      </motion.button>
      
      <motion.button 
        whileTap={{ scale: 0.95 }}
        className="mx-1 p-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors shadow-[inset_0_1px_0px_rgba(255,255,255,0.1),0_1px_2px_rgba(0,0,0,0.4)] border border-zinc-700/50"
        onClick={() => setIsPlaying(!isPlaying)}
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
      </motion.button>
      
      <motion.button 
        whileTap={{ scale: 0.95 }}
        className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors shadow-sm" 
        title="Step Forward Frame"
      >
        <StepForward size={16} />
      </motion.button>
      <motion.button 
        whileTap={{ scale: 0.95 }}
        className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors shadow-sm" 
        title="Jump to End"
      >
        <SkipForward size={16} />
      </motion.button>
    </div>
  );
};

"use client";

import React from "react";
import { motion } from "framer-motion";

export const TimelineWorkspace = () => {
  return (
    <div className="flex flex-1 overflow-hidden relative bg-zinc-950">
      {/* Track Headers */}
      <div className="w-64 border-r border-zinc-900 bg-zinc-900/90 flex flex-col pt-7 shrink-0 z-20 shadow-[4px_0_16px_rgba(0,0,0,0.6)]">
        <div className="h-20 border-b border-zinc-800/40 p-3 flex flex-col justify-center bg-gradient-to-r from-zinc-900 to-zinc-800/30 hover:bg-zinc-800/80 transition-colors cursor-pointer group">
          <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">V2</span>
        </div>
        <div className="h-20 border-b border-zinc-800/40 p-3 flex flex-col justify-center bg-gradient-to-r from-zinc-900 to-zinc-800/30 hover:bg-zinc-800/80 transition-colors cursor-pointer group">
          <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">V1</span>
        </div>
        <div className="h-20 border-b border-zinc-800/40 p-3 flex flex-col justify-center bg-gradient-to-r from-zinc-950 to-zinc-900/40 hover:bg-zinc-900/80 transition-colors cursor-pointer group">
          <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">A1</span>
        </div>
      </div>

      {/* Tracks / Clips Container */}
      <div className="flex-1 relative overflow-x-auto overflow-y-hidden select-none bg-[repeating-linear-gradient(90deg,transparent,transparent_49px,rgba(255,255,255,0.02)_49px,rgba(255,255,255,0.02)_50px)]">
        
        {/* Time Ruler */}
        <div className="h-7 border-b border-zinc-800/60 bg-zinc-900/95 backdrop-blur-md w-[200%] absolute top-0 left-0 flex items-end z-10 sticky-top">
           {/* Ticks */}
           {Array.from({ length: 40 }).map((_, i) => (
             <div key={i} className="w-[50px] border-l border-zinc-700/50 h-2/3 flex items-start text-[9px] text-zinc-500 pl-1 font-mono">
               00:00:{i.toString().padStart(2, '0')}
             </div>
           ))}
        </div>
        
        {/* Playhead */}
        <motion.div 
          initial={{ x: 150 }}
          className="absolute top-0 bottom-0 w-[1px] bg-red-500 z-20 pointer-events-none shadow-[0_0_8px_rgba(239,68,68,0.6)]"
        >
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500 absolute -top-0 -left-[5.5px]" />
          <div className="w-4 h-4 bg-red-500/20 absolute -top-0 -left-[7.5px] rounded-full blur-[2px]" />
        </motion.div>

        <div className="pt-7 h-full flex flex-col relative w-[200%]">
           {/* Clip in V2 */}
          <div className="h-20 border-b border-zinc-800/30 relative group bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.01)_10px,rgba(255,255,255,0.01)_20px)]">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="absolute top-2 left-64 w-32 h-16 bg-purple-600/30 border border-purple-500/80 rounded-md shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_6px_rgba(0,0,0,0.3)] flex flex-col justify-center px-3 cursor-pointer transition-colors hover:bg-purple-600/40 backdrop-blur-sm"
            >
              <span className="text-xs font-medium text-purple-50 truncate drop-shadow-md">Title Text</span>
              <span className="text-[10px] text-purple-300 font-mono mt-0.5">00:00:02:00</span>
            </motion.div>
          </div>
           
           {/* Clip in V1 */}
          <div className="h-20 border-b border-zinc-800/30 relative group bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.01)_10px,rgba(255,255,255,0.01)_20px)]">
            <motion.div 
              whileHover={{ scale: 1.005 }}
              className="absolute top-2 left-10 w-96 h-16 bg-indigo-600/30 border border-indigo-500/80 rounded-md shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_6px_rgba(0,0,0,0.3)] flex flex-col justify-center px-3 cursor-pointer transition-colors hover:bg-indigo-600/40 backdrop-blur-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              <span className="text-xs font-medium text-indigo-50 truncate drop-shadow-md z-10">main_interview_cam_01.mp4</span>
              <span className="text-[10px] text-indigo-300 font-mono mt-0.5 z-10">00:00:00:00</span>
            </motion.div>
          </div>
          
          {/* Clip in A1 */}
          <div className="h-20 border-b border-zinc-800/30 relative group bg-zinc-950/50">
            <motion.div 
              whileHover={{ scale: 1.005 }}
              className="absolute top-2 left-10 w-96 h-16 bg-emerald-600/20 border border-emerald-500/60 rounded-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_6px_rgba(0,0,0,0.3)] flex flex-col justify-center px-3 cursor-pointer transition-colors hover:bg-emerald-600/30 overflow-hidden"
            >
               <span className="text-xs font-medium text-emerald-100 truncate z-10 drop-shadow-md">audio_mixdown.wav</span>
               {/* Decorative waveform */}
               <div className="absolute bottom-1 left-0 right-0 h-8 flex items-end gap-[1px] opacity-40 px-2">
                 {Array.from({ length: 90 }).map((_, i) => (
                   <div key={i} className="flex-1 bg-emerald-400 rounded-t-sm" style={{ height: `${20 + Math.random() * 80}%` }} />
                 ))}
               </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

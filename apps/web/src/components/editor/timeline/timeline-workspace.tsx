"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { TrackContainer } from "./track-container";
import { StatusBar } from "./status-bar";

export const TimelineWorkspace = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const trackContainerRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);

  const handleCanvasScroll = () => {
    if (canvasRef.current) {
      const { scrollTop, scrollLeft } = canvasRef.current;
      if (trackContainerRef.current) {
        trackContainerRef.current.scrollTop = scrollTop;
      }
      if (rulerRef.current) {
        rulerRef.current.scrollLeft = scrollLeft;
      }
    }
  };

  const handleTrackContainerScroll = () => {
    if (trackContainerRef.current && canvasRef.current) {
      canvasRef.current.scrollTop = trackContainerRef.current.scrollTop;
    }
  };

  const handleRulerScroll = () => {
    if (rulerRef.current && canvasRef.current) {
      canvasRef.current.scrollLeft = rulerRef.current.scrollLeft;
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Track Headers */}
        <div className="w-64 border-r border-zinc-900 bg-zinc-900/90 flex flex-col shrink-0 z-20 shadow-[4px_0_16px_rgba(0,0,0,0.6)]">
          {/* Ruler corner placeholder */}
          <div className="h-7 border-b border-zinc-800/60 bg-zinc-900/95 backdrop-blur-md shrink-0" />
          
          <div 
            ref={trackContainerRef}
            onScroll={handleTrackContainerScroll}
            className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden" 
            style={{ scrollbarWidth: 'none' }}
          >
            <TrackContainer />
          </div>
        </div>

        {/* Tracks / Clips Container */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-[repeating-linear-gradient(90deg,transparent,transparent_49px,rgba(255,255,255,0.02)_49px,rgba(255,255,255,0.02)_50px)]">
          
          {/* Time Ruler */}
          <div 
            ref={rulerRef}
            onScroll={handleRulerScroll}
            className="h-7 border-b border-zinc-800/60 bg-zinc-900/95 backdrop-blur-md overflow-x-auto shrink-0 sticky-top z-10 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="w-[200%] flex items-end h-full">
              {/* Ticks */}
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="w-[50px] border-l border-zinc-700/50 h-2/3 flex items-start text-[9px] text-zinc-500 pl-1 font-mono">
                  00:00:{i.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>
          
          {/* Main Canvas */}
          <div 
            ref={canvasRef}
            onScroll={handleCanvasScroll}
            className="flex-1 overflow-auto relative"
          >
            <div className="w-[200%] flex flex-col relative min-h-max pb-20">
              {/* Playhead */}
              <motion.div 
                initial={{ x: 150 }}
                className="absolute top-0 bottom-0 w-[1px] bg-red-500 z-20 pointer-events-none shadow-[0_0_8px_rgba(239,68,68,0.6)]"
              >
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500 absolute -top-0 -left-[5.5px]" />
                <div className="w-4 h-4 bg-red-500/20 absolute -top-0 -left-[7.5px] rounded-full blur-[2px]" />
              </motion.div>

              {/* 6 Track Lanes to match MOCK_TRACKS */}
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-20 border-b border-zinc-800/30 relative group bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.01)_10px,rgba(255,255,255,0.01)_20px)]">
                  {idx === 1 && (
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className="absolute top-2 left-64 w-32 h-16 bg-yellow-600/30 border border-yellow-500/80 rounded-md shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_6px_rgba(0,0,0,0.3)] flex flex-col justify-center px-3 cursor-pointer transition-colors hover:bg-yellow-600/40 backdrop-blur-sm"
                    >
                      <span className="text-xs font-medium text-yellow-50 truncate drop-shadow-md">Caption Text</span>
                      <span className="text-[10px] text-yellow-300 font-mono mt-0.5">00:00:02:00</span>
                    </motion.div>
                  )}
                  {idx === 2 && (
                    <motion.div 
                      whileHover={{ scale: 1.005 }}
                      className="absolute top-2 left-10 w-96 h-16 bg-blue-600/30 border border-blue-500/80 rounded-md shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_6px_rgba(0,0,0,0.3)] flex flex-col justify-center px-3 cursor-pointer transition-colors hover:bg-blue-600/40 backdrop-blur-sm overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                      <span className="text-xs font-medium text-blue-50 truncate drop-shadow-md z-10">main_interview_cam_01.mp4</span>
                      <span className="text-[10px] text-blue-300 font-mono mt-0.5 z-10">00:00:00:00</span>
                    </motion.div>
                  )}
                  {idx === 3 && (
                    <motion.div 
                      whileHover={{ scale: 1.005 }}
                      className="absolute top-2 left-10 w-96 h-16 bg-emerald-600/20 border border-emerald-500/60 rounded-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_6px_rgba(0,0,0,0.3)] flex flex-col justify-center px-3 cursor-pointer transition-colors hover:bg-emerald-600/30 overflow-hidden"
                    >
                      <span className="text-xs font-medium text-emerald-100 truncate z-10 drop-shadow-md">dialogue_mix.wav</span>
                      <div className="absolute bottom-1 left-0 right-0 h-8 flex items-end gap-[1px] opacity-40 px-2">
                        {Array.from({ length: 90 }).map((_, i) => (
                          <div key={i} className="flex-1 bg-emerald-400 rounded-t-sm" style={{ height: `${20 + Math.random() * 80}%` }} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <StatusBar />
    </div>
  );
};

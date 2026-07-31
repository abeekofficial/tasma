"use client";

import React from "react";
import { motion } from "framer-motion";

export const TimelineMinimap = () => {
  return (
    <div className="h-7 w-48 bg-zinc-950 border border-zinc-800/80 rounded-md flex overflow-hidden relative cursor-ew-resize opacity-75 hover:opacity-100 transition-opacity shadow-inner">
      {/* Scroll Indicator Box */}
      <motion.div 
        initial={{ x: 16 }}
        className="absolute top-0 bottom-0 w-16 bg-zinc-700/40 border border-zinc-500/50 rounded-sm shadow-[0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-sm z-10 pointer-events-none" 
      />
      
      {/* Fake Mini Clips */}
      <div className="absolute top-1 left-1 w-20 h-1 bg-indigo-500/60 rounded-full shadow-[0_0_4px_rgba(99,102,241,0.5)]" />
      <div className="absolute top-2.5 left-6 w-8 h-1 bg-purple-500/60 rounded-full shadow-[0_0_4px_rgba(168,85,247,0.5)]" />
      <div className="absolute top-4 left-1 w-20 h-1 bg-emerald-500/60 rounded-full shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
      <div className="absolute top-1 left-24 w-12 h-1 bg-indigo-500/60 rounded-full shadow-[0_0_4px_rgba(99,102,241,0.5)]" />
      <div className="absolute top-4 left-24 w-12 h-1 bg-emerald-500/60 rounded-full shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
    </div>
  );
};

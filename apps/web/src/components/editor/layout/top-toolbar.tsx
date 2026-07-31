"use client";

import React, { useState } from "react";
import { Undo, Redo, Sparkles, Share, Download, User } from "lucide-react";
import { motion } from "framer-motion";

export const TopToolbar = () => {
  const [projectName, setProjectName] = useState("Untitled Project");

  return (
    <div className="h-14 border-b border-zinc-800 bg-zinc-950 px-4 flex items-center justify-between text-zinc-300 text-sm font-medium shrink-0">
      {/* Left */}
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
            T
          </div>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1 py-0.5 w-32 hover:bg-zinc-800/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
          Saved
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center gap-2 justify-center flex-1">
        <button className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors" title="Undo">
          <Undo size={16} />
        </button>
        <button className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors" title="Redo">
          <Redo size={16} />
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative group flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 text-indigo-300 border border-indigo-500/30 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 group-hover:opacity-100 opacity-50 transition-opacity" />
          <Sparkles size={14} className="relative z-10" />
          <span className="relative z-10 text-xs font-semibold tracking-wide">AI Studio</span>
        </motion.button>
        
        <div className="w-[1px] h-4 bg-zinc-800 mx-1" />
        
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors text-xs">
          <Share size={14} />
          Share
        </button>
        
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-xs font-semibold">
          <Download size={14} />
          Export
        </button>
        
        <button className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-colors ml-1 border border-zinc-700">
          <User size={16} />
        </button>
      </div>
    </div>
  );
};

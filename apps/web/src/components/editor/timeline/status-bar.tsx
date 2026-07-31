"use client";

import React from "react";
import { ZoomIn, ZoomOut, Settings2, Scissors, MousePointer2 } from "lucide-react";

export const StatusBar = () => {
  return (
    <div className="h-10 border-t border-zinc-900 bg-zinc-950 flex items-center justify-between px-4 shrink-0 z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-zinc-400">Ready</span>
        </div>
        <div className="h-4 w-[1px] bg-zinc-800" />
        <div className="flex items-center gap-1.5">
          <button className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-300 transition-colors">
            <MousePointer2 className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-500 hover:text-zinc-300 transition-colors">
            <Scissors className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-300 transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden relative cursor-pointer group">
            <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-zinc-500 rounded-full group-hover:bg-zinc-400 transition-colors" />
          </div>
          <button className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-300 transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
        <div className="h-4 w-[1px] bg-zinc-800" />
        <button className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-300 transition-colors">
          <Settings2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

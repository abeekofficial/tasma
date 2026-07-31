"use client";

import React from "react";
import { Activity } from "lucide-react";

export function PreviewStatusBar() {
  return (
    <div className="flex items-center justify-between px-3 h-7 bg-zinc-950 border-t border-zinc-800 text-zinc-500 text-[10px] uppercase tracking-wider font-mono select-none w-full">
      {/* Left Side: Resolution & Aspect Ratio */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="text-zinc-600">RES</span>
          <span className="text-zinc-300">1920×1080</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-zinc-600">AR</span>
          <span className="text-zinc-300">16:9</span>
        </div>
      </div>

      {/* Right Side: FPS, Zoom, Dropped Frames */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="text-zinc-600">ZOOM</span>
          <span className="text-zinc-300">FIT</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-zinc-600">FPS</span>
          <span className="text-zinc-300">60.00</span>
        </div>
        
        {/* Performance Indicator */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-zinc-800" title="No dropped frames">
          <Activity className="w-3 h-3 text-zinc-600" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"></div>
        </div>
      </div>
    </div>
  );
}

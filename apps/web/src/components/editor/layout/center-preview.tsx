"use client";

import { useState } from "react";
import { Grid, SquareSquare } from "lucide-react";

export function CenterPreview() {
  const [zoom, setZoom] = useState("Fit");
  const [showGrid, setShowGrid] = useState(false);
  const [showSafeArea, setShowSafeArea] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 relative overflow-hidden">
      {/* Top Controls */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 p-1 rounded-lg bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 shadow-lg">
        <select
          value={zoom}
          onChange={(e) => setZoom(e.target.value)}
          className="bg-transparent text-xs font-medium text-zinc-300 outline-none border-none px-2 py-1 cursor-pointer hover:text-zinc-100"
        >
          <option>Fit</option>
          <option>25%</option>
          <option>50%</option>
          <option>100%</option>
          <option>200%</option>
        </select>
        <div className="w-[1px] h-4 bg-zinc-700/50 mx-1" />
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`p-1.5 rounded-md transition-colors ${
            showGrid ? "bg-zinc-800 text-blue-400" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          }`}
          title="Toggle Grid"
        >
          <Grid size={16} />
        </button>
        <button
          onClick={() => setShowSafeArea(!showSafeArea)}
          className={`p-1.5 rounded-md transition-colors ${
            showSafeArea ? "bg-zinc-800 text-blue-400" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          }`}
          title="Safe Area"
        >
          <SquareSquare size={16} />
        </button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative w-full max-w-4xl aspect-video bg-black shadow-2xl rounded-sm overflow-hidden ring-1 ring-zinc-800/50">
          {/* Overlays */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)', backgroundSize: '10% 10%' }} />
          )}
          {showSafeArea && (
            <div className="absolute inset-[10%] border border-blue-500/50 pointer-events-none" />
          )}
          {/* Video Placeholder */}
          <div className="w-full h-full flex items-center justify-center text-zinc-700 font-medium select-none">
            Canvas Output
          </div>
        </div>
      </div>
    </div>
  );
}

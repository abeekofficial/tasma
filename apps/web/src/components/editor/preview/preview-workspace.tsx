"use client";

import { motion } from "framer-motion";
import { Maximize2, Monitor, Settings2, Scissors, MousePointer2, Type, Square, Grip } from "lucide-react";
import { useState } from "react";

function PreviewToolbar() {
  return (
    <div className="flex items-center justify-between h-12 px-4 bg-zinc-950 border-b border-zinc-800">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-zinc-900 rounded-md p-1 border border-zinc-800">
          <button className="p-1.5 bg-zinc-800 text-zinc-100 rounded shadow-sm">
            <MousePointer2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded transition-colors">
            <Scissors className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded transition-colors">
            <Type className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded transition-colors">
            <Square className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono bg-zinc-900 px-3 py-1.5 rounded-md border border-zinc-800">
          <span>1920x1080</span>
          <span className="text-zinc-600">|</span>
          <span>60 FPS</span>
        </div>
        <button className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors">
          <Settings2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function PreviewCanvas() {
  return (
    <div className="flex-1 relative overflow-hidden bg-zinc-950 flex items-center justify-center">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      {/* Canvas Area */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-[70%] aspect-video bg-black shadow-2xl ring-1 ring-zinc-800 overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-zinc-800 font-mono text-xl select-none">PREVIEW_RENDER_TARGET</span>
        </div>
        
        {/* Safe Area Guides */}
        <div className="absolute inset-[10%] border border-zinc-800/50 pointer-events-none border-dashed" />
      </motion.div>
    </div>
  );
}

function PreviewStatusBar() {
  const [zoom, setZoom] = useState("50%");

  return (
    <div className="h-8 flex items-center justify-between px-4 bg-zinc-950 border-t border-zinc-800 text-xs text-zinc-400">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          Render Active
        </span>
        <span className="text-zinc-600">|</span>
        <span className="font-mono">Drop Frame: 0</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <select 
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="bg-transparent outline-none cursor-pointer hover:text-zinc-200 transition-colors"
          >
            <option>Fit</option>
            <option>25%</option>
            <option>50%</option>
            <option>75%</option>
            <option>100%</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="hover:text-zinc-200 transition-colors">
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button className="hover:text-zinc-200 transition-colors">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function PreviewWorkspace() {
  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 text-zinc-100 overflow-hidden">
      <PreviewToolbar />
      <PreviewCanvas />
      <PreviewStatusBar />
    </div>
  );
}

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MousePointer2, Hand, Scissors, Type, 
  Square, ZoomIn, Crop, Expand, Magnet, Grid3X3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Tooltip, TooltipContent, TooltipTrigger, TooltipProvider 
} from '@/components/ui/tooltip';
import { useEditorStore } from '@/stores/editor-store';

const TOOLS = [
  { id: 'selection', icon: MousePointer2, label: 'Selection', shortcut: 'V' },
  { id: 'hand', icon: Hand, label: 'Hand', shortcut: 'H' },
  { id: 'cut', icon: Scissors, label: 'Cut', shortcut: 'B' },
  { id: 'text', icon: Type, label: 'Text', shortcut: 'T' },
  { id: 'shape', icon: Square, label: 'Shape', shortcut: 'U' },
  { id: 'zoom', icon: ZoomIn, label: 'Zoom', shortcut: 'Z' },
  { id: 'crop', icon: Crop, label: 'Crop', shortcut: 'C' },
  { id: 'transform', icon: Expand, label: 'Transform', shortcut: 'E' },
];

export const EditorTools = () => {
  const activeTool = useEditorStore(state => state.activeTool);
  const setActiveTool = useEditorStore(state => state.setActiveTool);
  const snapEnabled = useEditorStore(state => state.snapEnabled);
  const toggleSnap = useEditorStore(state => state.toggleSnap);
  const magneticTimeline = useEditorStore(state => state.magneticTimeline);
  const toggleMagneticTimeline = useEditorStore(state => state.toggleMagneticTimeline);

  return (
    <div className="w-12 h-full flex flex-col items-center justify-between py-4 bg-zinc-950 border-r border-zinc-900 shadow-[2px_0_10px_rgba(0,0,0,0.5)] z-40">
      
      {/* Primary Tools */}
      <TooltipProvider delayDuration={300}>
        <div className="flex flex-col gap-2">
          {TOOLS.map((tool) => {
            const isActive = activeTool === tool.id;
            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setActiveTool(tool.id)}
                    className={cn(
                      "relative p-2.5 rounded-xl flex items-center justify-center transition-colors group outline-none",
                      isActive ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-tool-indicator"
                        className="absolute inset-0 bg-zinc-900 rounded-xl shadow-inner border border-zinc-800/50"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <tool.icon 
                      className="w-4 h-4 relative z-10" 
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border-zinc-800 text-xs">
                  <span className="font-medium text-zinc-200">{tool.label}</span>
                  <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 font-mono">
                    {tool.shortcut}
                  </span>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Bottom Toggles (Snap & Magnet) */}
        <div className="flex flex-col gap-2 relative before:absolute before:-top-3 before:left-3 before:right-3 before:h-px before:bg-zinc-800">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleSnap}
                className={cn(
                  "relative p-2.5 rounded-xl flex items-center justify-center transition-all duration-200",
                  snapEnabled ? "text-emerald-400 bg-emerald-500/10 shadow-[inset_0_0_8px_rgba(16,185,129,0.1)]" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <Grid3X3 className="w-4 h-4" strokeWidth={snapEnabled ? 2.5 : 2} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border-zinc-800 text-xs">
              <span className="font-medium text-zinc-200">Snap to Grid/Clips</span>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleMagneticTimeline}
                className={cn(
                  "relative p-2.5 rounded-xl flex items-center justify-center transition-all duration-200",
                  magneticTimeline ? "text-violet-400 bg-violet-500/10 shadow-[inset_0_0_8px_rgba(139,92,246,0.1)]" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <Magnet className="w-4 h-4" strokeWidth={magneticTimeline ? 2.5 : 2} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border-zinc-800 text-xs">
              <span className="font-medium text-zinc-200">Magnetic Timeline</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

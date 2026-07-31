"use client";

import React, { useState, useCallback } from "react";
import { Lock, Unlock, Eye, EyeOff, Film, Type, Volume2, Settings2 } from "lucide-react";
import { motion } from "framer-motion";

export type TrackType = "video" | "audio" | "subtitle";

export interface TrackHeaderProps {
  id?: string;
  type?: TrackType;
  name?: string;
  color?: string;
  isLocked?: boolean;
  isMuted?: boolean;
  isSolo?: boolean;
  isHidden?: boolean;
  height?: number;
  onHeightChange?: (id: string, height: number) => void;
  onUpdate?: (id: string, updates: Partial<TrackHeaderProps>) => void;
}

export function TrackHeader({
  id = "track-1",
  type = "video",
  name = "Video 1",
  color = "#3b82f6",
  isLocked = false,
  isMuted = false,
  isSolo = false,
  isHidden = false,
  height = 96,
  onHeightChange,
  onUpdate,
}: TrackHeaderProps) {
  const [localHeight, setLocalHeight] = useState(height);
  const minHeight = 48;
  const maxHeight = 300;

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = localHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientY - startY;
      const newHeight = Math.min(Math.max(startHeight + delta, minHeight), maxHeight);
      setLocalHeight(newHeight);
      if (onHeightChange) onHeightChange(id, newHeight);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, [localHeight, id, onHeightChange]);

  const toggleMute = () => onUpdate?.(id, { isMuted: !isMuted });
  const toggleSolo = () => onUpdate?.(id, { isSolo: !isSolo });
  const toggleLock = () => onUpdate?.(id, { isLocked: !isLocked });
  const toggleHidden = () => onUpdate?.(id, { isHidden: !isHidden });
  
  const TrackIcon = type === "video" ? Film : type === "audio" ? Volume2 : Type;

  return (
    <motion.div 
      className="relative flex w-64 flex-none select-none flex-col border-b border-r border-[#1e1e1e] bg-[#141414] text-neutral-300"
      style={{ height: localHeight }}
      layout
    >
      {/* Left Color Strip */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5 opacity-80" 
        style={{ backgroundColor: color }} 
      />

      <div className="flex flex-1 flex-col justify-between p-2 pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-hidden">
            <TrackIcon size={14} className="text-neutral-400 flex-none" />
            <input
              type="text"
              value={name}
              onChange={(e) => onUpdate?.(id, { name: e.target.value })}
              className="w-full truncate rounded bg-transparent px-1 py-0.5 text-xs font-medium text-neutral-200 outline-none transition-colors hover:bg-white/5 focus:bg-white/10"
              readOnly={isLocked}
            />
          </div>
          
          <div className="flex flex-none items-center space-x-0.5 ml-2">
            {type === "video" && (
              <button 
                onClick={toggleHidden}
                className={`rounded p-1 transition-colors hover:bg-white/10 ${isHidden ? "text-neutral-500" : "text-neutral-300"}`}
                title={isHidden ? "Show Track" : "Hide Track"}
              >
                {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            )}
            <button 
              onClick={toggleLock}
              className={`rounded p-1 transition-colors hover:bg-white/10 ${isLocked ? "text-neutral-500" : "text-neutral-300"}`}
              title={isLocked ? "Unlock Track" : "Lock Track"}
            >
              {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
            </button>
          </div>
        </div>

        {localHeight >= 72 && (
          <div className="flex items-center space-x-1 mt-auto">
            {type === "audio" && (
              <>
                <button
                  onClick={toggleMute}
                  className={`flex h-6 w-6 items-center justify-center rounded-[3px] text-[10px] font-bold transition-colors ${
                    isMuted 
                      ? "bg-red-500/20 text-red-500" 
                      : "bg-[#2a2a2a] text-neutral-400 hover:bg-[#333333] hover:text-neutral-200"
                  }`}
                >
                  M
                </button>
                <button
                  onClick={toggleSolo}
                  className={`flex h-6 w-6 items-center justify-center rounded-[3px] text-[10px] font-bold transition-colors ${
                    isSolo 
                      ? "bg-yellow-500/20 text-yellow-500" 
                      : "bg-[#2a2a2a] text-neutral-400 hover:bg-[#333333] hover:text-neutral-200"
                  }`}
                >
                  S
                </button>
              </>
            )}
            <button className="ml-auto rounded p-1 text-neutral-500 hover:bg-white/10 hover:text-neutral-300 transition-colors">
              <Settings2 size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Resize Handle */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1.5 cursor-row-resize hover:bg-white/10 z-10 transition-colors"
        onMouseDown={startResize}
      />
    </motion.div>
  );
}

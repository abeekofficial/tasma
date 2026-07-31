"use client";

import React, { useState, useCallback } from "react";
import { Lock, Unlock, Eye, EyeOff, Film, Type, Volume2, Settings2, GripVertical, ChevronDown, ChevronRight } from "lucide-react";
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const minHeight = 48;
  const maxHeight = 300;

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (isCollapsed) return;
    
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
  }, [localHeight, id, onHeightChange, isCollapsed]);

  const toggleMute = () => onUpdate?.(id, { isMuted: !isMuted });
  const toggleSolo = () => onUpdate?.(id, { isSolo: !isSolo });
  const toggleLock = () => onUpdate?.(id, { isLocked: !isLocked });
  const toggleHidden = () => onUpdate?.(id, { isHidden: !isHidden });
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  
  const TrackIcon = type === "video" ? Film : type === "audio" ? Volume2 : Type;
  const currentHeight = isCollapsed ? 36 : localHeight;

  return (
    <motion.div 
      className="relative flex w-64 flex-none select-none flex-col border-b border-r border-[#1e1e1e] bg-[#141414] text-neutral-300 transition-colors hover:bg-[#1a1a1a]"
      style={{ height: currentHeight }}
      layout
    >
      {/* Left Color Strip */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 opacity-80" 
        style={{ backgroundColor: color }} 
      />
      
      {/* Drag Handle */}
      <div className="absolute left-1 top-0 bottom-0 w-4 flex items-center justify-center cursor-grab active:cursor-grabbing text-neutral-600 hover:text-neutral-400 hover:bg-white/5 transition-colors">
        <GripVertical size={12} />
      </div>

      <div className="flex flex-1 flex-col justify-between py-2 pr-2 pl-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 overflow-hidden">
            <button 
              onClick={toggleCollapse}
              className="p-0.5 rounded hover:bg-white/10 text-neutral-400 transition-colors"
            >
              {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
            </button>
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

        {!isCollapsed && localHeight >= 72 && (
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
      {!isCollapsed && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-1.5 cursor-row-resize hover:bg-white/10 z-10 transition-colors"
          onMouseDown={startResize}
        />
      )}
    </motion.div>
  );
}

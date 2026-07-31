"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Film, Music, Type } from "lucide-react";

export interface ClipBlockProps {
  id: string;
  name: string;
  type: "video" | "audio" | "text";
  duration: string;
  width: number;
  left: number;
  color?: string;
  selected?: boolean;
  onSelect?: () => void;
  onTrimLeft?: () => void;
  onTrimRight?: () => void;
}

/**
 * ClipBlock
 * Core media block representing a video, audio, or text clip on the timeline track.
 * Implements dragging and snapping visual states using framer-motion.
 */
export function ClipBlock({
  id,
  name,
  type,
  duration,
  width,
  left,
  color = "bg-indigo-600",
  selected = false,
  onSelect,
  onTrimLeft,
  onTrimRight
}: ClipBlockProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const getIcon = () => {
    switch (type) {
      case "video":
        return <Film className="w-3.5 h-3.5" />;
      case "audio":
        return <Music className="w-3.5 h-3.5" />;
      case "text":
        return <Type className="w-3.5 h-3.5" />;
    }
  };

  return (
    <motion.div
      layout
      drag="x"
      dragMomentum={false}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      className={`absolute h-10 top-1 rounded shadow-sm border cursor-grab active:cursor-grabbing select-none transition-shadow ${color} ${
        selected ? "border-blue-400 z-20 shadow-[0_0_12px_rgba(59,130,246,0.6)] ring-1 ring-blue-400" : "border-black/40 z-10 hover:border-white/50"
      }`}
      style={{ width, left }}
      whileTap={{ scale: 0.99, zIndex: 30 }}
      initial={false}
    >
      <div className="relative w-full h-full overflow-hidden rounded pointer-events-none flex items-center">
        {/* Visual Thumbnail Placeholder */}
        {type === "audio" ? (
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 4px)' }}></div>
        ) : (
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.8) 10px, rgba(0,0,0,0.8) 20px)' }}></div>
        )}
        
        <div className="relative flex items-center h-full px-2 gap-2 text-white/95 text-[11px] font-medium tracking-wide w-full z-10">
          <div className="opacity-80 shrink-0">{getIcon()}</div>
          <span className="truncate flex-1 pointer-events-none">{name}</span>
          <span className="text-[10px] opacity-70 shrink-0 pointer-events-none font-mono">{duration}</span>
        </div>
      </div>

      {/* Left Trim Handle */}
      {(isHovered || selected) && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-3 bg-black/20 hover:bg-white/20 cursor-col-resize flex items-center justify-center transition-colors border-r border-black/20 z-20 rounded-l"
          onPointerDown={(e) => {
            e.stopPropagation();
            onTrimLeft?.();
          }}
        >
          <div className="w-0.5 h-4 bg-white/70 rounded-full pointer-events-none" />
        </div>
      )}

      {/* Right Trim Handle */}
      {(isHovered || selected) && (
        <div 
          className="absolute right-0 top-0 bottom-0 w-3 bg-black/20 hover:bg-white/20 cursor-col-resize flex items-center justify-center transition-colors border-l border-black/20 z-20 rounded-r"
          onPointerDown={(e) => {
            e.stopPropagation();
            onTrimRight?.();
          }}
        >
          <div className="w-0.5 h-4 bg-white/70 rounded-full pointer-events-none" />
        </div>
      )}

      {/* Snap Preview Guide Lines */}
      {isDragging && (
        <>
          <div className="absolute left-0 top-[-200px] bottom-[-200px] w-[1px] bg-blue-500/80 pointer-events-none z-50" />
          <div className="absolute right-0 top-[-200px] bottom-[-200px] w-[1px] bg-blue-500/80 pointer-events-none z-50" />
        </>
      )}
    </motion.div>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";

interface TrackLaneProps {
  height?: number;
  zoomScale?: number;
  durationInSeconds?: number;
  fps?: number;
  children?: React.ReactNode;
  isLocked?: boolean;
}

export function TrackLane({
  height = 96,
  zoomScale = 5,
  durationInSeconds = 60,
  fps = 30,
  children,
  isLocked = false,
}: TrackLaneProps) {
  const pixelsPerSecond = zoomScale * fps;
  const totalWidth = durationInSeconds * pixelsPerSecond;
  
  const backgroundImage = `linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`;
  const backgroundSize = `${pixelsPerSecond}px 100%`;

  return (
    <motion.div 
      className={`relative border-b border-[#1e1e1e] bg-[#0a0a0a] overflow-hidden ${
        isLocked 
          ? "opacity-75 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)]" 
          : ""
      }`}
      style={{ height, minWidth: totalWidth, backgroundImage, backgroundSize }}
      layout
    >
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.01) 1px, transparent 1px)`, 
          backgroundSize: `${pixelsPerSecond / 10}px 100%` 
        }} 
      />
      <div className="absolute inset-0">
        {children}
      </div>
    </motion.div>
  );
}

"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming a utility exists, else will just use standard classes

interface TimelinePlayheadProps {
  className?: string;
  duration?: number; // Total duration in seconds for calculation, optional here
}

export function TimelinePlayhead({ className }: TimelinePlayheadProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);

  // Example transformation to simulate time based on x position (just a placeholder visual)
  // In a real app, you'd map this precisely to the timeline scale.
  const timeString = useTransform(x, (latestX) => {
    const totalSeconds = Math.max(0, Math.floor(latestX / 10)); // 10px per second approx
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const frames = 0; // Simplified
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${frames
      .toString()
      .padStart(2, "0")}`;
  });

  return (
    <motion.div
      className={cn(
        "absolute top-0 bottom-0 z-50 flex flex-col items-center",
        className
      )}
      style={{ x }}
      drag="x"
      dragConstraints={{ left: 0 }}
      dragElastic={0}
      dragMomentum={false}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{
          opacity: isHovered || isDragging ? 1 : 0,
          y: isHovered || isDragging ? -25 : -10,
        }}
        transition={{ duration: 0.15 }}
        className="absolute top-0 -translate-x-1/2 rounded bg-neutral-900 px-2 py-0.5 text-xs font-mono text-neutral-200 shadow-md ring-1 ring-neutral-700/50"
      >
        <motion.span>{timeString}</motion.span>
      </motion.div>

      {/* Playhead Handle */}
      <div
        className={cn(
          "relative flex h-4 w-4 cursor-ew-resize items-center justify-center transition-transform",
          isHovered || isDragging ? "scale-110" : ""
        )}
      >
        {/* Polygon Top */}
        <div
          className="absolute -top-1 h-3 w-4 bg-red-600 shadow-[0_2px_4px_rgba(220,38,38,0.4)]"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 60%, 50% 100%, 0 60%)",
          }}
        />
      </div>

      {/* Playhead Line */}
      <div
        className={cn(
          "w-[1px] bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.6)] transition-all",
          isHovered || isDragging ? "bg-red-500" : "bg-red-600/90"
        )}
        style={{ height: "100vh" }}
      />
    </motion.div>
  );
}

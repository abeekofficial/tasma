"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

interface TimeRulerProps {
  zoomScale?: number;
  durationInSeconds?: number;
  fps?: number;
}

export function TimeRuler({
  zoomScale = 5,
  durationInSeconds = 60,
  fps = 30,
}: TimeRulerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playheadPos, setPlayheadPos] = useState(0);

  const pixelsPerSecond = zoomScale * fps;
  const totalWidth = durationInSeconds * pixelsPerSecond;
  const tickSpacing = pixelsPerSecond;

  const ticks = Array.from({ length: durationInSeconds + 1 }).map((_, i) => i);

  return (
    <div 
      className="relative flex h-8 w-full select-none overflow-hidden border-b border-neutral-800 bg-neutral-900"
      ref={containerRef}
    >
      <div 
        className="relative h-full flex-none" 
        style={{ width: `${totalWidth}px` }}
      >
        {ticks.map((tick) => (
          <div
            key={tick}
            className="absolute bottom-0 top-0 flex flex-col justify-end border-l border-neutral-700"
            style={{ left: `${tick * tickSpacing}px`, width: `${tickSpacing}px` }}
          >
            <span className="mb-1 ml-1 font-mono text-[10px] text-neutral-400">
              00:00:{(tick < 10 ? "0" : "") + tick}:00
            </span>
            <div className="flex h-1/3 w-full items-end justify-between">
              {[1, 2, 3, 4].map((subTick) => (
                <div key={subTick} className="h-1.5 w-px bg-neutral-700" />
              ))}
            </div>
          </div>
        ))}

        <motion.div
          className="absolute bottom-0 top-0 z-50 flex cursor-ew-resize flex-col items-center"
          style={{ width: "13px", marginLeft: "-6.5px", left: playheadPos }}
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0}
          dragMomentum={false}
          onDrag={(e, info) => {
            const newX = Math.max(0, Math.min(playheadPos + info.delta.x, totalWidth));
            setPlayheadPos(newX);
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H13V6.5L6.5 13L0 6.5V0Z" fill="#ef4444" />
          </svg>
          <div className="h-[2000px] w-px bg-red-500" />
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useRef, useMemo } from "react";
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

  const { tickInterval, subTicks, showFrames } = useMemo(() => {
    let interval = 1; // seconds
    let subs = 4;
    let frames = false;

    if (pixelsPerSecond < 10) {
      interval = 10;
      subs = 1;
    } else if (pixelsPerSecond < 50) {
      interval = 5;
      subs = 5;
    } else if (pixelsPerSecond < 100) {
      interval = 1;
      subs = 2;
    } else if (pixelsPerSecond < 300) {
      interval = 1;
      subs = 10;
    } else {
      interval = 1;
      subs = fps;
      frames = true;
    }

    return { tickInterval: interval, subTicks: subs, showFrames: frames };
  }, [pixelsPerSecond, fps]);

  const tickCount = Math.floor(durationInSeconds / tickInterval) + 1;
  const ticks = Array.from({ length: tickCount }).map((_, i) => i * tickInterval);

  const formatTimecode = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const mm = m < 10 ? `0${m}` : m;
    const ss = s < 10 ? `0${s}` : s;
    return `00:${mm}:${ss}:00`;
  };

  return (
    <div 
      className="relative flex h-10 w-full select-none overflow-hidden border-b border-neutral-800 bg-neutral-900"
      ref={containerRef}
    >
      <div className="absolute left-2 top-2 z-10 flex items-center gap-2">
        <span className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-[10px] text-neutral-300">
          {fps} FPS
        </span>
      </div>

      <div 
        className="relative h-full flex-none" 
        style={{ width: `${totalWidth}px` }}
      >
        {ticks.map((tickSeconds) => {
          const tickX = tickSeconds * pixelsPerSecond;
          const tickSpacing = tickInterval * pixelsPerSecond;
          
          return (
            <div
              key={tickSeconds}
              className="absolute bottom-0 top-0 flex flex-col justify-end border-l border-neutral-600"
              style={{ left: `${tickX}px`, width: `${tickSpacing}px` }}
            >
              <span className="mb-1 ml-1 font-mono text-[10px] text-neutral-400">
                {formatTimecode(tickSeconds)}
              </span>
              <div className="flex h-1/3 w-full items-end justify-between">
                {Array.from({ length: subTicks }).map((_, i) => {
                  if (i === 0) return null; // skip first sub-tick as it's the main tick
                  return (
                    <div 
                      key={i} 
                      className={`w-px bg-neutral-700 ${showFrames && i % Math.floor(fps / 2) === 0 ? "h-full bg-neutral-600" : "h-1.5"}`} 
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

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
          <div className="h-[2000px] w-px bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]" />
        </motion.div>
      </div>
    </div>
  );
}

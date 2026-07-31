"use client";

import React from "react";
import { RotateCw } from "lucide-react";

interface OverlayLayerProps {
  showSafeMargins?: boolean;
  showRuleOfThirds?: boolean;
  showTransformBox?: boolean;
}

export function OverlayLayer({
  showSafeMargins = true,
  showRuleOfThirds = true,
  showTransformBox = true,
}: OverlayLayerProps) {
  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full">
      {/* Safe Margins */}
      {showSafeMargins && (
        <>
          {/* Action Safe (approx 93%) */}
          <div className="absolute inset-[3.5%] rounded border border-white/20 shadow-[0_0_0_1px_rgba(0,0,0,0.5)]" />
          {/* Title Safe (approx 90%) */}
          <div className="absolute inset-[5%] rounded border border-white/30 shadow-[0_0_0_1px_rgba(0,0,0,0.5)]" />
        </>
      )}

      {/* Rule of Thirds */}
      {showRuleOfThirds && (
        <div className="absolute inset-0 flex flex-col justify-between py-[33.33%]">
          <div className="h-[1px] w-full bg-white/20 shadow-[0_0_0_1px_rgba(0,0,0,0.5)]" />
          <div className="h-[1px] w-full bg-white/20 shadow-[0_0_0_1px_rgba(0,0,0,0.5)]" />
        </div>
      )}
      {showRuleOfThirds && (
        <div className="absolute inset-0 flex justify-between px-[33.33%]">
          <div className="h-full w-[1px] bg-white/20 shadow-[0_0_0_1px_rgba(0,0,0,0.5)]" />
          <div className="h-full w-[1px] bg-white/20 shadow-[0_0_0_1px_rgba(0,0,0,0.5)]" />
        </div>
      )}

      {/* Transform Bounding Box (Mock) */}
      {showTransformBox && (
        <div className="pointer-events-auto absolute left-1/2 top-1/2 h-[50%] w-[50%] -translate-x-1/2 -translate-y-1/2 border border-sky-400">
          {/* Center Anchor */}
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-400 bg-sky-400/20" />
          
          {/* Rotation Handle */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-grab">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 border border-neutral-600 shadow-sm text-neutral-300 transition-colors hover:text-white">
              <RotateCw className="h-3 w-3" />
            </div>
            <div className="h-4 w-[1px] bg-sky-400" />
          </div>

          {/* Corners */}
          <div className="absolute -left-1.5 -top-1.5 h-3 w-3 cursor-nwse-resize border border-sky-400 bg-white" />
          <div className="absolute -right-1.5 -top-1.5 h-3 w-3 cursor-nesw-resize border border-sky-400 bg-white" />
          <div className="absolute -left-1.5 -bottom-1.5 h-3 w-3 cursor-nesw-resize border border-sky-400 bg-white" />
          <div className="absolute -right-1.5 -bottom-1.5 h-3 w-3 cursor-nwse-resize border border-sky-400 bg-white" />

          {/* Edges */}
          <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 cursor-ns-resize border border-sky-400 bg-white" />
          <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 cursor-ns-resize border border-sky-400 bg-white" />
          <div className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 cursor-ew-resize border border-sky-400 bg-white" />
          <div className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 cursor-ew-resize border border-sky-400 bg-white" />
        </div>
      )}
    </div>
  );
}

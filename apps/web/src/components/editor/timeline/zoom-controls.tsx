"use client";

import React from "react";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";

interface ZoomControlsProps {
  zoomScale: number;
  onZoomChange: (scale: number) => void;
  onFitTimeline?: () => void;
  minZoom?: number;
  maxZoom?: number;
}

export function ZoomControls({
  zoomScale,
  onZoomChange,
  onFitTimeline,
  minZoom = 1,
  maxZoom = 100,
}: ZoomControlsProps) {
  const percentage = Math.round((zoomScale / maxZoom) * 100);

  const handleZoomOut = () => {
    onZoomChange(Math.max(minZoom, zoomScale - 5));
  };

  const handleZoomIn = () => {
    onZoomChange(Math.min(maxZoom, zoomScale + 5));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onZoomChange(Number(e.target.value));
  };

  return (
    <div className="flex items-center gap-3 rounded-md bg-neutral-900 px-3 py-1.5 border border-neutral-800 shadow-sm text-neutral-400">
      <button
        onClick={onFitTimeline}
        className="hover:text-neutral-100 transition-colors focus:outline-none focus:ring-1 focus:ring-neutral-500 rounded p-0.5"
        title="Fit Timeline"
      >
        <Maximize className="h-4 w-4" />
      </button>

      <div className="h-4 w-px bg-neutral-800" />

      <button
        onClick={handleZoomOut}
        disabled={zoomScale <= minZoom}
        className="hover:text-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-1 focus:ring-neutral-500 rounded p-0.5"
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </button>

      <input
        type="range"
        min={minZoom}
        max={maxZoom}
        step={0.1}
        value={zoomScale}
        onChange={handleSliderChange}
        className="h-1.5 w-24 cursor-pointer appearance-none rounded-full bg-neutral-800 accent-neutral-300 outline-none"
      />

      <button
        onClick={handleZoomIn}
        disabled={zoomScale >= maxZoom}
        className="hover:text-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-1 focus:ring-neutral-500 rounded p-0.5"
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </button>

      <div className="h-4 w-px bg-neutral-800" />

      <span className="w-10 text-right font-mono text-[10px] text-neutral-500">
        {percentage}%
      </span>
    </div>
  );
}

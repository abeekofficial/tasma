"use client";

import React, { useRef, ReactNode } from "react";
import { MarkerLayer, type Marker } from "./marker-layer";

interface TimelineCanvasProps {
  children?: ReactNode;
  width?: number;
  height?: number;
  markers?: Marker[];
}

/**
 * TimelineCanvas
 * The scrollable right-side area for the video editor timeline.
 * Supports horizontal and vertical scroll with overflow handling.
 */
export function TimelineCanvas({ 
  children, 
  width = 5000, 
  height = 800,
  markers = [] 
}: TimelineCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full h-full bg-zinc-950 overflow-auto custom-scrollbar">
      <div 
        ref={canvasRef}
        className="relative bg-zinc-900/50" 
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <MarkerLayer markers={markers} />
        
        {/* Render TimeRuler and TrackLanes via children */}
        {children}
      </div>
    </div>
  );
}

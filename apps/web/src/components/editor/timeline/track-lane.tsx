"use client";

import React from "react";

interface TrackLaneProps {
  height?: number;
  zoomScale?: number;
  durationInSeconds?: number;
  fps?: number;
  children?: React.ReactNode;
}

export function TrackLane({
  height = 96,
  zoomScale = 5,
  durationInSeconds = 60,
  fps = 30,
  children,
}: TrackLaneProps) {
  const pixelsPerSecond = zoomScale * fps;
  const totalWidth = durationInSeconds * pixelsPerSecond;
  
  const backgroundImage = `linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`;
  const backgroundSize = `${pixelsPerSecond}px 100%`;

  return (
    <div 
      className="relative border-b border-neutral-800 bg-neutral-900/50"
      style={{ height: `${height}px`, width: `${totalWidth}px`, backgroundImage, backgroundSize }}
    >
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}

"use client";

import React, { useRef, useState, useCallback } from "react";
import { TimeMarks } from "./time-marks";

interface TimelineRulerProps {
  zoomScale?: number;
  totalWidth?: number;
  onSeek?: (position: number) => void;
}

export const TimelineRuler = ({ zoomScale = 1, totalWidth = 2000, onSeek }: TimelineRulerProps) => {
  const rulerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    
    if (rulerRef.current && onSeek) {
      const rect = rulerRef.current.getBoundingClientRect();
      const x = Math.max(0, e.clientX - rect.left + rulerRef.current.scrollLeft);
      onSeek(x);
    }
  }, [onSeek]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    if (rulerRef.current && onSeek) {
      const rect = rulerRef.current.getBoundingClientRect();
      const x = Math.max(0, e.clientX - rect.left + rulerRef.current.scrollLeft);
      onSeek(x);
    }
  }, [isDragging, onSeek]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  }, []);

  return (
    <div
      ref={rulerRef}
      className="relative h-7 w-full cursor-text overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <TimeMarks zoomScale={zoomScale} totalWidth={totalWidth} />
    </div>
  );
};

"use client";

import React, { useRef, ReactNode, useState } from "react";
import { MarkerLayer, type Marker } from "./marker-layer";
import { TimelineContextMenu } from "./timeline-context-menu";
import { SelectionBox } from "./selection-box";

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
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mock selection state
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionCurrent, setSelectionCurrent] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only left click
    if (e.button !== 0) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Calculate position relative to canvas content
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsSelecting(true);
    setSelectionStart({ x, y });
    setSelectionCurrent({ x, y });
    
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isSelecting) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setSelectionCurrent({ x, y });
  };
  
  const handlePointerUp = (e: React.PointerEvent) => {
    if (isSelecting) {
      setIsSelecting(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  return (
    <TimelineContextMenu>
      <div 
        ref={containerRef}
        className="relative w-full h-full bg-zinc-950 overflow-auto custom-scrollbar"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div 
          ref={canvasRef}
          className="relative bg-zinc-900/50" 
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <MarkerLayer markers={markers} />
          
          {/* Render TimeRuler and TrackLanes via children */}
          {children}
          
          {isSelecting && (
            <SelectionBox 
              startX={selectionStart.x} 
              startY={selectionStart.y} 
              currentX={selectionCurrent.x} 
              currentY={selectionCurrent.y} 
            />
          )}
        </div>
      </div>
    </TimelineContextMenu>
  );
}

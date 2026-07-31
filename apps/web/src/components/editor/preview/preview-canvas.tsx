"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { OverlayLayer } from "./overlay-layer";
import { Hand, ZoomIn, ZoomOut } from "lucide-react";

export function PreviewCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  
  // Pan state
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Zoom in/out on wheel
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      setScale((prev) => Math.min(Math.max(prev * zoomFactor, 0.1), 5));
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventDefaultWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };
    
    container.addEventListener("wheel", preventDefaultWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", preventDefaultWheel);
    };
  }, []);

  const handleZoomIn = () => setScale((prev) => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev / 1.2, 0.1));
  const handleResetZoom = () => {
    setScale(1);
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-neutral-900"
      onWheel={handleWheel}
      style={{
        backgroundImage: `
          linear-gradient(45deg, #1f1f1f 25%, transparent 25%), 
          linear-gradient(-45deg, #1f1f1f 25%, transparent 25%), 
          linear-gradient(45deg, transparent 75%, #1f1f1f 75%), 
          linear-gradient(-45deg, transparent 75%, #1f1f1f 75%)
        `,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px"
      }}
    >
      <div className="absolute right-4 top-4 z-10 flex gap-1 rounded-md border border-neutral-700 bg-neutral-800/80 p-1 backdrop-blur-sm">
        <button 
          className="rounded p-1.5 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
          title="Pan tool (Hold Space)"
        >
          <Hand className="h-4 w-4" />
        </button>
        <div className="mx-1 h-7 w-[1px] bg-neutral-700" />
        <button 
          onClick={handleZoomOut}
          className="rounded p-1.5 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={handleResetZoom}
          className="flex w-14 items-center justify-center rounded p-1 text-xs font-medium text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
          title="Reset Zoom"
        >
          {Math.round(scale * 100)}%
        </button>
        <button 
          onClick={handleZoomIn}
          className="rounded p-1.5 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>

      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0.1}
        dragMomentum={false}
        style={{ x, y, scale }}
        className="relative flex cursor-grab items-center justify-center active:cursor-grabbing"
      >
        {/* Mock Video Container (16:9) */}
        <div 
          className="relative aspect-video w-[800px] overflow-hidden bg-black ring-1 ring-neutral-800"
          style={{ 
            boxShadow: "0 0 50px rgba(0,0,0,0.5)" 
          }}
        >
          {/* Mock Video Content */}
          <div className="absolute inset-0 flex items-center justify-center text-neutral-700">
            <span className="text-xl font-semibold tracking-widest opacity-50">NO MEDIA</span>
          </div>

          {/* Overlay Layer */}
          <OverlayLayer />
        </div>
      </motion.div>
    </div>
  );
}

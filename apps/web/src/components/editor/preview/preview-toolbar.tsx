"use client";

import React, { useState } from "react";
import { Monitor, Grid, Maximize, ZoomIn, Settings2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Quality = "Auto" | "Full" | "1/2" | "1/4";
type Zoom = "Fit" | "25%" | "50%" | "100%" | "200%";

export function PreviewToolbar() {
  const [showGrid, setShowGrid] = useState(false);
  const [showSafeArea, setShowSafeArea] = useState(false);
  
  const [quality, setQuality] = useState<Quality>("Auto");
  const [isQualityOpen, setIsQualityOpen] = useState(false);
  
  const [zoom, setZoom] = useState<Zoom>("Fit");
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-2 h-10 bg-zinc-950 border-b border-zinc-800 text-zinc-400 text-xs font-medium select-none w-full">
      {/* Left Group: View Options */}
      <div className="flex items-center gap-1">
        <div className="flex items-center bg-zinc-900 rounded border border-zinc-800 p-0.5">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1 rounded flex items-center justify-center transition-colors ${
              showGrid ? "bg-zinc-700 text-zinc-100" : "hover:bg-zinc-800 hover:text-zinc-200"
            }`}
            title="Toggle Grid"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowSafeArea(!showSafeArea)}
            className={`p-1 rounded flex items-center justify-center transition-colors ${
              showSafeArea ? "bg-zinc-700 text-zinc-100" : "hover:bg-zinc-800 hover:text-zinc-200"
            }`}
            title="Toggle Safe Area"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Group: Zoom & Quality */}
      <div className="flex items-center gap-2">
        {/* Zoom Selector */}
        <div className="relative">
          <button
            onClick={() => setIsZoomOpen(!isZoomOpen)}
            onBlur={() => setTimeout(() => setIsZoomOpen(false), 150)}
            className="flex items-center gap-1.5 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded hover:bg-zinc-800 hover:text-zinc-200 transition-colors w-16 justify-between"
          >
            <span>{zoom}</span>
            <ZoomIn className="w-3 h-3 opacity-70" />
          </button>
          <AnimatePresence>
            {isZoomOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-1 w-24 bg-zinc-900 border border-zinc-700 rounded shadow-lg overflow-hidden z-50 py-1"
              >
                {(["Fit", "25%", "50%", "100%", "200%"] as Zoom[]).map((z) => (
                  <button
                    key={z}
                    onClick={() => {
                      setZoom(z);
                      setIsZoomOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-between"
                  >
                    {z}
                    {zoom === z && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quality Selector */}
        <div className="relative">
          <button
            onClick={() => setIsQualityOpen(!isQualityOpen)}
            onBlur={() => setTimeout(() => setIsQualityOpen(false), 150)}
            className="flex items-center gap-1.5 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded hover:bg-zinc-800 hover:text-zinc-200 transition-colors w-16 justify-between"
          >
            <span>{quality}</span>
            <Settings2 className="w-3 h-3 opacity-70" />
          </button>
          <AnimatePresence>
            {isQualityOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-1 w-24 bg-zinc-900 border border-zinc-700 rounded shadow-lg overflow-hidden z-50 py-1"
              >
                {(["Auto", "Full", "1/2", "1/4"] as Quality[]).map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setQuality(q);
                      setIsQualityOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-between"
                  >
                    {q}
                    {quality === q && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Output Device Icon (decorative) */}
        <button className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors">
          <Monitor className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

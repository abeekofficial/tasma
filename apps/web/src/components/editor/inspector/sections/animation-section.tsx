"use client";

import React, { useState } from "react";
import { InspectorAccordion } from "../inspector-accordion";
import { motion } from "framer-motion";
import { Diamond, Settings2 } from "lucide-react";
import { PropertyRow } from "../controls/property-row";
import { ToggleControl } from "../controls/toggle-control";

export function AnimationSection() {
  const [scrubberPos, setScrubberPos] = useState(30);

  return (
    <InspectorAccordion id="animation" title="Animation" defaultOpen>
      <div className="flex flex-col p-3 gap-4 text-sm text-neutral-300">
        <PropertyRow icon={<Settings2 size={14} />} label="Enable Keyframes">
          <ToggleControl defaultValue={true} />
        </PropertyRow>

        {/* Mini Keyframe Timeline UI */}
        <div className="flex flex-col border border-white/10 rounded-md overflow-hidden bg-neutral-900/50">
          <div className="flex items-center justify-between px-2 py-1 bg-white/5 border-b border-white/10 text-xs font-mono text-neutral-400">
            <span>00:00:00:00</span>
            <span>00:00:05:00</span>
          </div>
          
          <div className="relative h-16 bg-neutral-950 w-full overflow-hidden select-none group">
            {/* Playhead */}
            <motion.div 
              className="absolute top-0 bottom-0 w-px bg-red-500 z-10 flex flex-col items-center cursor-ew-resize"
              style={{ left: `${scrubberPos}%` }}
              drag="x"
              dragElastic={0}
              dragMomentum={false}
              onDrag={(e, info) => {
                const parentElement = (e.target as HTMLElement).parentElement;
                if (parentElement) {
                  const rect = parentElement.getBoundingClientRect();
                  let newPos = ((info.point.x - rect.left) / rect.width) * 100;
                  newPos = Math.max(0, Math.min(newPos, 100));
                  setScrubberPos(newPos);
                }
              }}
            >
              <div className="w-2 h-2 bg-red-500 rounded-sm -mt-1" />
            </motion.div>

            {/* Tracks */}
            <div className="flex flex-col h-full justify-around py-2">
              <div className="relative h-4 w-full flex items-center border-b border-white/5">
                <Diamond size={10} className="absolute left-[10%] text-blue-400 cursor-pointer hover:text-blue-300" />
                <Diamond size={10} className="absolute left-[40%] text-blue-400 cursor-pointer hover:text-blue-300" />
                <Diamond size={10} className="absolute left-[80%] text-blue-400 cursor-pointer hover:text-blue-300" />
              </div>
              <div className="relative h-4 w-full flex items-center">
                <Diamond size={10} className="absolute left-[20%] text-emerald-400 cursor-pointer hover:text-emerald-300" />
                <Diamond size={10} className="absolute left-[60%] text-emerald-400 cursor-pointer hover:text-emerald-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </InspectorAccordion>
  );
}

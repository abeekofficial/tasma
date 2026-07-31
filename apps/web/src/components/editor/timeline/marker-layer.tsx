"use client";

import React from "react";
import { Bookmark } from "lucide-react";

export interface Marker {
  id: string;
  position: number;
  label: string;
  color?: string; // Tailwind bg color class
}

interface MarkerLayerProps {
  markers: Marker[];
}

/**
 * MarkerLayer
 * An absolute-positioned layer rendering Chapter and Clip markers on top of the timeline.
 */
export function MarkerLayer({ markers }: MarkerLayerProps) {
  if (!markers || markers.length === 0) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-40">
      {markers.map((marker) => (
        <div
          key={marker.id}
          className="absolute top-0 bottom-0 border-l-[1.5px] border-dashed border-white/20"
          style={{ left: `${marker.position}px` }}
        >
          {/* Marker Header */}
          <div className="absolute top-0 -translate-x-1/2 flex flex-col items-center">
            <div 
              className={`px-1.5 py-0.5 rounded-sm text-[10px] font-semibold text-white shadow-sm whitespace-nowrap flex items-center gap-1 ${
                marker.color || 'bg-emerald-600'
              }`}
            >
              <Bookmark className="w-3 h-3" />
              {marker.label}
            </div>
            {/* Stem indicator */}
            <div className={`w-0.5 h-2 ${marker.color ? marker.color.replace('bg-', 'bg-') : 'bg-emerald-600'} opacity-80`} />
          </div>
        </div>
      ))}
    </div>
  );
}

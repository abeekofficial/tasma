"use client";

import React from "react";
import { InspectorAccordion } from "../inspector-accordion";
import { Info, Clock, Monitor, Frame, Code } from "lucide-react";

export function MetadataSection() {
  return (
    <InspectorAccordion id="metadata" title="Properties">
      <div className="flex flex-col gap-1 p-3 text-xs text-neutral-400 font-mono">
        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-neutral-500" />
            <span>Duration</span>
          </div>
          <span className="text-neutral-200">00:02:14:05</span>
        </div>
        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Monitor size={12} className="text-neutral-500" />
            <span>Resolution</span>
          </div>
          <span className="text-neutral-200">3840 x 2160</span>
        </div>
        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Frame size={12} className="text-neutral-500" />
            <span>Frame Rate</span>
          </div>
          <span className="text-neutral-200">59.94 fps</span>
        </div>
        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Code size={12} className="text-neutral-500" />
            <span>Codec</span>
          </div>
          <span className="text-neutral-200">Apple ProRes 422</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Info size={12} className="text-neutral-500" />
            <span>Color Space</span>
          </div>
          <span className="text-neutral-200">Rec. 709</span>
        </div>
      </div>
    </InspectorAccordion>
  );
}

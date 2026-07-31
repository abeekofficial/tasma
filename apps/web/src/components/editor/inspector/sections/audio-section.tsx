"use client";

import React from "react";
import { InspectorAccordion } from "../inspector-accordion";
import { PropertyRow } from "../controls/property-row";
import { SliderControl } from "../controls/slider-control";
import { ToggleControl } from "../controls/toggle-control";
import { Volume2, SlidersHorizontal, AudioLines, EarOff } from "lucide-react";

export function AudioSection() {
  return (
    <InspectorAccordion id="audio" title="Audio" defaultOpen>
      <div className="flex flex-col gap-2 p-3 text-sm text-neutral-300">
        <PropertyRow icon={<Volume2 size={14} />} label="Volume">
          <SliderControl min={-60} max={12} defaultValue={0} unit="dB" />
        </PropertyRow>
        <PropertyRow icon={<SlidersHorizontal size={14} />} label="Balance">
          <SliderControl min={-100} max={100} defaultValue={0} />
        </PropertyRow>
        <PropertyRow icon={<AudioLines size={14} />} label="Fade In">
          <SliderControl min={0} max={10} defaultValue={0} unit="s" step={0.1} />
        </PropertyRow>
        <PropertyRow icon={<AudioLines size={14} />} label="Fade Out">
          <SliderControl min={0} max={10} defaultValue={0} unit="s" step={0.1} />
        </PropertyRow>
        <PropertyRow icon={<EarOff size={14} />} label="Noise Reduction">
          <ToggleControl defaultValue={false} />
        </PropertyRow>
      </div>
    </InspectorAccordion>
  );
}

"use client";

import React from "react";
import { InspectorAccordion } from "../inspector-accordion";
import { PropertyRow } from "../controls/property-row";
import { SliderControl } from "../controls/slider-control";
import { Sun, Contrast, Droplets, Aperture, Palette } from "lucide-react";

export function ColorSection() {
  return (
    <InspectorAccordion id="color" title="Color" defaultOpen>
      <div className="flex flex-col gap-2 p-3 text-sm text-neutral-300">
        <PropertyRow icon={<Sun size={14} />} label="Brightness">
          <SliderControl min={-100} max={100} defaultValue={0} />
        </PropertyRow>
        <PropertyRow icon={<Contrast size={14} />} label="Contrast">
          <SliderControl min={-100} max={100} defaultValue={0} />
        </PropertyRow>
        <PropertyRow icon={<Droplets size={14} />} label="Saturation">
          <SliderControl min={0} max={200} defaultValue={100} />
        </PropertyRow>
        <PropertyRow icon={<Aperture size={14} />} label="Exposure">
          <SliderControl min={-5} max={5} defaultValue={0} step={0.1} />
        </PropertyRow>
        <PropertyRow icon={<Palette size={14} />} label="Tint">
          <SliderControl min={-100} max={100} defaultValue={0} />
        </PropertyRow>
      </div>
    </InspectorAccordion>
  );
}

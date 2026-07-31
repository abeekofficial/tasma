"use client";

import React from "react";
import { InspectorAccordion } from "../inspector-accordion";
import { PropertyRow } from "../controls/property-row";
import { NumberInput } from "../controls/number-input";
import { SliderControl } from "../controls/slider-control";
import { SelectControl } from "../controls/select-control";
import { Box, Move, Scaling, RotateCw, Blend } from "lucide-react";

export function TransformSection() {
  return (
    <InspectorAccordion id="transform" title="Transform" defaultOpen>
      <div className="flex flex-col gap-2 p-3 text-sm text-neutral-300">
        <PropertyRow icon={<Move size={14} />} label="Position">
          <div className="flex gap-2">
            <NumberInput label="X" defaultValue={0} />
            <NumberInput label="Y" defaultValue={0} />
          </div>
        </PropertyRow>
        <PropertyRow icon={<Scaling size={14} />} label="Scale">
          <SliderControl min={0} max={200} defaultValue={100} unit="%" />
        </PropertyRow>
        <PropertyRow icon={<RotateCw size={14} />} label="Rotation">
          <SliderControl min={-180} max={180} defaultValue={0} unit="°" />
        </PropertyRow>
        <PropertyRow icon={<Box size={14} />} label="Opacity">
          <SliderControl min={0} max={100} defaultValue={100} unit="%" />
        </PropertyRow>
        <PropertyRow icon={<Blend size={14} />} label="Blend Mode">
          <SelectControl
            options={["Normal", "Multiply", "Screen", "Overlay", "Darken", "Lighten"]}
            defaultValue="Normal"
          />
        </PropertyRow>
      </div>
    </InspectorAccordion>
  );
}

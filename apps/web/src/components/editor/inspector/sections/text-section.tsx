"use client";

import React from "react";
import { InspectorAccordion } from "../inspector-accordion";
import { PropertyRow } from "../controls/property-row";
import { SliderControl } from "../controls/slider-control";
import { SelectControl } from "../controls/select-control";
import { ButtonGroup } from "../controls/button-group";
import { Type, Baseline, AlignLeft, AlignCenter, AlignRight, Expand, ArrowDownUp } from "lucide-react";

export function TextSection() {
  return (
    <InspectorAccordion id="text" title="Text" defaultOpen>
      <div className="flex flex-col gap-2 p-3 text-sm text-neutral-300">
        <PropertyRow icon={<Type size={14} />} label="Font Family">
          <SelectControl
            options={["Inter", "Roboto", "Montserrat", "Open Sans", "Helvetica Neue"]}
            defaultValue="Inter"
          />
        </PropertyRow>
        <PropertyRow icon={<Baseline size={14} />} label="Weight">
          <SelectControl
            options={["Light", "Regular", "Medium", "SemiBold", "Bold", "Black"]}
            defaultValue="Regular"
          />
        </PropertyRow>
        <PropertyRow icon={<Type size={14} />} label="Size">
          <SliderControl min={8} max={288} defaultValue={24} unit="px" />
        </PropertyRow>
        <PropertyRow icon={<AlignLeft size={14} />} label="Alignment">
          <ButtonGroup
            options={[
              { icon: <AlignLeft size={14} />, value: "left" },
              { icon: <AlignCenter size={14} />, value: "center" },
              { icon: <AlignRight size={14} />, value: "right" },
            ]}
            defaultValue="left"
          />
        </PropertyRow>
        <PropertyRow icon={<Expand size={14} />} label="Letter Spacing">
          <SliderControl min={-10} max={50} defaultValue={0} />
        </PropertyRow>
        <PropertyRow icon={<ArrowDownUp size={14} />} label="Line Height">
          <SliderControl min={0.5} max={3} defaultValue={1.2} step={0.1} />
        </PropertyRow>
      </div>
    </InspectorAccordion>
  );
}

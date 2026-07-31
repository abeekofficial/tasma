"use client";

import { InspectorAccordion } from "./inspector-accordion";
import { TransformSection } from "./sections/transform-section";
import { ColorSection } from "./sections/color-section";
import { AudioSection } from "./sections/audio-section";
import { TextSection } from "./sections/text-section";
import { AnimationSection } from "./sections/animation-section";
import { MetadataSection } from "./sections/metadata-section";

export function InspectorWorkspace() {
  return (
    <div className="flex flex-col h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
      <InspectorAccordion title="Transform" defaultOpen>
        <TransformSection />
      </InspectorAccordion>
      
      <InspectorAccordion title="Color" defaultOpen>
        <ColorSection />
      </InspectorAccordion>
      
      <InspectorAccordion title="Text">
        <TextSection />
      </InspectorAccordion>
      
      <InspectorAccordion title="Audio">
        <AudioSection />
      </InspectorAccordion>
      
      <InspectorAccordion title="Animation">
        <AnimationSection />
      </InspectorAccordion>
      
      <InspectorAccordion title="Metadata">
        <MetadataSection />
      </InspectorAccordion>
    </div>
  );
}

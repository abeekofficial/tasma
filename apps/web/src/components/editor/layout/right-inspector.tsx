"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, SlidersHorizontal, Settings2, RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function Section({ title, defaultOpen = false, children }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-zinc-800/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/30 transition-colors"
      >
        <span>{title}</span>
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ScrubbableInputProps {
  label: string;
  value: number;
  suffix?: string;
}

function ScrubbableInput({ label, value, suffix = "" }: ScrubbableInputProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-zinc-500 font-medium w-4">{label}</label>
      <div className="flex-1 flex items-center bg-zinc-900 rounded-md border border-zinc-800 px-2 py-1 group hover:border-zinc-700 transition-colors">
        <input
          type="number"
          value={value}
          readOnly
          className="bg-transparent w-full text-xs text-zinc-200 outline-none text-right cursor-ew-resize selection:bg-transparent"
        />
        {suffix && <span className="text-[10px] text-zinc-600 ml-1">{suffix}</span>}
      </div>
    </div>
  );
}

export function RightInspector() {
  return (
    <div className="w-72 h-full bg-zinc-950 border-l border-zinc-800/50 flex flex-col overflow-y-auto text-zinc-200 scrollbar-thin scrollbar-thumb-zinc-800">
      <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between sticky top-0 bg-zinc-950 z-10">
        <h2 className="text-sm font-medium">Inspector</h2>
        <Settings2 size={16} className="text-zinc-500" />
      </div>

      <Section title="Transform" defaultOpen>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ScrubbableInput label="X" value={0} />
            <ScrubbableInput label="Y" value={0} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ScrubbableInput label="W" value={1920} />
            <ScrubbableInput label="H" value={1080} />
          </div>
          <div className="pt-2 border-t border-zinc-800/30">
            <ScrubbableInput label="S" value={100} suffix="%" />
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-zinc-500">Rotation</span>
            <div className="flex items-center gap-2">
              <RotateCw size={12} className="text-zinc-500" />
              <ScrubbableInput label="" value={0} suffix="°" />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Color" defaultOpen>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">Opacity</span>
            <div className="w-24">
              <ScrubbableInput label="" value={100} suffix="%" />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">Blend Mode</span>
            <select className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 outline-none w-24">
              <option>Normal</option>
              <option>Multiply</option>
              <option>Screen</option>
              <option>Overlay</option>
            </select>
          </div>
        </div>
      </Section>

      <Section title="Animation">
        <div className="flex flex-col items-center justify-center py-6 text-zinc-500 gap-2">
          <SlidersHorizontal size={24} strokeWidth={1.5} />
          <p className="text-xs">No keyframes added</p>
          <button className="mt-2 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded transition-colors">
            Add Keyframe
          </button>
        </div>
      </Section>
      
      <Section title="Audio">
        <div className="space-y-3">
           <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">Volume</span>
            <div className="w-24">
              <ScrubbableInput label="" value={0} suffix="dB" />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

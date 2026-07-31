"use client";

import { Settings2 } from "lucide-react";
import { InspectorWorkspace } from "../inspector/inspector-workspace";

export function RightInspector() {
  return (
    <div className="w-72 h-full bg-zinc-950 border-l border-zinc-800/50 flex flex-col text-zinc-200">
      <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between sticky top-0 bg-zinc-950 z-10">
        <h2 className="text-sm font-medium">Inspector</h2>
        <Settings2 size={16} className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer" />
      </div>

      <div className="flex-1 overflow-hidden">
        <InspectorWorkspace />
      </div>
    </div>
  );
}

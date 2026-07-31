"use client";

import { useState } from "react";
import { Image, Type, Music, MoveRight, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AssetsWorkspace } from "../assets/assets-workspace";

const TABS = [
  { id: "media", icon: Image, label: "Media" },
  { id: "text", icon: Type, label: "Text" },
  { id: "audio", icon: Music, label: "Audio" },
  { id: "transitions", icon: MoveRight, label: "Transitions" },
  { id: "effects", icon: Wand2, label: "Effects" },
];

export function LeftSidebar() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <div className="flex h-full bg-zinc-950 text-zinc-300 border-r border-zinc-800/50">
      {/* Narrow Tab Column */}
      <div className="w-14 flex flex-col items-center py-4 gap-2 border-r border-zinc-800/50 bg-zinc-950/80">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-2.5 rounded-lg transition-colors relative group flex justify-center items-center ${
                isActive ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
              }`}
              title={tab.label}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Secondary Content Column */}
      <div className="w-80 bg-zinc-900/50 flex flex-col">
        <div className="h-12 border-b border-zinc-800/50 flex items-center px-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-100">
            {TABS.find((t) => t.id === activeTab)?.label}
          </h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full"
            >
              <AssetsWorkspace activeTab={activeTab} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

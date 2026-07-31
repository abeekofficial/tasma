"use client";

import { useState, useEffect } from "react";
import { CategorySidebar, Category } from "./category-sidebar";
import { Search } from "lucide-react";

interface AssetsWorkspaceProps {
  activeTab: string;
}

const CATEGORIES_BY_TAB: Record<string, Category[]> = {
  media: [
    { id: "all", label: "All Media" },
    { id: "video", label: "Videos" },
    { id: "image", label: "Images" },
  ],
  text: [
    { id: "presets", label: "Presets" },
    { id: "titles", label: "Titles" },
    { id: "lower-thirds", label: "Lower Thirds" },
  ],
  audio: [
    { id: "music", label: "Music" },
    { id: "sfx", label: "Sound Effects" },
    { id: "vo", label: "Voiceovers" },
  ],
  transitions: [
    { id: "dissolve", label: "Dissolves" },
    { id: "wipe", label: "Wipes" },
    { id: "slide", label: "Slides" },
    { id: "zoom", label: "Zooms" },
  ],
  effects: [
    { id: "color", label: "Color" },
    { id: "blur", label: "Blurs" },
    { id: "stylize", label: "Stylize" },
    { id: "distortion", label: "Distortion" },
  ]
};

export function AssetsWorkspace({ activeTab }: AssetsWorkspaceProps) {
  const categories = CATEGORIES_BY_TAB[activeTab] || [];
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "");

  // Reset category when tab changes
  useEffect(() => {
    if (categories.length > 0) {
      setActiveCategory(categories[0].id);
    }
  }, [activeTab]); // Only depend on activeTab to reset when tab changes

  return (
    <div className="flex w-full h-full bg-zinc-950/50">
      <CategorySidebar 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-900/30">
        <div className="p-3 border-b border-zinc-800/50">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
            <input 
              type="text"
              placeholder="Search assets..."
              className="w-full bg-zinc-950 border border-zinc-800/80 rounded-md pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-2">
            {/* Placeholder items */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i} 
                className="aspect-video bg-zinc-800/40 rounded border border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-800/60 transition-colors flex flex-col items-center justify-center group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-800/80 flex items-center justify-center mb-1 group-hover:bg-zinc-700 transition-colors">
                  <span className="text-xs text-zinc-500 group-hover:text-zinc-300">{i + 1}</span>
                </div>
                <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400">Asset</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

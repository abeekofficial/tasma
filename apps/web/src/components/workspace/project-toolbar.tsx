"use client";

import { motion } from "framer-motion";
import { Search, Grid, List, Filter, SlidersHorizontal, Sparkles } from "lucide-react";
import { useState } from "react";

export type ViewMode = "grid" | "list";

interface ProjectToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ProjectToolbar({ viewMode, onViewModeChange }: ProjectToolbarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="sticky top-0 z-20 flex flex-col md:flex-row items-center justify-between gap-4 p-4 mb-6 backdrop-blur-xl bg-white/50 dark:bg-black/50 border-b border-zinc-200/50 dark:border-zinc-800/50">
      <div className="relative w-full md:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-100/50 dark:bg-zinc-900/50 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2 pr-4 border-r border-zinc-200 dark:border-zinc-800">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Status</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Resolution</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">AI Filter</span>
          </button>
        </div>

        <div className="flex items-center p-1 bg-zinc-100/80 dark:bg-zinc-900/80 rounded-lg">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === "grid"
                ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === "list"
                ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

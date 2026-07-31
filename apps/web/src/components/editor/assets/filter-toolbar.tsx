"use client";

import * as React from "react";
import { Clock, Star, Tag, ChevronDown, ListFilter } from "lucide-react";
import { motion } from "framer-motion";

export type SortOption = "date" | "name" | "size";

interface FilterToolbarProps {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  showFavorites: boolean;
  onFavoritesToggle: () => void;
  showRecent: boolean;
  onRecentToggle: () => void;
  activeTag: string | null;
  onTagToggle: (tag: string) => void;
}

export function FilterToolbar({
  sort,
  onSortChange,
  showFavorites,
  onFavoritesToggle,
  showRecent,
  onRecentToggle,
  activeTag,
  onTagToggle,
}: FilterToolbarProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-neutral-900 border-b border-neutral-800 text-xs text-neutral-300">
      <div className="flex items-center gap-1.5 border-r border-neutral-800 pr-3">
        <ListFilter className="w-3.5 h-3.5 text-neutral-500" />
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="bg-transparent text-neutral-300 outline-none cursor-pointer hover:text-neutral-100 transition-colors appearance-none pr-4 relative"
          style={{ backgroundImage: 'none' }}
        >
          <option value="date" className="bg-neutral-800">Date Added</option>
          <option value="name" className="bg-neutral-800">Name</option>
          <option value="size" className="bg-neutral-800">File Size</option>
        </select>
        <ChevronDown className="w-3 h-3 text-neutral-500 -ml-4 pointer-events-none" />
      </div>

      <div className="flex items-center gap-1">
        <FilterToggle
          active={showFavorites}
          onClick={onFavoritesToggle}
          icon={<Star className="w-3.5 h-3.5" />}
          label="Favorites"
        />
        <FilterToggle
          active={showRecent}
          onClick={onRecentToggle}
          icon={<Clock className="w-3.5 h-3.5" />}
          label="Recent"
        />
        <FilterToggle
          active={activeTag === "video"}
          onClick={() => onTagToggle("video")}
          icon={<Tag className="w-3.5 h-3.5" />}
          label="Video"
        />
        <FilterToggle
          active={activeTag === "audio"}
          onClick={() => onTagToggle("audio")}
          icon={<Tag className="w-3.5 h-3.5" />}
          label="Audio"
        />
      </div>
    </div>
  );
}

interface FilterToggleProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function FilterToggle({ active, onClick, icon, label }: FilterToggleProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`relative flex items-center justify-center p-1.5 rounded transition-all duration-200 ${
        active
          ? "text-blue-400 bg-blue-900/20"
          : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
      }`}
    >
      {icon}
      {active && (
        <motion.div
          layoutId="activeFilterIndicator"
          className="absolute inset-0 ring-1 ring-blue-500/50 rounded"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
}

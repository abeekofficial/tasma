"use client";

import { motion } from "framer-motion";

export interface Category {
  id: string;
  label: string;
}

interface CategorySidebarProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export function CategorySidebar({ categories, activeCategory, onCategoryChange }: CategorySidebarProps) {
  return (
    <div className="w-28 shrink-0 border-r border-zinc-800/50 flex flex-col py-2 bg-zinc-950/30 overflow-y-auto">
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`relative px-3 py-1.5 text-xs text-left transition-colors ${
              isActive ? "text-zinc-100 font-medium" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeCategoryBg"
                className="absolute inset-0 bg-zinc-800/60 rounded-md mx-1"
                transition={{ type: "spring", bounce: 0, duration: 0.2 }}
              />
            )}
            <span className="relative z-10">{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}

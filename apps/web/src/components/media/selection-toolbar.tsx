"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MoveRight, Trash2, Heart, Download } from "lucide-react";

interface SelectionToolbarProps {
  selectedCount: number;
  onClear: () => void;
  onAction: (action: "move" | "delete" | "favorite" | "download") => void;
}

export function SelectionToolbar({
  selectedCount,
  onClear,
  onAction,
}: SelectionToolbarProps) {
  return (
    <div className="fixed bottom-8 left-1/2 z-40 -translate-x-1/2 pointer-events-none">
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="pointer-events-auto flex items-center gap-4 rounded-2xl border border-gray-200/50 bg-white/90 p-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/90"
          >
            {/* Selection Count Label */}
            <div className="flex items-center gap-3 pl-3 pr-2">
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-500 px-1.5 text-xs font-semibold text-white">
                {selectedCount}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Selected
              </span>
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-white/10" />

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onAction("move")}
                className="group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <MoveRight className="h-4 w-4" />
                <span>Move</span>
              </button>
              
              <button
                onClick={() => onAction("favorite")}
                className="group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-pink-600 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-pink-400"
              >
                <Heart className="h-4 w-4" />
                <span>Favorite</span>
              </button>

              <button
                onClick={() => onAction("download")}
                className="group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-blue-400"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              
              <div className="h-6 w-px bg-gray-200 mx-1 dark:bg-white/10" />

              <button
                onClick={() => onAction("delete")}
                className="group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-500/20 dark:hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-white/10" />

            {/* Clear Selection */}
            <button
              onClick={onClear}
              className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-white"
              title="Clear selection"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

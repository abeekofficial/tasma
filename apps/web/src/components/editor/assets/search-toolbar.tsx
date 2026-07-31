"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchToolbarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchToolbar({
  value,
  onChange,
  placeholder = "Search assets...",
}: SearchToolbarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full p-2 bg-neutral-900/50 backdrop-blur-md border-b border-neutral-800">
      <div className="relative flex items-center w-full h-8 px-2 bg-neutral-800/50 rounded ring-1 ring-neutral-700/50 focus-within:ring-blue-500/50 focus-within:bg-neutral-800 transition-all duration-200">
        <Search className="w-4 h-4 text-neutral-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 bg-transparent text-sm text-neutral-200 placeholder:text-neutral-500 outline-none w-full"
        />
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={handleClear}
              className="p-1 hover:bg-neutral-700 rounded-full text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

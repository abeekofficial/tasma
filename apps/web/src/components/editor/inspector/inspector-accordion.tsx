"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InspectorAccordionProps {
  title: string;
  defaultOpen?: boolean;
  onReset?: () => void;
  children: React.ReactNode;
}

export function InspectorAccordion({
  title,
  defaultOpen = false,
  onReset,
  children,
}: InspectorAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-zinc-800/50">
      <div className="flex items-center justify-between p-3 hover:bg-zinc-800/30 transition-colors">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-1 items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-zinc-100 transition-colors outline-none"
        >
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span>{title}</span>
        </button>
        {onReset && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            className="text-zinc-500 hover:text-zinc-300 transition-colors ml-2 p-1 rounded-sm hover:bg-zinc-700/50"
            title="Reset to default"
          >
            <RotateCcw size={12} />
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

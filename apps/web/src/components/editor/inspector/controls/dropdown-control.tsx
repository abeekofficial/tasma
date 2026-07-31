"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface DropdownControlProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function DropdownControl({ options, value, onChange, className = '' }: DropdownControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-2 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-50 top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded shadow-xl overflow-hidden py-1"
          >
            <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-zinc-300 hover:bg-blue-600 hover:text-white transition-colors"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === value && (
                    <Check className="w-3.5 h-3.5" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

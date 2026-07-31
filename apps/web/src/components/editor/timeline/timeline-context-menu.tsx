"use client";

import React, { useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, SplitSquareHorizontal, Trash2, Group, Ungroup, Lock, VolumeX, Settings } from "lucide-react";

interface TimelineContextMenuProps {
  children: ReactNode;
}

export function TimelineContextMenu({ children }: TimelineContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("contextmenu", (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    });
    
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, closeMenu]);

  const menuItems = [
    { label: "Duplicate", icon: Copy, shortcut: "Ctrl+D" },
    { label: "Split", icon: SplitSquareHorizontal, shortcut: "S" },
    { label: "Delete", icon: Trash2, shortcut: "Del" },
    { divider: true },
    { label: "Group", icon: Group, shortcut: "Ctrl+G" },
    { label: "Ungroup", icon: Ungroup, shortcut: "Ctrl+Shift+G" },
    { divider: true },
    { label: "Lock", icon: Lock, shortcut: "L" },
    { label: "Mute", icon: VolumeX, shortcut: "M" },
    { divider: true },
    { label: "Properties", icon: Settings, shortcut: "P" },
  ];

  return (
    <div onContextMenu={handleContextMenu} className="w-full h-full relative">
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            style={{ 
              top: position.y, 
              left: position.x,
            }}
            className="fixed z-50 min-w-[220px] rounded-lg bg-zinc-900/90 backdrop-blur-md border border-zinc-800 shadow-2xl p-1 overflow-hidden"
          >
            {menuItems.map((item, i) => (
              item.divider ? (
                <div key={`div-${i}`} className="h-px bg-zinc-800/50 my-1 w-full" />
              ) : (
                <button
                  key={item.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    closeMenu();
                  }}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <item.icon className="w-4 h-4 text-zinc-400" />}
                    <span>{item.label}</span>
                  </div>
                  {item.shortcut && (
                    <span className="text-xs text-zinc-500 tracking-wider">
                      {item.shortcut}
                    </span>
                  )}
                </button>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

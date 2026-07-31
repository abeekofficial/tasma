"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Edit2, Archive, MoveRight, Pin, Trash2 } from "lucide-react";

interface ContextMenuProps {
  children: React.ReactNode;
  onDuplicate?: () => void;
  onRename?: () => void;
  onArchive?: () => void;
  onMove?: () => void;
  onPin?: () => void;
  onDelete?: () => void;
}

export function ContextMenu({
  children,
  onDuplicate,
  onRename,
  onArchive,
  onMove,
  onPin,
  onDelete,
}: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const menuItems = [
    { label: "Duplicate", icon: Copy, onClick: onDuplicate, shortcut: "⌘D" },
    { label: "Rename", icon: Edit2, onClick: onRename, shortcut: "F2" },
    { label: "Archive", icon: Archive, onClick: onArchive },
    { label: "Move to...", icon: MoveRight, onClick: onMove },
    { label: "Pin", icon: Pin, onClick: onPin },
    { divider: true },
    { label: "Delete", icon: Trash2, onClick: onDelete, shortcut: "⌫", danger: true },
  ];

  return (
    <>
      <div ref={triggerRef} onContextMenu={handleContextMenu} className="w-full h-full">
        {children}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
            style={{ top: position.y, left: position.x }}
            className="fixed z-50 flex w-56 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/70 py-1.5 shadow-xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70"
          >
            {menuItems.map((item, index) => {
              if (item.divider) {
                return <div key={`div-${index}`} className="my-1.5 h-px bg-zinc-200 dark:bg-zinc-800" />;
              }

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  className={`group flex w-full items-center justify-between px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 ${
                    item.danger
                      ? "text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon && <item.icon className="h-4 w-4 opacity-70 group-hover:opacity-100" />}
                    <span>{item.label}</span>
                  </div>
                  {item.shortcut && (
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      {item.shortcut}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

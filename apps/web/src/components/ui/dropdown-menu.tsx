'use client';

import React, { useState, useRef, useEffect } from 'react';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
}

export function DropdownMenu({ trigger, children, align = 'end' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0'
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          className={`absolute z-50 mt-2 w-56 rounded-md border border-zinc-800 bg-zinc-950/90 shadow-lg backdrop-blur-xl animate-fade-in origin-top-right ${alignClasses[align]}`}
          onClick={() => setIsOpen(false)}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export function DropdownMenuItem({ 
  children, 
  onClick, 
  icon,
  shortcut,
  variant = 'default' 
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
  icon?: React.ReactNode;
  shortcut?: string;
  variant?: 'default' | 'destructive';
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors
        ${variant === 'destructive' ? 'text-red-400 hover:bg-red-500/10' : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-100'}
      `}
      role="menuitem"
    >
      <div className="flex items-center">
        {icon && <span className="mr-2 h-4 w-4">{icon}</span>}
        {children}
      </div>
      {shortcut && <span className="text-xs text-zinc-500 tracking-widest">{shortcut}</span>}
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <div className="h-px my-1 bg-zinc-800" />;
}

export function DropdownMenuLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
      {children}
    </div>
  );
}

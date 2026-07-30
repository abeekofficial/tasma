'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface UseResizablePanelOptions {
  direction: 'horizontal' | 'vertical';
  initialSize: number;
  minSize: number;
  maxSize: number;
  onResize?: (newSize: number) => void;
  storageKey?: string;
}

export interface UseResizablePanelReturn {
  size: number;
  isDragging: boolean;
  handleRef: React.RefObject<HTMLDivElement>;
  handleProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    style: React.CSSProperties;
    className: string;
    role: string;
    'aria-label': string;
    'aria-orientation': 'horizontal' | 'vertical';
    tabIndex: number;
  };
}

export function useResizablePanel({
  direction,
  initialSize,
  minSize,
  maxSize,
  onResize,
  storageKey,
}: UseResizablePanelOptions): UseResizablePanelReturn {
  const [size, setSize] = useState<number>(() => {
    if (typeof window !== 'undefined' && storageKey) {
      const stored = localStorage.getItem(storageKey);
      if (stored) return parseInt(stored, 10);
    }
    return initialSize;
  });

  const [isDragging, setIsDragging] = useState(false);
  const handleRef = useRef<HTMLDivElement>(null);

  const resize = useCallback(
    (newSize: number) => {
      const clampedSize = Math.max(minSize, Math.min(newSize, maxSize));
      setSize(clampedSize);
      onResize?.(clampedSize);
      if (storageKey) {
        localStorage.setItem(storageKey, clampedSize.toString());
      }
    },
    [minSize, maxSize, onResize, storageKey]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (direction === 'horizontal') {
        resize(e.clientX);
      } else {
        resize(e.clientY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Add cursor style to body to maintain cursor while dragging outside handle
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [isDragging, direction, resize]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = 10;
    if (direction === 'horizontal') {
      if (e.key === 'ArrowLeft') {
        resize(size - step);
      } else if (e.key === 'ArrowRight') {
        resize(size + step);
      }
    } else {
      if (e.key === 'ArrowUp') {
        resize(size - step);
      } else if (e.key === 'ArrowDown') {
        resize(size + step);
      }
    }
  }, [direction, resize, size]);

  const className = direction === 'horizontal'
    ? 'w-1 h-full bg-zinc-800 hover:bg-violet-500 transition-colors cursor-col-resize z-10 select-none'
    : 'h-1 w-full bg-zinc-800 hover:bg-violet-500 transition-colors cursor-row-resize z-10 select-none';

  return {
    size,
    isDragging,
    handleRef,
    handleProps: {
      onMouseDown,
      onKeyDown,
      style: { touchAction: 'none' },
      className,
      role: 'separator',
      'aria-label': 'Resize panel',
      'aria-orientation': direction,
      tabIndex: 0,
    },
  };
}

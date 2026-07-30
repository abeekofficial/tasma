'use client';

import React from 'react';
import { useEditor } from '@/hooks/use-editor-state';

interface TimeRulerProps {
  zoom: number;
  duration: number;
  currentTime: number;
}

export const TimeRuler = React.memo(({ zoom, duration, currentTime }: TimeRulerProps) => {
  const { dispatch } = useEditor();
  const pixelsPerSecond = 60 * zoom;
  const width = duration * pixelsPerSecond;

  const handleRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = Math.max(0, Math.min(duration, x / pixelsPerSecond));
    dispatch({ type: 'SET_CURRENT_TIME', payload: { currentTime: time } });
  };

  const renderTicks = () => {
    const ticks = [];
    // Adjust tick frequency based on zoom
    const majorInterval = zoom < 0.5 ? 10 : zoom > 3 ? 1 : 5;
    const minorInterval = majorInterval / 5;
    const numTicks = Math.ceil(duration / minorInterval);

    for (let i = 0; i <= numTicks; i++) {
      const time = i * minorInterval;
      if (time > duration) break;
      
      const x = time * pixelsPerSecond;
      const isMajor = time % majorInterval === 0;

      ticks.push(
        <div key={time} className="absolute top-0 flex flex-col items-center" style={{ left: `${x}px`, transform: 'translateX(-50%)' }}>
          {isMajor ? (
            <>
              <div className="h-3 w-px bg-zinc-600" />
              <span className="text-[10px] text-zinc-500 mt-0.5 font-mono select-none">
                0:{time.toString().padStart(2, '0')}
              </span>
            </>
          ) : (
             <div className="h-1.5 w-px bg-zinc-700" />
          )}
        </div>
      );
    }
    return ticks;
  };

  return (
    <div 
      className="h-6 sticky top-0 bg-zinc-900/50 backdrop-blur-sm z-10 border-b border-zinc-800 cursor-text overflow-hidden"
      style={{ width: `${width}px`, minWidth: '100%' }}
      onClick={handleRulerClick}
    >
      <div className="relative w-full h-full">
        {renderTicks()}
        {/* Small red marker at current time on ruler */}
        <div 
          className="absolute top-0 h-full w-px bg-red-500 pointer-events-none"
          style={{ left: `${currentTime * pixelsPerSecond}px` }}
        >
           <div className="absolute top-0 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-red-500" />
        </div>
      </div>
    </div>
  );
});
TimeRuler.displayName = 'TimeRuler';

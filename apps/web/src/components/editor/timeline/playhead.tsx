'use client';

import React from 'react';

interface PlayheadProps {
  currentTime: number;
  pixelsPerSecond: number;
}

export const Playhead = React.memo(({ currentTime, pixelsPerSecond }: PlayheadProps) => {
  const left = currentTime * pixelsPerSecond;

  return (
    <div 
      className="absolute top-0 bottom-0 z-20 pointer-events-none transition-all duration-75 ease-linear"
      style={{ left: `${left}px` }}
    >
      {/* Top Triangle */}
      <div className="absolute top-0 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-red-500" />
      {/* Vertical Line */}
      <div className="absolute top-[8px] bottom-0 -translate-x-1/2 w-0.5 bg-red-500" />
    </div>
  );
});
Playhead.displayName = 'Playhead';

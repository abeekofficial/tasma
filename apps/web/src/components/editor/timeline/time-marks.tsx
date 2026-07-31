"use client";

import React, { useMemo } from "react";

interface TimeMarksProps {
  zoomScale?: number;
  totalWidth?: number;
}

export const TimeMarks = React.memo(({ zoomScale = 1, totalWidth = 2000 }: TimeMarksProps) => {
  const marks = useMemo(() => {
    const tickSpacing = 50 * zoomScale;
    const numTicks = Math.ceil(totalWidth / tickSpacing);

    const paths = [];
    for (let i = 0; i <= numTicks; i++) {
      const x = i * tickSpacing;
      
      paths.push(
        <g key={i} transform={`translate(${x}, 0)`}>
          <line
            x1="0"
            y1="14"
            x2="0"
            y2="28"
            stroke="currentColor"
            strokeWidth="1"
            className="text-zinc-700/50"
          />
          <text
            x="4"
            y="12"
            fill="currentColor"
            className="text-[9px] text-zinc-500 font-mono select-none"
          >
            00:00:{i.toString().padStart(2, '0')}
          </text>
        </g>
      );
    }
    return paths;
  }, [zoomScale, totalWidth]);

  return (
    <svg width={totalWidth} height="28" className="pointer-events-none">
      {marks}
    </svg>
  );
});

TimeMarks.displayName = "TimeMarks";

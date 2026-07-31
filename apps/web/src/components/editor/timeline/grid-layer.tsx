"use client";

import React, { useMemo } from "react";

interface GridLayerProps {
  zoomScale?: number;
  fps?: number;
  durationInSeconds?: number;
}

export function GridLayer({
  zoomScale = 5,
  fps = 30,
  durationInSeconds = 60,
}: GridLayerProps) {
  const pixelsPerSecond = zoomScale * fps;
  const totalWidth = durationInSeconds * pixelsPerSecond;

  const { secondWidth, frameWidth, minorWidth } = useMemo(() => {
    let secondW = pixelsPerSecond;
    let minorW = pixelsPerSecond / 2;

    if (pixelsPerSecond < 10) {
      secondW = pixelsPerSecond * 10;
      minorW = pixelsPerSecond * 5;
    } else if (pixelsPerSecond < 50) {
      secondW = pixelsPerSecond * 5;
      minorW = pixelsPerSecond;
    } else if (pixelsPerSecond < 100) {
      secondW = pixelsPerSecond;
      minorW = pixelsPerSecond / 2;
    } else {
      secondW = pixelsPerSecond;
      minorW = pixelsPerSecond / 10;
    }

    const frameW = pixelsPerSecond / fps;

    return {
      secondWidth: secondW,
      frameWidth: frameW,
      minorWidth: minorW,
    };
  }, [pixelsPerSecond, fps]);

  const showFrames = pixelsPerSecond >= 300;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{ width: `${totalWidth}px` }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="grid-frames"
            width={frameWidth}
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1={frameWidth}
              y1="0"
              x2={frameWidth}
              y2="100%"
              stroke="currentColor"
              className="text-neutral-800/30"
              strokeWidth="1"
            />
          </pattern>
          <pattern
            id="grid-minor"
            width={minorWidth}
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1={minorWidth}
              y1="0"
              x2={minorWidth}
              y2="100%"
              stroke="currentColor"
              className="text-neutral-800/60"
              strokeWidth="1"
            />
          </pattern>
          <pattern
            id="grid-seconds"
            width={secondWidth}
            height="100"
            patternUnits="userSpaceOnUse"
          >
            {showFrames && (
              <rect width="100%" height="100%" fill="url(#grid-frames)" />
            )}
            {!showFrames && (
              <rect width="100%" height="100%" fill="url(#grid-minor)" />
            )}
            <line
              x1={secondWidth}
              y1="0"
              x2={secondWidth}
              y2="100%"
              stroke="currentColor"
              className="text-neutral-700"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid-seconds)" />
      </svg>
    </div>
  );
}

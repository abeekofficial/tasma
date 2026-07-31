"use client";

import React from "react";
import { motion } from "framer-motion";

interface SelectionBoxProps {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export function SelectionBox({ startX, startY, currentX, currentY }: SelectionBoxProps) {
  const x = Math.min(startX, currentX);
  const y = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  if (width === 0 && height === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute z-40 bg-blue-500/20 border border-blue-500/50 rounded-sm pointer-events-none"
      style={{
        left: x,
        top: y,
        width,
        height,
      }}
    />
  );
}

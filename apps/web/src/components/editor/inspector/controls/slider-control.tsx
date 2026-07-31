"use client";

import React from 'react';
import { NumberInput } from './number-input';

interface SliderControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  className?: string;
}

export function SliderControl({ 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  unit, 
  className = '' 
}: SliderControlProps) {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden group cursor-pointer border border-zinc-700/50">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div 
          className="absolute top-0 left-0 h-full bg-blue-500 group-hover:bg-blue-400 transition-colors pointer-events-none"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="w-[60px] shrink-0">
        <NumberInput 
          value={value} 
          onChange={onChange} 
          min={min} 
          max={max} 
          step={step} 
          unit={unit} 
        />
      </div>
    </div>
  );
}

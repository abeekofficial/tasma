"use client";

import React, { useState, useRef, useEffect } from 'react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function NumberInput({ 
  value, 
  onChange, 
  unit, 
  min = -Infinity, 
  max = Infinity, 
  step = 1, 
  className = '' 
}: NumberInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!isDragging) {
      setInternalValue(value);
    }
  }, [value, isDragging]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Only left click
    e.preventDefault();
    setIsDragging(true);
    
    const startX = e.clientX;
    const startValue = internalValue;
    
    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      // Adjust sensitivity by dividing deltaX
      let newValue = startValue + (deltaX * step);
      
      if (newValue < min) newValue = min;
      if (newValue > max) newValue = max;
      
      const precision = Math.max(0, (step.toString().split('.')[1] || '').length);
      newValue = Number(newValue.toFixed(precision));
      
      setInternalValue(newValue);
      onChange(newValue);
    };
    
    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
    
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      let newValue = val;
      if (newValue < min) newValue = min;
      if (newValue > max) newValue = max;
      setInternalValue(newValue);
      onChange(newValue);
    }
  };

  return (
    <div className={`relative flex items-center bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden transition-all ${className}`}>
      <input
        ref={inputRef}
        type="number"
        value={isDragging ? internalValue : value}
        onChange={handleInputChange}
        className="w-full bg-transparent text-xs text-zinc-200 outline-none px-2 py-1 placeholder:text-zinc-500 font-mono hide-spin-button"
        style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
      />
      {unit ? (
        <span 
          className="text-xs text-zinc-500 pr-2 select-none cursor-ew-resize font-mono"
          onPointerDown={handlePointerDown}
        >
          {unit}
        </span>
      ) : (
        <div 
          className="absolute inset-0 cursor-ew-resize opacity-0"
          onPointerDown={handlePointerDown}
        />
      )}
    </div>
  );
}

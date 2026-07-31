"use client";

import React, { useState, useEffect } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className = '' }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    
    if (/^#([0-9A-F]{3}){1,2}$/i.test(newVal)) {
      onChange(newVal);
    }
  };

  const handleInputBlur = () => {
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(inputValue)) {
      setInputValue(value);
    }
  };

  return (
    <div className={`flex items-center gap-2 w-full ${className}`}>
      <div className="relative shrink-0">
        <button
          type="button"
          className="w-6 h-6 rounded-[3px] border border-zinc-600 shadow-sm overflow-hidden flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-blue-500"
          style={{ backgroundColor: value }}
        >
          <span className="sr-only">Pick color</span>
        </button>
        <input 
          type="color" 
          value={value} 
          onChange={(e) => {
            onChange(e.target.value);
            setInputValue(e.target.value);
          }}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>

      <div className="flex-1 flex items-center bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden transition-all">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className="w-full bg-transparent text-xs text-zinc-200 outline-none px-2 py-1 font-mono uppercase"
          placeholder="#000000"
          maxLength={7}
        />
      </div>
    </div>
  );
}

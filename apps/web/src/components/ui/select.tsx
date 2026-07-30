'use client';

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  options: SelectOption[];
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', options, value, onChange, label, error, fullWidth = false, disabled, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
      if (onChange) {
        onChange({ target: { value: optionValue } });
      }
      setIsOpen(false);
    };

    return (
      <div className={`flex flex-col space-y-1.5 ${fullWidth ? 'w-full' : ''}`} ref={containerRef}>
        {label && (
          <label className="text-sm font-medium text-zinc-300">
            {label}
          </label>
        )}
        <div className="relative">
          <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={`
              flex w-full items-center justify-between rounded-lg border bg-zinc-900/50 px-3 py-2.5 text-sm ring-offset-zinc-950 transition-colors
              ${error ? 'border-red-500/50 focus:ring-red-500/20' : 'border-zinc-800 hover:border-zinc-700 focus:border-violet-500 focus:ring-violet-500/20'}
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              focus:outline-none focus:ring-2 focus:ring-offset-2
              text-zinc-100
              ${className}
            `}
          >
            <span className="truncate">{selectedOption?.label || 'Select...'}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </button>
          
          {isOpen && (
            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-800 bg-zinc-900 py-1 shadow-lg animate-fade-in glass">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`
                    relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-3 pr-9 text-sm outline-none transition-colors
                    ${value === option.value ? 'bg-violet-500/10 text-violet-400' : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-100'}
                  `}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="truncate">{option.label}</span>
                  {value === option.value && (
                    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Hidden native select for form integration if needed */}
        <select
          ref={ref}
          value={value}
          onChange={(e) => onChange && onChange({ target: { value: e.target.value } })}
          className="hidden"
          disabled={disabled}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';

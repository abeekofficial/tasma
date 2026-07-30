'use client';

import React, { createContext, useContext, useState } from 'react';

type TabsContextType = {
  value: string;
  onValueChange: (value: string) => void;
  variant: 'underline' | 'pill';
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: 'underline' | 'pill';
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, value, onValueChange, variant = 'underline', children, className = '' }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  
  const currentValue = value !== undefined ? value : internalValue;
  
  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, variant }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { variant } = useContext(TabsContext)!;
  
  const baseClasses = variant === 'underline' 
    ? 'flex border-b border-zinc-800'
    : 'inline-flex items-center justify-center rounded-lg bg-zinc-900/50 p-1 text-zinc-400';
    
  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className = '' }: { value: string; children: React.ReactNode; className?: string }) {
  const { value: selectedValue, onValueChange, variant } = useContext(TabsContext)!;
  const isSelected = selectedValue === value;
  
  const variantClasses = variant === 'underline'
    ? `inline-flex items-center justify-center whitespace-nowrap px-4 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-b-2 -mb-[1px]
       ${isSelected ? 'border-violet-500 text-zinc-100' : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'}`
    : `inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
       ${isSelected ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'hover:text-zinc-200'}`;
       
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={() => onValueChange(value)}
      className={`${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = '' }: { value: string; children: React.ReactNode; className?: string }) {
  const { value: selectedValue } = useContext(TabsContext)!;
  
  if (selectedValue !== value) return null;
  
  return (
    <div 
      role="tabpanel"
      className={`mt-4 animate-fade-in ${className}`}
    >
      {children}
    </div>
  );
}

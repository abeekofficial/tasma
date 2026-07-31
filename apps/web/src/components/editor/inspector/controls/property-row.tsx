import React from 'react';

interface PropertyRowProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
}

export function PropertyRow({ label, children, className = '', labelClassName = '' }: PropertyRowProps) {
  return (
    <div className={`grid grid-cols-[80px_1fr] items-center gap-2 ${className}`}>
      <span className={`text-xs text-zinc-400 select-none truncate ${labelClassName}`} title={label}>
        {label}
      </span>
      <div className="flex items-center gap-1 min-w-0 w-full">
        {children}
      </div>
    </div>
  );
}

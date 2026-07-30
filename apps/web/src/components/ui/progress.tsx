import React from 'react';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
}

export function Progress({
  value = 0,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  className = '',
  ...props
}: ProgressProps) {
  // Clamp value between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value));
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-violet-500 to-purple-500',
    success: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
    warning: 'bg-gradient-to-r from-amber-400 to-orange-500',
    error: 'bg-gradient-to-r from-rose-400 to-red-500'
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-zinc-300">Progress</span>
          <span className="text-xs font-medium text-zinc-400">{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div className={`w-full bg-zinc-800 overflow-hidden rounded-full ${sizeClasses[size]}`}>
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${variantClasses[variant]}`}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

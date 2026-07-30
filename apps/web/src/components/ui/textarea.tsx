import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, helperText, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-zinc-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            flex min-h-[80px] w-full rounded-lg border bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 ring-offset-zinc-950
            placeholder:text-zinc-500 transition-colors resize-y
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50' : 'border-zinc-800 hover:border-zinc-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50'}
            focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50
            ${className}
          `}
          {...props}
        />
        {error ? (
          <span className="text-xs text-red-500">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-zinc-500">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

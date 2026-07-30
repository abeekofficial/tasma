import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-zinc-800/80 ${className}`}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} 
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-4 ${className}`}>
      <Skeleton className="h-32 w-full rounded-lg mb-4" />
      <SkeletonText lines={2} className="mb-4" />
      <div className="flex justify-between items-center mt-auto">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonAvatar({ className = '' }: { className?: string }) {
  return <Skeleton className={`h-10 w-10 rounded-full ${className}`} />;
}

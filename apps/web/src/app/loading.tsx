import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 bg-violet-600/30 rounded-full blur-xl animate-pulse"></div>
        <div className="relative w-full h-full rounded-full border-4 border-zinc-800 border-t-violet-500 border-r-cyan-400 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-gradient-to-tr from-violet-600 to-cyan-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="mt-4 text-zinc-500 font-medium tracking-wide text-sm animate-pulse">
        Loading...
      </p>
    </div>
  );
}

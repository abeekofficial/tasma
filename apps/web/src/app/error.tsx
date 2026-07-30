'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl text-center shadow-2xl">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-bold text-zinc-100 mb-2">Something went wrong</h2>
        <p className="text-zinc-400 mb-8">
          We encountered an unexpected error while loading this page.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-zinc-950 rounded-lg overflow-auto text-left border border-red-900/50">
            <p className="text-red-400 font-mono text-xs">{error.message}</p>
          </div>
        )}

        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg transition-colors font-medium border border-zinc-700 w-full justify-center"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}

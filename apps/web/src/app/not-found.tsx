import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative w-48 h-48 mx-auto mb-8">
          <div className="absolute inset-0 bg-violet-600/20 blur-3xl rounded-full animate-pulse"></div>
          <div className="relative z-10 flex items-center justify-center w-full h-full text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-cyan-400">
            404
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-zinc-100">Page not found</h1>
        <p className="text-zinc-400">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="pt-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-violet-600/20"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

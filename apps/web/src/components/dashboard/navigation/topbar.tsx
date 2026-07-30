"use client";

import { usePathname } from "next/navigation";
import { Menu, Plus, Bell } from "lucide-react";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  
  // Basic breadcrumb logic
  const segments = pathname?.split('/').filter(Boolean) || [];
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-zinc-950/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="text-zinc-400 hover:text-white lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <nav className="hidden sm:flex" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-2">
            <li>
              <div className="flex items-center">
                <span className="text-sm font-medium text-zinc-400">Tasma</span>
              </div>
            </li>
            {segments.map((segment) => (
              <li key={segment}>
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-zinc-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-zinc-300 capitalize">
                    {segment}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-full p-2 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        
        <button className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
        
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 ring-2 ring-white/10" />
      </div>
    </header>
  );
}

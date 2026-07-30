"use client";

import { Search, Bell, Menu } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="h-16 glass border-x-0 border-t-0 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="lg:hidden px-2"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="hidden sm:block max-w-md w-full">
          <Input 
            placeholder="Search projects, templates..." 
            leftIcon={<Search className="w-4 h-4" />}
            className="h-9 bg-zinc-900/50 border-zinc-800/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="px-2 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
        </Button>
        <Button variant="primary" size="sm" className="hidden sm:inline-flex">
          New Project
        </Button>
      </div>
    </header>
  );
}

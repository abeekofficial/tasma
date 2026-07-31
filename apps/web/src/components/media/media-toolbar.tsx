"use client";

import React from "react";
import { 
  Search, 
  Upload, 
  Filter, 
  Calendar, 
  FileBox, 
  ChevronRight,
  LayoutGrid,
  List
} from "lucide-react";
import { motion } from "framer-motion";

export const MediaToolbar = () => {
  return (
    <div className="sticky top-0 z-20 w-full bg-background/70 backdrop-blur-xl border-b border-border/40 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left side: Breadcrumbs */}
      <div className="flex items-center text-sm font-medium text-muted-foreground overflow-hidden whitespace-nowrap">
        <span className="hover:text-foreground cursor-pointer transition-colors">Workspace</span>
        <ChevronRight className="w-4 h-4 mx-1 flex-shrink-0 opacity-50" />
        <span className="hover:text-foreground cursor-pointer transition-colors">My Media</span>
        <ChevronRight className="w-4 h-4 mx-1 flex-shrink-0 opacity-50" />
        <span className="text-foreground">Project Alpha</span>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Search */}
        <div className="relative group flex-1 sm:flex-initial">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full sm:w-64 pl-9 pr-3 py-1.5 text-sm bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-muted-foreground/70"
            placeholder="Search media..."
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Filters */}
        <div className="hidden md:flex items-center bg-muted/30 border border-border/50 rounded-lg p-0.5">
          <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
            <FileBox className="w-3.5 h-3.5" />
            Type
          </button>
          <div className="w-px h-3.5 bg-border/50 mx-0.5" />
          <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Size
          </button>
          <div className="w-px h-3.5 bg-border/50 mx-0.5" />
          <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
            <Calendar className="w-3.5 h-3.5" />
            Date
          </button>
        </div>

        {/* View Toggle */}
        <div className="hidden sm:flex items-center bg-muted/30 border border-border/50 rounded-lg p-0.5">
          <button className="p-1.5 text-foreground bg-background rounded-md shadow-sm border border-border/50">
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Upload Button */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-medium shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Upload</span>
        </motion.button>
      </div>
    </div>
  );
};

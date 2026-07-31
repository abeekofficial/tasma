"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Folder, 
  HardDrive, 
  ChevronRight, 
  Star, 
  Clock, 
  Users, 
  Image as ImageIcon, 
  Video, 
  Music,
  Settings,
  MoreVertical
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  children?: React.ReactNode;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
}

const SidebarItem = ({ 
  icon, 
  label, 
  isActive = false, 
  children,
  isCollapsible = false,
  defaultExpanded = false
}: SidebarItemProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col w-full">
      <div 
        className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
          isActive 
            ? "bg-primary/10 text-primary font-medium" 
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        }`}
        onClick={isCollapsible ? toggleExpand : undefined}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {isCollapsible && (
            <button 
              onClick={toggleExpand}
              className="p-0.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </button>
          )}
          {!isCollapsible && <div className="w-5" />}
          <div className="flex items-center gap-2.5 truncate">
            {icon}
            <span className="text-sm truncate">{label}</span>
          </div>
        </div>
        
        {!isCollapsible && (
          <button className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-all">
            <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {isCollapsible && children && (
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pl-9 pr-2 py-1 flex flex-col gap-0.5 border-l border-border/50 ml-5 mt-1">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export const FolderSidebar = () => {
  return (
    <aside className="w-64 h-full flex flex-col bg-background/50 backdrop-blur-xl border-r border-border/40 shrink-0">
      {/* Header */}
      <div className="h-14 flex items-center px-4 border-b border-border/40">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <HardDrive className="w-5 h-5 text-primary" />
          <span>Workspace</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-1 custom-scrollbar">
        <SidebarItem 
          icon={<Folder className="w-4 h-4 text-blue-500" />} 
          label="My Media" 
          isCollapsible 
          defaultExpanded
        >
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
            <Video className="w-4 h-4 text-purple-500" />
            <span>Videos</span>
          </div>
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
            <ImageIcon className="w-4 h-4 text-emerald-500" />
            <span>Images</span>
          </div>
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
            <Music className="w-4 h-4 text-amber-500" />
            <span>Audio</span>
          </div>
        </SidebarItem>

        <SidebarItem icon={<Star className="w-4 h-4 text-yellow-500" />} label="Favorites" />
        <SidebarItem icon={<Clock className="w-4 h-4 text-slate-500" />} label="Recent" />
        <SidebarItem icon={<Users className="w-4 h-4 text-cyan-500" />} label="Shared with me" />
      </div>

      {/* Footer / Storage */}
      <div className="p-4 border-t border-border/40 bg-muted/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-foreground">Storage</span>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mb-2">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: "45%" }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>45 GB used</span>
          <span>100 GB</span>
        </div>
      </div>
    </aside>
  );
};

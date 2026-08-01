'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, RotateCcw, RotateCw, Download, 
  Wand2, Bell, Layout, Palette, Volume2, Monitor, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils'; 
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useEditorStore } from '@/stores/editor-store';
import { ProjectSettingsDialog } from '../project-settings-dialog';
import { Input } from '@/components/ui/input';

const WORKSPACES = [
  { id: 'editing', label: 'Editing', icon: Layout },
  { id: 'color', label: 'Color', icon: Palette },
  { id: 'audio', label: 'Audio', icon: Volume2 },
];

export const EditorToolbar = React.memo(() => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState('editing');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Zustand State
  const projectName = useEditorStore(state => state.projectName);
  const setProjectName = useEditorStore(state => state.setProjectMeta);
  const isDirty = useEditorStore(state => state.isDirty);
  const undoStackLength = useEditorStore(state => state.undoStack.length);
  const redoStackLength = useEditorStore(state => state.redoStack.length);
  const undo = useEditorStore(state => state.undo);
  const redo = useEditorStore(state => state.redo);
  
  const [title, setTitle] = useState(projectName);
  const isRendering = false; // Mock for Render Status
  const [previewQuality, setPreviewQuality] = useState('1/2');

  return (
    <>
      <TooltipProvider>
        <div className="flex items-center justify-between h-14 bg-zinc-950 border-b border-zinc-900 px-4 flex-shrink-0 text-sm font-medium text-zinc-300 shadow-sm z-50">
          
          {/* Left Section - Title & Status */}
          <div className="flex items-center space-x-3 flex-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/projects">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">Back to Projects</TooltipContent>
            </Tooltip>
            
            <div className="w-[1px] h-6 bg-zinc-800 mx-1" />
            
            <div className="flex items-center group space-x-3 px-2">
              {isEditingTitle ? (
                <Input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => {
                    setIsEditingTitle(false);
                    setProjectName({ projectId: 'current', projectName: title });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsEditingTitle(false);
                      setProjectName({ projectId: 'current', projectName: title });
                    }
                  }}
                  className="h-7 py-1 px-2 w-48 text-sm bg-zinc-900 border-zinc-700 focus-visible:ring-indigo-500"
                />
              ) : (
                <span 
                  onDoubleClick={() => setIsEditingTitle(true)}
                  className="text-sm font-medium text-zinc-100 cursor-text hover:bg-zinc-800 px-2 py-1 rounded transition-colors duration-200"
                >
                  {projectName}
                </span>
              )}
              
              <div className="flex items-center space-x-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]",
                  isDirty ? "bg-yellow-500 text-yellow-500" : "bg-emerald-500 text-emerald-500"
                )} />
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                  {isDirty ? 'Unsaved' : 'Saved'}
                </span>
              </div>
            </div>
          </div>

          {/* Center Section - Workspace Switcher */}
          <div className="flex flex-1 items-center justify-center h-full gap-4">
            
            {/* Playback Quality Dropdown (Mocked UI) */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-900/50 rounded-md border border-zinc-800/50 text-xs">
               <Monitor size={14} className="text-zinc-500" />
               <span className="text-zinc-400 font-mono select-none cursor-pointer hover:text-zinc-200" onClick={() => setPreviewQuality(previewQuality === '1/2' ? 'Full' : '1/2')}>
                 {previewQuality}
               </span>
            </div>

            <div className="flex p-1 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
              {WORKSPACES.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => setActiveWorkspace(workspace.id)}
                  className={cn(
                    "relative flex items-center space-x-2 px-4 py-1.5 rounded-md text-xs font-medium transition-colors duration-200",
                    activeWorkspace === workspace.id 
                      ? "text-zinc-100" 
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                  )}
                >
                  {activeWorkspace === workspace.id && (
                    <motion.div
                      layoutId="active-workspace-bg"
                      className="absolute inset-0 bg-zinc-800 rounded-md shadow-sm border border-zinc-700/50"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <workspace.icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{workspace.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Section - Tools & Export */}
          <div className="flex items-center justify-end space-x-2 flex-1">
            
            {/* Render Status indicator */}
            {isRendering && (
               <div className="flex items-center gap-2 mr-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 text-xs font-medium animate-pulse">
                 <Loader2 size={12} className="animate-spin" />
                 Rendering
               </div>
            )}

            <div className="flex items-center bg-zinc-900/50 rounded-md border border-zinc-800/50 p-0.5 mr-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-sm"
                    disabled={undoStackLength === 0}
                    onClick={undo}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Undo (Ctrl+Z)</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-sm"
                    disabled={redoStackLength === 0}
                    onClick={redo}
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Redo (Ctrl+Shift+Z)</TooltipContent>
              </Tooltip>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative group flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 text-indigo-300 border border-indigo-500/30 overflow-hidden shadow-[0_0_10px_rgba(99,102,241,0.1)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 group-hover:opacity-100 opacity-50 transition-opacity" />
              <Wand2 size={14} className="relative z-10" />
              <span className="relative z-10 text-xs font-semibold tracking-wide">AI Studio</span>
            </motion.button>
            
            <div className="w-[1px] h-6 bg-zinc-800 mx-2" />
            
            <Button 
              variant="secondary" 
              className="h-8 bg-[#1c1c22] border border-zinc-700 text-zinc-100 hover:bg-[#27272a] hover:text-white text-xs font-medium transition-colors shadow-sm"
              onClick={() => alert("Export coming soon!")}
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export
            </Button>
            
            <div className="flex items-center pl-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full transition-colors">
                    <Bell className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Notifications</TooltipContent>
              </Tooltip>
              
              <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white ml-2 cursor-pointer hover:opacity-90 transition-opacity ring-2 ring-zinc-950 shadow-md">
                AB
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
      
      <ProjectSettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
});

EditorToolbar.displayName = 'EditorToolbar';

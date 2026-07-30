'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, RotateCcw, RotateCw, Upload, Download, 
  Search, Wand2, Bell, MoreVertical 
} from 'lucide-react';
import { cn } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { useEditor } from '@/hooks/use-editor-state';
import { ProjectSettingsDialog } from '../project-settings-dialog';
import { Input } from '@/components/ui/input';

export const EditorToolbar = React.memo(() => {
  const { state, dispatch } = useEditor();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  
  const projectName = state?.project?.name || 'Untitled Project';
  const [title, setTitle] = useState(projectName);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const saveState = state?.saveState || 'saved';
  const undoStackLength = state?.undoStack?.length || 0;
  const redoStackLength = state?.redoStack?.length || 0;

  return (
    <>
      <div className="flex items-center justify-between h-12 bg-zinc-900 border-b border-zinc-800 px-3 flex-shrink-0">
        {/* Left Section */}
        <div className="flex items-center space-x-2">
          <Tooltip content="Back to Projects" position="bottom">
            <Link href="/projects">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-100">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </Tooltip>
          
          <div className="w-[1px] h-6 bg-zinc-800 mx-1" />
          
          <div className="flex items-center group space-x-2 px-2">
            {isEditingTitle ? (
              <Input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => {
                  setIsEditingTitle(false);
                  dispatch({ type: 'SET_PROJECT_NAME', payload: title });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingTitle(false);
                    dispatch({ type: 'SET_PROJECT_NAME', payload: title });
                  }
                }}
                className="h-7 py-1 px-2 w-48 text-sm"
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
                "w-2 h-2 rounded-full",
                saveState === 'saving' ? "bg-yellow-500 animate-pulse" :
                saveState === 'unsaved' ? "bg-yellow-500" : "bg-emerald-500"
              )} />
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                {saveState === 'saving' ? 'Saving...' : 
                 saveState === 'unsaved' ? 'Unsaved' : 'Saved'}
              </span>
            </div>
          </div>
        </div>

        {/* Center Section */}
        <div className="flex items-center justify-center space-x-1 absolute left-1/2 -translate-x-1/2">
          <Tooltip content="Undo (Ctrl+Z)" position="bottom">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-zinc-400"
              disabled={undoStackLength === 0}
              onClick={() => dispatch({ type: 'UNDO' })}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </Tooltip>
          
          <Tooltip content="Redo (Ctrl+Y)" position="bottom">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-zinc-400"
              disabled={redoStackLength === 0}
              onClick={() => dispatch({ type: 'REDO' })}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </Tooltip>

          <div className="w-[1px] h-6 bg-zinc-800 mx-2" />

          <Button variant="ghost" className="h-8 text-zinc-300">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>

          <Button 
            variant="secondary" 
            className="h-8 bg-[#1c1c22] border border-zinc-700 text-zinc-100 hover:bg-[#27272a]"
            onClick={() => alert("Export coming soon!")}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          <Tooltip content="Search (Ctrl+K)" position="bottom">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400">
              <Search className="h-4 w-4" />
            </Button>
          </Tooltip>
          
          <Button variant="primary" className="h-8 bg-gradient-to-r from-violet-600 to-purple-500 text-white font-medium border-0 px-3 hover:opacity-90">
            <Wand2 className="h-3.5 w-3.5 mr-1.5" />
            AI Studio
          </Button>
          
          <div className="w-[1px] h-6 bg-zinc-800 mx-1" />
          
          <Tooltip content="Notifications" position="bottom">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400">
              <Bell className="h-4 w-4" />
            </Button>
          </Tooltip>
          
          <div className="h-7 w-7 rounded-full bg-violet-600 flex items-center justify-center text-xs font-semibold text-white ml-1 cursor-pointer hover:opacity-90 transition-opacity">
            AB
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-zinc-400 ml-1"
            onClick={() => setIsSettingsOpen(true)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ProjectSettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
});

EditorToolbar.displayName = 'EditorToolbar';

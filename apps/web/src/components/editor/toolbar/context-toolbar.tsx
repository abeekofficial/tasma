'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Copy, Trash2, Settings2, MoreHorizontal } from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

export const ContextToolbar = () => {
  const selectedClipIds = useEditorStore(state => state.selectedClipIds);
  const currentTime = useEditorStore(state => state.currentTime);
  const splitClip = useEditorStore(state => state.splitClip);
  const removeSelectedClips = useEditorStore(state => state.removeSelectedClips);
  const duplicateClips = useEditorStore(state => state.duplicateClips);
  const setInspectorTab = useEditorStore(state => state.setInspectorTab);

  // Determine if it should be visible
  const isVisible = selectedClipIds.length > 0;

  const handleSplit = () => {
    // Basic logic: Split the first selected clip at the current playhead time
    if (selectedClipIds.length > 0) {
      splitClip(selectedClipIds[0], currentTime);
    }
  };

  const handleDuplicate = () => {
    duplicateClips(selectedClipIds);
  };

  const handleDelete = () => {
    removeSelectedClips();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-1.5 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-xl"
        >
          <TooltipProvider delayDuration={200}>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleSplit}
                  className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <Scissors size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">Split (Ctrl+K)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleDuplicate}
                  className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <Copy size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">Duplicate (Ctrl+D)</TooltipContent>
            </Tooltip>
            
            <div className="w-px h-5 bg-zinc-800 mx-1" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setInspectorTab('properties')}
                  className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <Settings2 size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">Properties</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleDelete}
                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors ml-1"
                >
                  <Trash2 size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs bg-rose-500/10 text-rose-300 border-rose-500/20">Delete (Backspace)</TooltipContent>
            </Tooltip>

          </TooltipProvider>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

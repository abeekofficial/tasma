'use client';

import React from 'react';
import { cn } from '@/components/ui/button';
import { EditorToolbar } from './toolbar/editor-toolbar';
import { EditorSidebar } from './sidebar/editor-sidebar';
import { StatusBar } from './status-bar';
import { ContextToolbar } from './toolbar/context-toolbar';
import { ShortcutManager } from './shortcuts/shortcut-manager';
import { useEditor } from '@/hooks/use-editor-state';
import { useResizablePanel } from '@/hooks/use-resizable-panel';
import { TimelinePanel } from './timeline/timeline-panel';
import { VideoPreview } from './preview/video-preview';
import { InspectorPanel } from './panels/inspector-panel';
import { LayersPanel } from './panels/layers-panel';

export const EditorLayout = React.memo(() => {
  const { state } = useEditor();
  
  const { width: sidebarWidth, startResize: startSidebarResize } = useResizablePanel({
    min: 200, max: 400, default: 280, storageKey: 'editor-sidebar-width', direction: 'horizontal'
  });
  
  const { width: inspectorWidth, startResize: startInspectorResize } = useResizablePanel({
    min: 250, max: 450, default: 320, storageKey: 'editor-inspector-width', direction: 'horizontal'
  });
  
  const { width: timelineHeight, startResize: startTimelineResize } = useResizablePanel({
    min: 150, max: 500, default: 300, storageKey: 'editor-timeline-height', direction: 'vertical'
  });

  // Ensure state exists before attempting to render panels based on it
  const panels = state?.panels || { sidebar: true, inspector: true, timeline: true, layers: false };

  return (
    <div className="flex h-screen w-full flex-col relative bg-zinc-950 overflow-hidden text-zinc-100">
      <EditorToolbar />
      
      <div className="flex flex-1 overflow-hidden">
        {panels.sidebar && (
          <>
            <div style={{ width: sidebarWidth }} className="flex-shrink-0 flex h-full">
              <EditorSidebar />
            </div>
            <div 
              onMouseDown={startSidebarResize}
              className="w-[1px] h-full bg-zinc-800 cursor-col-resize hover:bg-violet-500 transition-colors duration-200 z-10"
            />
          </>
        )}
        
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <div className="flex flex-1 overflow-hidden min-h-0">
            {panels.layers && (
               <div className="w-64 flex-shrink-0 border-r border-zinc-800 flex flex-col h-full bg-[#18181b]">
                 <LayersPanel />
               </div>
            )}
            
            <div className="flex-1 bg-zinc-900 overflow-hidden min-w-0 relative h-full flex flex-col items-center justify-center p-4">
               <VideoPreview />
            </div>
          </div>
          
          {panels.timeline && (
            <>
              <div 
                onMouseDown={startTimelineResize}
                className="h-[1px] w-full bg-zinc-800 cursor-row-resize hover:bg-violet-500 transition-colors duration-200 z-10"
              />
              <div style={{ height: timelineHeight }} className="flex-shrink-0 w-full overflow-hidden bg-zinc-900 border-t border-zinc-800">
                <TimelinePanel />
              </div>
            </>
          )}
        </div>
        
        {panels.inspector && (
          <>
            <div 
              onMouseDown={startInspectorResize}
              className="w-[1px] h-full bg-zinc-800 cursor-col-resize hover:bg-violet-500 transition-colors duration-200 z-10"
            />
            <div style={{ width: inspectorWidth }} className="flex-shrink-0 h-full overflow-hidden bg-[#1c1c22]/80 backdrop-blur-xl">
               <InspectorPanel />
            </div>
          </>
        )}
      </div>
      
      <ContextToolbar />
      <ShortcutManager />
      <StatusBar />
    </div>
  );
});

EditorLayout.displayName = 'EditorLayout';

'use client';

import React, { useCallback, useMemo } from 'react';
import { cn } from '@/components/ui/button';
import { 
  Image as ImageIcon, LayoutTemplate, Package, Film, 
  Music, Image as ImagePlaceholder, Video, Upload, 
  History, Trash2, Search
} from 'lucide-react';
import { useEditor } from '@/hooks/use-editor-state';
import { Tooltip } from '@/components/ui/tooltip';
import { MediaPanel } from '../panels/media-panel';
import { Input } from '@/components/ui/input';

const TABS = [
  { id: 'media', icon: ImageIcon, label: 'Media' },
  { id: 'templates', icon: LayoutTemplate, label: 'Templates' },
  { id: 'assets', icon: Package, label: 'Assets' },
  { id: 'scenes', icon: Film, label: 'Scenes' },
  { id: 'audio', icon: Music, label: 'Audio' },
  { id: 'images', icon: ImagePlaceholder, label: 'Images' },
  { id: 'videos', icon: Video, label: 'Videos' },
  { id: 'uploads', icon: Upload, label: 'Uploads' },
];

const BOTTOM_TABS = [
  { id: 'history', icon: History, label: 'History' },
  { id: 'trash', icon: Trash2, label: 'Trash' },
];

export const EditorSidebar = React.memo(() => {
  const { state, dispatch } = useEditor();
  const activeTab = state?.activeSidebarTab || 'media';

  const setTab = useCallback((tabId: string) => {
    dispatch({ type: 'SET_SIDEBAR_TAB', payload: tabId });
  }, [dispatch]);

  const activeTabLabel = useMemo(() => {
    return [...TABS, ...BOTTOM_TABS].find(t => t.id === activeTab)?.label || 'Media';
  }, [activeTab]);

  return (
    <div className="flex h-full w-full bg-zinc-900 border-r border-zinc-800">
      {/* Icon Strip */}
      <div className="w-12 flex-shrink-0 flex flex-col items-center py-3 bg-zinc-950 border-r border-zinc-800 z-10">
        <div className="flex flex-col space-y-2 flex-1 w-full items-center">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Tooltip key={tab.id} content={tab.label} position="right">
                <button
                  onClick={() => setTab(tab.id)}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center transition-all duration-200",
                    isActive 
                      ? "text-violet-400 bg-violet-500/10 rounded-lg" 
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </button>
              </Tooltip>
            );
          })}
        </div>
        
        <div className="flex flex-col space-y-2 mt-auto pt-4 pb-2 border-t border-zinc-800/50 w-full items-center">
          {BOTTOM_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Tooltip key={tab.id} content={tab.label} position="right">
                <button
                  onClick={() => setTab(tab.id)}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center transition-all duration-200",
                    isActive 
                      ? "text-violet-400 bg-violet-500/10 rounded-lg" 
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </button>
              </Tooltip>
            );
          })}
        </div>
      </div>
      
      {/* Content Panel */}
      <div className="flex-1 flex flex-col bg-[#1c1c22]/80 backdrop-blur-xl min-w-0">
        <div className="h-12 border-b border-zinc-800 px-4 flex items-center flex-shrink-0">
          <h2 className="text-sm font-semibold text-zinc-100 flex-1">{activeTabLabel}</h2>
        </div>
        
        <div className="p-3 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder={`Search ${activeTabLabel.toLowerCase()}...`}
              className="pl-9 h-8 bg-zinc-900 border-zinc-800 text-sm focus:border-violet-500 transition-all duration-200"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <MediaPanel />
        </div>
      </div>
    </div>
  );
});

EditorSidebar.displayName = 'EditorSidebar';

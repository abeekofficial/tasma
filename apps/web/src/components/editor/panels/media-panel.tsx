'use client';

import React, { useState } from 'react';
import { Search, LayoutGrid, List, Upload, FileVideo, FileAudio, FileImage } from 'lucide-react';
import { cn } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

// Mock data
const mockMedia = [
  { id: '1', name: 'drone_footage.mp4', type: 'video', size: '45 MB', date: '2 mins ago', duration: '0:15' },
  { id: '2', name: 'background_music.mp3', type: 'audio', size: '3.2 MB', date: '1 hr ago', duration: '2:30' },
  { id: '3', name: 'logo_transparent.png', type: 'image', size: '1.1 MB', date: 'Yesterday', duration: null },
  { id: '4', name: 'interview_cam1.mp4', type: 'video', size: '120 MB', date: 'Yesterday', duration: '5:42' },
];

export function MediaPanel() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <FileVideo className="w-4 h-4 text-blue-400" />;
      case 'audio': return <FileAudio className="w-4 h-4 text-emerald-400" />;
      case 'image': return <FileImage className="w-4 h-4 text-purple-400" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1c1c22]/80 backdrop-blur-xl border-r border-zinc-800">
      {/* Header */}
      <div className="p-3 border-b border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-300">Project Media</h2>
          <Button variant="ghost" size="sm" className="h-7 px-2 bg-violet-600/10 text-violet-400 hover:bg-violet-600/20 hover:text-violet-300">
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-xs">Upload</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <Input 
              placeholder="Search media..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-7 pl-8 pr-3 text-xs bg-zinc-900/50 border-zinc-800 focus:border-violet-500/50 rounded-md"
            />
          </div>
          <div className="flex items-center bg-zinc-900/80 rounded-md p-0.5 border border-zinc-800">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-1 rounded-sm transition-colors", viewMode === 'grid' ? "bg-zinc-700/50 text-zinc-200" : "text-zinc-500 hover:text-zinc-300")}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-1 rounded-sm transition-colors", viewMode === 'list' ? "bg-zinc-700/50 text-zinc-200" : "text-zinc-500 hover:text-zinc-300")}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 hidden-scrollbar">
        {mockMedia.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 border-dashed">
              <Upload className="w-6 h-6 text-zinc-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300 mb-1">No media yet</p>
              <p className="text-xs text-zinc-500 max-w-[200px]">Upload files or drag them here to start editing.</p>
            </div>
            <Button size="sm" className="bg-zinc-800 hover:bg-zinc-700">Browse Files</Button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-3">
            {mockMedia.map(item => (
              <div key={item.id} className="group cursor-pointer">
                <div className="aspect-square rounded-lg bg-zinc-900 border border-zinc-800/50 overflow-hidden relative mb-1.5 group-hover:ring-2 ring-violet-500/50 transition-all">
                  {/* Thumbnail placeholder */}
                  <div className={cn(
                    "w-full h-full opacity-20",
                    item.type === 'video' ? "bg-gradient-to-br from-blue-500 to-cyan-500" :
                    item.type === 'audio' ? "bg-gradient-to-br from-emerald-500 to-green-500" :
                    "bg-gradient-to-br from-purple-500 to-pink-500"
                  )} />
                  <div className="absolute top-2 left-2 bg-zinc-950/80 backdrop-blur-sm p-1 rounded-md border border-white/5">
                    {getIcon(item.type)}
                  </div>
                  {item.duration && (
                    <div className="absolute bottom-2 right-2 bg-zinc-950/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] text-zinc-300 border border-white/5 font-mono">
                      {item.duration}
                    </div>
                  )}
                </div>
                <p className="text-[11px] font-medium text-zinc-300 truncate w-full group-hover:text-violet-300 transition-colors">{item.name}</p>
                <p className="text-[10px] text-zinc-500">{item.size}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {mockMedia.map(item => (
              <div key={item.id} className="flex items-center p-2 rounded-md hover:bg-zinc-800/50 cursor-pointer group transition-colors">
                <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center mr-3 shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-zinc-300 truncate group-hover:text-violet-300 transition-colors">{item.name}</p>
                  <p className="text-[10px] text-zinc-500">{item.size} • {item.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Storage Footer */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] font-medium text-zinc-400">Storage</span>
          <span className="text-[10px] text-zinc-500">4.2 GB / 50 GB used</span>
        </div>
        <Progress value={8.4} className="h-1.5" />
      </div>
    </div>
  );
}

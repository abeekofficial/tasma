'use client';

import React, { useState } from 'react';
import { Search, Folder, File as FileIcon, Image as ImageIcon, Video, Music, Type, SortAsc, Trash2, MoveRight, Upload } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UploadZone } from '@/components/media/upload-zone';

const MOCK_MEDIA = [
  { id: '1', name: 'background-loop.mp4', type: 'video', size: '12.5 MB', date: 'Oct 24, 2023', thumbnail: 'bg-blue-500/20 text-blue-400' },
  { id: '2', name: 'epic-whoosh.wav', type: 'audio', size: '1.2 MB', date: 'Oct 23, 2023', thumbnail: 'bg-emerald-500/20 text-emerald-400' },
  { id: '3', name: 'logo-transparent.png', type: 'image', size: '450 KB', date: 'Oct 20, 2023', thumbnail: 'bg-pink-500/20 text-pink-400' },
  { id: '4', name: 'Inter-Bold.ttf', type: 'font', size: '800 KB', date: 'Oct 15, 2023', thumbnail: 'bg-zinc-500/20 text-zinc-400' },
];

export default function MediaLibraryPage() {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showUpload, setShowUpload] = useState(false);

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const selectAll = () => {
    if (selectedIds.size === MOCK_MEDIA.length) {
      setSelectedIds(newSet => new Set());
    } else {
      setSelectedIds(new Set(MOCK_MEDIA.map(m => m.id)));
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-6 h-6" />;
      case 'audio': return <Music className="w-6 h-6" />;
      case 'image': return <ImageIcon className="w-6 h-6" />;
      case 'font': return <Type className="w-6 h-6" />;
      default: return <FileIcon className="w-6 h-6" />;
    }
  };

  return (
    <div className="flex h-full animate-fade-in overflow-hidden -m-4 sm:-m-8">
      {/* Sidebar Folders */}
      <div className="w-64 border-r border-zinc-800 bg-zinc-950/50 p-4 hidden md:flex flex-col">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Folders</h2>
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 text-zinc-100 text-sm font-medium">
              <Folder className="w-4 h-4 text-violet-400" fill="currentColor" />
              All Media
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 text-sm transition-colors">
              <Folder className="w-4 h-4" />
              Project Assets
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 text-sm transition-colors">
              <Folder className="w-4 h-4" />
              Brand Kit
            </button>
          </nav>
        </div>
        <Button variant="outline" size="sm" className="mt-auto w-full border-dashed border-zinc-700">
          <Plus className="w-4 h-4 mr-2" /> New Folder
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 sm:p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Media Library</h1>
            <p className="text-sm text-zinc-400">Manage your assets, videos, and fonts.</p>
          </div>
          <Button onClick={() => setShowUpload(!showUpload)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Assets
          </Button>
        </div>

        {showUpload && (
          <div className="mb-8 animate-scale-in">
            <UploadZone 
              onUpload={(files) => console.log('Uploading:', files)} 
              maxSize={50 * 1024 * 1024} 
            />
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input 
              placeholder="Search files..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full sm:max-w-md bg-zinc-900/50"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="bg-zinc-900/50">
              <SortAsc className="w-4 h-4 mr-2" /> Sort
            </Button>
          </div>
        </div>

        {selectedIds.size > 0 && (
          <div className="mb-4 p-3 glass rounded-lg border border-violet-500/30 flex items-center justify-between animate-fade-in">
            <span className="text-sm font-medium text-violet-200">
              {selectedIds.size} item{selectedIds.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="bg-zinc-800 hover:bg-zinc-700">
                <MoveRight className="w-4 h-4 mr-2" /> Move
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </div>
          </div>
        )}

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {MOCK_MEDIA.map(media => (
                <div 
                  key={media.id} 
                  className={`relative group rounded-xl border p-3 cursor-pointer transition-all ${
                    selectedIds.has(media.id) 
                      ? 'bg-violet-500/10 border-violet-500 shadow-[0_0_0_1px_rgba(139,92,246,1)]' 
                      : 'glass border-zinc-800/60 hover:border-zinc-700'
                  }`}
                  onClick={() => toggleSelect(media.id)}
                >
                  <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedIds.has(media.id) ? 'bg-violet-500 border-violet-500 opacity-100' : 'border-zinc-500 bg-black/50'}`}>
                      {selectedIds.has(media.id) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </div>
                  
                  <div className={`h-24 rounded-lg mb-3 flex items-center justify-center ${media.thumbnail}`}>
                    {getIconForType(media.type)}
                  </div>
                  
                  <h4 className="text-sm font-medium text-zinc-200 truncate" title={media.name}>{media.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-zinc-500 uppercase">{media.type}</span>
                    <span className="text-xs text-zinc-500">{media.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          {/* Other tab contents would be filtered similarly */}
        </Tabs>
      </div>
    </div>
  );
}

// Inline Plus icon since it wasn't imported from lucide-react at the top to save space
function Plus(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
}

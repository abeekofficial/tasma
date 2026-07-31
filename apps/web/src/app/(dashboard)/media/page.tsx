'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { FolderSidebar } from '@/components/media/folder-sidebar';
import { MediaToolbar } from '@/components/media/media-toolbar';
import { MediaCard } from '@/components/media/media-card';
import { UploadQueuePanel } from '@/components/media/upload-queue-panel';
import { MediaPreviewModal } from '@/components/media/media-preview-modal';
import { SelectionToolbar } from '@/components/media/selection-toolbar';

export type MediaType = 'video' | 'image' | 'audio' | 'document';

export interface MediaItem {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  size: number; // bytes
  createdAt: string;
  duration?: number; // seconds
  resolution?: string;
  codec?: string;
}

const MOCK_MEDIA: MediaItem[] = [
  {
    id: 'm-101',
    name: 'hero-background-loop.mp4',
    type: 'video',
    url: '/assets/hero-background-loop.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop',
    size: 24500000,
    createdAt: '2026-07-20T14:30:00Z',
    duration: 15.4,
    resolution: '3840x2160',
    codec: 'H.264',
  },
  {
    id: 'm-102',
    name: 'brand-logo-light.svg',
    type: 'image',
    url: '/assets/brand-logo-light.svg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop',
    size: 45000,
    createdAt: '2026-07-21T09:15:00Z',
    resolution: '800x800',
  },
  {
    id: 'm-103',
    name: 'podcast-intro-season3.wav',
    type: 'audio',
    url: '/assets/podcast-intro-season3.wav',
    size: 14200000,
    createdAt: '2026-07-22T11:45:00Z',
    duration: 45.2,
    codec: 'PCM (Lossless)',
  },
  {
    id: 'm-104',
    name: 'product-demo-v2-final.webm',
    type: 'video',
    url: '/assets/product-demo-v2-final.webm',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
    size: 85600000,
    createdAt: '2026-07-25T16:20:00Z',
    duration: 124.8,
    resolution: '3840x2160',
    codec: 'VP9',
  },
  {
    id: 'm-105',
    name: 'team-retreat-2026.jpg',
    type: 'image',
    url: '/assets/team-retreat-2026.jpg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
    size: 4200000,
    createdAt: '2026-07-28T10:05:00Z',
    resolution: '6000x4000',
  },
  {
    id: 'm-106',
    name: 'b-roll-cityscape.mov',
    type: 'video',
    url: '/assets/b-roll-cityscape.mov',
    thumbnailUrl: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=600&auto=format&fit=crop',
    size: 450000000,
    createdAt: '2026-07-29T08:30:00Z',
    duration: 32.5,
    resolution: '3840x2160',
    codec: 'ProRes 422',
  },
  {
    id: 'm-107',
    name: 'app-notification-chime.mp3',
    type: 'audio',
    url: '/assets/app-notification-chime.mp3',
    size: 150000,
    createdAt: '2026-07-29T14:10:00Z',
    duration: 1.2,
    codec: 'MP3 320kbps',
  },
  {
    id: 'm-108',
    name: 'brand-guidelines-q3.pdf',
    type: 'document',
    url: '/assets/brand-guidelines-q3.pdf',
    size: 12400000,
    createdAt: '2026-07-30T09:00:00Z',
  },
  {
    id: 'm-109',
    name: 'social-banner-summer-campaign.png',
    type: 'image',
    url: '/assets/social-banner-summer-campaign.png',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
    size: 2100000,
    createdAt: '2026-07-30T11:25:00Z',
    resolution: '1200x630',
  },
  {
    id: 'm-110',
    name: 'founder-interview-raw-camA.mp4',
    type: 'video',
    url: '/assets/founder-interview-raw-camA.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600&auto=format&fit=crop',
    size: 1250000000,
    createdAt: '2026-07-30T15:45:00Z',
    duration: 1845.0,
    resolution: '1920x1080',
    codec: 'H.264',
  },
  {
    id: 'm-111',
    name: 'dashboard-ui-screenshot-dark.png',
    type: 'image',
    url: '/assets/dashboard-ui-screenshot-dark.png',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
    size: 3800000,
    createdAt: '2026-07-31T08:15:00Z',
    resolution: '2880x1800',
  },
  {
    id: 'm-112',
    name: 'ambient-background-music.m4a',
    type: 'audio',
    url: '/assets/ambient-background-music.m4a',
    size: 6500000,
    createdAt: '2026-07-31T09:30:00Z',
    duration: 185.6,
    codec: 'AAC 256kbps',
  }
];

export default function MediaLibraryPage() {
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previewMediaId, setPreviewMediaId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState('all');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    // Future: handle files from e.dataTransfer.files
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedMediaIds(prev => 
      prev.includes(id) ? prev.filter(mediaId => mediaId !== id) : [...prev, id]
    );
  }, []);

  const clearSelection = useCallback(() => setSelectedMediaIds([]), []);

  const filteredMedia = MOCK_MEDIA.filter(media => 
    media.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const previewMedia = previewMediaId 
    ? MOCK_MEDIA.find(m => m.id === previewMediaId) 
    : null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-blue-500/30">
      <FolderSidebar 
        activeFolder={activeFolder}
        onFolderSelect={setActiveFolder}
      />

      <main 
        className="flex-1 flex flex-col relative min-w-0 bg-zinc-50/50 dark:bg-zinc-950/50"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <AnimatePresence>
          {isDragging && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-4 z-50 rounded-3xl border-2 border-dashed border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 backdrop-blur-[2px] flex items-center justify-center pointer-events-none"
            >
              <div className="text-blue-600 dark:text-blue-400 font-medium text-lg flex items-center gap-3 shadow-lg bg-white/90 dark:bg-zinc-900/90 px-8 py-4 rounded-full backdrop-blur-md border border-blue-500/20">
                <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Drop files to upload
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <MediaToolbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onUploadClick={() => {/* trigger upload */}}
        />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          {filteredMedia.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400 space-y-4">
              <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>No media files found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 pb-24">
              {filteredMedia.map(media => (
                <MediaCard 
                  key={media.id}
                  media={media}
                  isSelected={selectedMediaIds.includes(media.id)}
                  onSelect={() => toggleSelect(media.id)}
                  onPreview={() => setPreviewMediaId(media.id)}
                />
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {selectedMediaIds.length > 0 && (
            <SelectionToolbar 
              selectedCount={selectedMediaIds.length}
              onClear={clearSelection}
              onDelete={() => {
                // handle delete
                clearSelection();
              }}
              onMove={() => {
                // handle move
              }}
            />
          )}
        </AnimatePresence>
      </main>

      <UploadQueuePanel />
      
      {previewMedia && (
        <MediaPreviewModal 
          media={previewMedia}
          onClose={() => setPreviewMediaId(null)}
        />
      )}
    </div>
  );
}

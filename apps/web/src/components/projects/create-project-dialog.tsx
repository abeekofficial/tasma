'use client';

import React, { useState } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useApi } from '@/hooks/use-api';
// Assuming useToast exists or just console logging for now if not
import { Youtube, Instagram, MonitorPlay, Smartphone } from 'lucide-react';

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLATFORMS = [
  { id: 'YOUTUBE_SHORTS', name: 'YouTube Shorts', icon: <Youtube className="w-6 h-6 text-red-500" />, ratio: '9:16' },
  { id: 'TIKTOK', name: 'TikTok', icon: <Smartphone className="w-6 h-6 text-cyan-400" />, ratio: '9:16' },
  { id: 'INSTAGRAM_REELS', name: 'Instagram Reels', icon: <Instagram className="w-6 h-6 text-pink-500" />, ratio: '9:16' },
  { id: 'FACEBOOK_REELS', name: 'Facebook Reels', icon: <MonitorPlay className="w-6 h-6 text-blue-500" />, ratio: '9:16' },
];

export function CreateProjectDialog({ isOpen, onClose }: CreateProjectDialogProps) {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('YOUTUBE_SHORTS');
  const [resolution, setResolution] = useState('1080p');
  const [fps, setFps] = useState('30');
  
  const { request, loading } = useApi();

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      const response = await request({
        url: '/api/v1/projects',
        method: 'POST',
        body: {
          name,
          platform,
          settings: { resolution, fps: parseInt(fps) }
        }
      });
      
      // Success handling - would redirect to editor in real app
      console.log('Created:', response);
      onClose();
      // Reset form
      setName('');
      setPlatform('YOUTUBE_SHORTS');
      
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogHeader>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogDescription>
          Start a new AI video project. Choose your target platform to automatically set the best dimensions.
        </DialogDescription>
        <DialogClose onClick={onClose} />
      </DialogHeader>

      <div className="space-y-6 py-4">
        <Input
          label="Project Name"
          placeholder="e.g. Top 10 Tech Gadgets"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <div>
          <label className="text-sm font-medium text-zinc-300 mb-3 block">Target Platform</label>
          <div className="grid grid-cols-2 gap-3">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(p.id)}
                className={`
                  flex flex-col items-center justify-center p-4 rounded-xl border transition-all
                  ${platform === p.id 
                    ? 'border-violet-500 bg-violet-500/10 shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                    : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-800'}
                `}
              >
                <div className="mb-2">{p.icon}</div>
                <span className="text-sm font-medium text-zinc-200">{p.name}</span>
                <span className="text-xs text-zinc-500 mt-1">{p.ratio}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Resolution"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            options={[
              { value: '720p', label: '720p (HD)' },
              { value: '1080p', label: '1080p (FHD)' },
              { value: '1440p', label: '1440p (2K)' },
              { value: '4K', label: '4K (UHD)' },
            ]}
          />
          <Select
            label="Frame Rate"
            value={fps}
            onChange={(e) => setFps(e.target.value)}
            options={[
              { value: '24', label: '24 FPS (Cinematic)' },
              { value: '30', label: '30 FPS (Standard)' },
              { value: '60', label: '60 FPS (Smooth)' },
            ]}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleCreate} disabled={!name.trim() || loading} className="min-w-[120px]">
          {loading ? 'Creating...' : 'Create Project'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

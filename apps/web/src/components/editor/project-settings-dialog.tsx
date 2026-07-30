'use client';

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useEditor } from '@/hooks/use-editor-state';
import { cn } from '@/components/ui/button';

interface ProjectSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectSettingsDialog({ open, onOpenChange }: ProjectSettingsDialogProps) {
  const { state, dispatch } = useEditor();
  
  // Local state for settings form
  const [resolution, setResolution] = useState(state?.project?.settings?.resolution || '1080p');
  const [fps, setFps] = useState(state?.project?.settings?.fps?.toString() || '30');
  const [aspectRatio, setAspectRatio] = useState(state?.project?.settings?.aspectRatio || '9:16');
  const [duration, setDuration] = useState(state?.project?.duration?.toString() || '60');
  const [bgColor, setBgColor] = useState(state?.project?.settings?.backgroundColor || '#000000');
  const [autosave, setAutosave] = useState(true);
  const [autosaveInterval, setAutosaveInterval] = useState('60');

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_PROJECT_SETTINGS',
      payload: {
        resolution,
        fps: parseInt(fps, 10),
        aspectRatio,
        duration: parseInt(duration, 10),
        backgroundColor: bgColor,
        autosave,
        autosaveInterval: parseInt(autosaveInterval, 10)
      }
    });
    onOpenChange(false);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
      title="Project Settings"
      description="Configure your video project's fundamental properties."
    >
      <div className="space-y-5 py-2 text-zinc-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400">Resolution</label>
            <Select 
              value={resolution} 
              onChange={setResolution}
              options={[
                { value: '720p', label: '720p (HD)' },
                { value: '1080p', label: '1080p (FHD)' },
                { value: '1440p', label: '1440p (QHD)' },
                { value: '4K', label: '4K (UHD)' },
              ]}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400">Frame Rate</label>
            <Select 
              value={fps} 
              onChange={setFps}
              options={[
                { value: '24', label: '24 fps (Cinematic)' },
                { value: '30', label: '30 fps (Standard)' },
                { value: '60', label: '60 fps (Smooth)' },
              ]}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-400">Aspect Ratio</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '9:16', label: 'Portrait', sub: '9:16' },
              { id: '16:9', label: 'Landscape', sub: '16:9' },
              { id: '1:1', label: 'Square', sub: '1:1' },
            ].map(ratio => (
              <button
                key={ratio.id}
                onClick={() => setAspectRatio(ratio.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200",
                  aspectRatio === ratio.id 
                    ? "bg-violet-500/10 border-violet-500/30 text-violet-400" 
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
                )}
              >
                <span className="text-sm font-medium">{ratio.label}</span>
                <span className="text-[10px] opacity-70">{ratio.sub}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400">Duration (seconds)</label>
            <Input 
              type="number" 
              value={duration} 
              onChange={(e) => setDuration(e.target.value)}
              className="bg-zinc-900 border-zinc-800 focus:border-violet-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400">Background Color</label>
            <div className="flex space-x-2">
              <div 
                className="w-10 h-10 rounded border border-zinc-700 flex-shrink-0"
                style={{ backgroundColor: bgColor }}
              />
              <Input 
                value={bgColor} 
                onChange={(e) => setBgColor(e.target.value)}
                className="bg-zinc-900 border-zinc-800 focus:border-violet-500 uppercase font-mono"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">Auto-save</label>
            <button 
              onClick={() => setAutosave(!autosave)}
              className={cn(
                "relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200",
                autosave ? "bg-violet-600" : "bg-zinc-700"
              )}
            >
              <span 
                className={cn(
                  "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200",
                  autosave ? "translate-x-5" : "translate-x-1"
                )} 
              />
            </button>
          </div>
          
          {autosave && (
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
              <span className="text-xs text-zinc-500">Interval</span>
              <Select 
                value={autosaveInterval} 
                onChange={setAutosaveInterval}
                options={[
                  { value: '15', label: '15s' },
                  { value: '30', label: '30s' },
                  { value: '60', label: '60s' },
                  { value: '120', label: '120s' },
                ]}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 mt-2 border-t border-zinc-800">
        <Button variant="ghost" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} className="bg-gradient-to-r from-violet-600 to-purple-500">
          Save Changes
        </Button>
      </div>
    </Dialog>
  );
}

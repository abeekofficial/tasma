'use client';

import React from 'react';
import { ChevronDown, ChevronRight, Eye, EyeOff, Lock, Unlock, GripVertical, Layers as LayersIcon, Film, Music, Type, Image as ImageIcon, Sparkles, Captions } from 'lucide-react';
import { cn } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { useEditor } from '@/hooks/use-editor-state';

export function LayersPanel() {
  const { state, dispatch } = useEditor();

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return Film;
      case 'audio': return Music;
      case 'text': return Type;
      case 'image': return ImageIcon;
      case 'effect': return Sparkles;
      case 'subtitle': return Captions;
      default: return LayersIcon;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-500';
      case 'audio': return 'bg-emerald-500';
      case 'text': return 'bg-amber-500';
      case 'image': return 'bg-purple-500';
      case 'subtitle': return 'bg-cyan-500';
      case 'shape': return 'bg-rose-500';
      default: return 'bg-zinc-500';
    }
  };

  if (state.tracks.length === 0) {
    return (
      <div className="flex flex-col h-full bg-[#1c1c22]/80 backdrop-blur-xl border-r border-zinc-800">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-300">Layers</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <LayersIcon className="w-10 h-10 text-zinc-700 mb-3" />
          <p className="text-sm text-zinc-400 mb-1">No layers</p>
          <p className="text-xs text-zinc-500">Add a track to the timeline to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#1c1c22]/80 backdrop-blur-xl border-r border-zinc-800">
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h2 className="text-sm font-medium text-zinc-300">Layers</h2>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {state.tracks.map((track) => {
          const TrackIcon = getIcon(track.type);
          const isSelected = state.selectedTrackId === track.id;
          
          return (
            <div key={track.id} className="mb-1">
              {/* Track Node */}
              <div 
                className={cn(
                  "flex items-center px-2 py-1.5 group cursor-pointer transition-colors hover:bg-[#27272a]/80",
                  isSelected && "bg-violet-500/10 text-violet-400"
                )}
                onClick={() => dispatch({ type: 'SELECT_TRACK', payload: { trackId: track.id } })}
              >
                <GripVertical className="w-3.5 h-3.5 text-zinc-600 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 mr-1.5" />
                <TrackIcon className="w-3.5 h-3.5 text-zinc-400 mr-2" />
                <span className="text-xs font-medium truncate flex-1 text-zinc-200">{track.name}</span>
                
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="w-5 h-5 p-0">
                    {track.isVisible ? <Eye className="w-3 h-3 text-zinc-400" /> : <EyeOff className="w-3 h-3 text-zinc-500" />}
                  </Button>
                  <Button variant="ghost" size="sm" className="w-5 h-5 p-0">
                    {track.isLocked ? <Lock className="w-3 h-3 text-zinc-500" /> : <Unlock className="w-3 h-3 text-zinc-400" />}
                  </Button>
                </div>
              </div>

              {/* Clip Leaf Nodes */}
              <div className="pl-9 pr-2 border-l border-zinc-800/50 ml-4 py-1 space-y-0.5">
                {track.clips.map(clip => {
                   const isClipSelected = state.selectedClipIds?.includes(clip.id);
                   return (
                    <div 
                      key={clip.id}
                      className={cn(
                        "flex items-center py-1 px-2 rounded-md group cursor-pointer transition-colors hover:bg-[#27272a]/80",
                        isClipSelected && "bg-violet-500/10 text-violet-400"
                      )}
                      onClick={() => dispatch({ type: 'SELECT_CLIPS', payload: { clipIds: [clip.id] } })}
                    >
                      <div className={cn("w-1.5 h-1.5 rounded-full mr-2", getColor(clip.type))} />
                      <span className="text-[11px] truncate flex-1 text-zinc-300">{clip.name}</span>
                      <span className="text-[10px] text-zinc-500 ml-2">{clip.duration.toFixed(1)}s</span>
                    </div>
                   );
                })}
                {track.clips.length === 0 && (
                  <div className="py-1 px-2 text-[10px] text-zinc-600 italic">
                    Empty track
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

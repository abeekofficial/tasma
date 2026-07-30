'use client';

import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { cn } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useEditor } from '@/hooks/use-editor-state';

export function InspectorPanel() {
  const { state, dispatch } = useEditor();
  const [activeTab, setActiveTab] = useState<'properties' | 'transform' | 'style' | 'animation'>('properties');

  const selectedClipId = state.selectedClipIds?.[0];
  let selectedClip = null;
  
  if (selectedClipId) {
    for (const track of state.tracks) {
      const clip = track.clips.find((c: any) => c.id === selectedClipId);
      if (clip) {
        selectedClip = clip;
        break;
      }
    }
  }

  const tabs = [
    { id: 'properties', label: 'Properties' },
    { id: 'transform', label: 'Transform' },
    { id: 'style', label: 'Style' },
    { id: 'animation', label: 'Animation' },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-[#1c1c22]/80 backdrop-blur-xl border-l border-zinc-800">
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h2 className="text-sm font-medium text-zinc-300">Inspector</h2>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-zinc-800">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex border-b border-zinc-800 px-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 px-2 py-2 text-[11px] font-medium transition-colors border-b-2",
              activeTab === tab.id 
                ? "text-violet-400 border-violet-500" 
                : "text-zinc-500 border-transparent hover:text-zinc-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 hidden-scrollbar">
        {!selectedClip ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2">
            <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <span className="text-2xl opacity-20">🎯</span>
            </div>
            <p className="text-xs">No clip selected</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'properties' && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-zinc-400">Name</label>
                    <Badge variant="outline" className="text-[10px] uppercase bg-zinc-900">{selectedClip.type}</Badge>
                  </div>
                  <Input value={selectedClip.name} readOnly className="h-8 text-xs bg-zinc-900 border-zinc-800 focus:border-violet-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500">Start Time</label>
                    <Input value={selectedClip.startTime.toFixed(2) + 's'} readOnly className="h-7 text-xs bg-zinc-900/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500">Duration</label>
                    <Input value={selectedClip.duration.toFixed(2) + 's'} readOnly className="h-7 text-xs bg-zinc-900/50" />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-800/50">
                  <label className="text-xs text-zinc-400 flex justify-between">
                    Speed <span>1.0x</span>
                  </label>
                  <input type="range" min="0.25" max="4" step="0.25" defaultValue="1" className="w-full accent-violet-500 bg-zinc-900 h-1 rounded-lg" />
                </div>

                {(selectedClip.type === 'video' || selectedClip.type === 'audio') && (
                  <div className="space-y-2 pt-2 border-t border-zinc-800/50">
                    <label className="text-xs text-zinc-400 flex justify-between">
                      Volume <span>100%</span>
                    </label>
                    <input type="range" min="0" max="100" defaultValue="100" className="w-full accent-violet-500 bg-zinc-900 h-1 rounded-lg" />
                  </div>
                )}
                
                <div className="space-y-2 pt-2 border-t border-zinc-800/50">
                    <label className="text-xs text-zinc-400 flex justify-between">
                      Opacity <span>100%</span>
                    </label>
                    <input type="range" min="0" max="100" defaultValue="100" className="w-full accent-violet-500 bg-zinc-900 h-1 rounded-lg" />
                  </div>
              </div>
            )}

            {activeTab === 'transform' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400">Position</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-zinc-500 w-3">X</span>
                      <Input defaultValue="0" className="h-7 text-xs bg-zinc-900" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-zinc-500 w-3">Y</span>
                      <Input defaultValue="0" className="h-7 text-xs bg-zinc-900" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400">Size</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-zinc-500 w-3">W</span>
                      <Input defaultValue="1920" className="h-7 text-xs bg-zinc-900" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-zinc-500 w-3">H</span>
                      <Input defaultValue="1080" className="h-7 text-xs bg-zinc-900" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-800/50">
                  <label className="text-xs text-zinc-400">Rotation</label>
                  <div className="flex items-center space-x-2">
                    <input type="range" min="0" max="360" defaultValue="0" className="flex-1 accent-violet-500 bg-zinc-900 h-1 rounded-lg" />
                    <Input defaultValue="0°" className="w-14 h-7 text-xs bg-zinc-900 text-center" />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-800/50">
                  <label className="text-xs text-zinc-400">Scale</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-zinc-500">X</span>
                      <Input defaultValue="1.0" className="h-7 text-xs bg-zinc-900" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-zinc-500">Y</span>
                      <Input defaultValue="1.0" className="h-7 text-xs bg-zinc-900" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'style' && (
              <div className="space-y-4 animate-fade-in">
                 <div className="space-y-2">
                  <label className="text-xs text-zinc-400 flex justify-between">
                    Corner Radius <span>0px</span>
                  </label>
                  <input type="range" min="0" max="100" defaultValue="0" className="w-full accent-violet-500 bg-zinc-900 h-1 rounded-lg" />
                </div>
                
                {selectedClip.type === 'text' && (
                  <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400">Font</label>
                      <select className="w-full h-8 px-2 text-xs bg-zinc-900 border border-zinc-800 rounded-md outline-none focus:border-violet-500">
                        <option>Inter</option>
                        <option>Roboto</option>
                        <option>Open Sans</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500">Weight</label>
                        <select className="w-full h-7 px-1 text-xs bg-zinc-900 border border-zinc-800 rounded-md outline-none">
                          <option>Regular</option>
                          <option>Bold</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500">Size</label>
                        <Input defaultValue="48" className="h-7 text-xs bg-zinc-900" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'animation' && (
              <div className="flex flex-col items-center justify-center h-40 bg-violet-500/5 border border-violet-500/20 rounded-xl p-4 text-center animate-fade-in">
                <Sparkles className="w-8 h-8 text-violet-400 mb-3 opacity-50" />
                <h3 className="text-sm font-medium text-violet-300 mb-1">Coming Soon</h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Animation keyframes will be available in a future update.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

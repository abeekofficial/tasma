"use client";

import React from "react";
import { Eye, Lock, Volume2, Mic, Subtitles, Layers } from "lucide-react";

const MOCK_TRACKS = [
  { id: 'v3', type: 'overlay', name: 'Adjustment Layer 1', color: 'bg-pink-500' },
  { id: 'v2', type: 'subtitle', name: 'Captions', color: 'bg-yellow-500' },
  { id: 'v1', type: 'video', name: 'Main Cam', color: 'bg-blue-500' },
  { id: 'a1', type: 'audio', name: 'Dialogue', color: 'bg-emerald-500' },
  { id: 'a2', type: 'audio', name: 'SFX', color: 'bg-emerald-500' },
  { id: 'a3', type: 'audio', name: 'Music', color: 'bg-emerald-500' },
];

export const TrackContainer = () => {
  return (
    <div className="flex flex-col w-full">
      {MOCK_TRACKS.map((track) => (
        <TrackHeader key={track.id} track={track} />
      ))}
    </div>
  );
};

const TrackHeader = ({ track }: { track: typeof MOCK_TRACKS[0] }) => {
  const getIcon = () => {
    switch(track.type) {
      case 'video': return <Layers className="w-3.5 h-3.5" />;
      case 'audio': return <Volume2 className="w-3.5 h-3.5" />;
      case 'subtitle': return <Subtitles className="w-3.5 h-3.5" />;
      case 'overlay': return <Layers className="w-3.5 h-3.5" />;
      default: return null;
    }
  }

  return (
    <div className="h-20 border-b border-zinc-800/40 p-3 flex flex-col justify-between bg-zinc-900 hover:bg-zinc-800/80 transition-colors group shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${track.color}`} />
          <span className="text-xs font-semibold text-zinc-300 group-hover:text-zinc-100 transition-colors">
            {track.id.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
          <button className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-zinc-200 transition-colors">
            <Lock className="w-3 h-3" />
          </button>
          <button className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-zinc-200 transition-colors">
            {track.type === 'audio' ? <Mic className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-[10px] text-zinc-500 truncate flex-1 flex items-center gap-1.5">
          {getIcon()}
          {track.name}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Lock, LockOpen, Eye, EyeOff } from "lucide-react";

interface TrackHeaderProps {
  initialName?: string;
  trackColor?: string;
  isAudio?: boolean;
}

export function TrackHeader({
  initialName = "Video 1",
  trackColor = "#3b82f6",
  isAudio = false,
}: TrackHeaderProps) {
  const [name, setName] = useState(initialName);
  const [isMuted, setIsMuted] = useState(false);
  const [isSolo, setIsSolo] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  return (
    <div className="flex h-24 w-64 flex-none flex-col justify-between border-b border-r border-neutral-800 bg-neutral-900 p-2 text-neutral-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div 
            className="h-3 w-3 rounded-full" 
            style={{ backgroundColor: trackColor }} 
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-32 rounded bg-transparent px-1 py-0.5 text-xs font-semibold text-neutral-200 outline-none transition-colors hover:bg-neutral-800 focus:bg-neutral-800"
          />
        </div>
        
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => setIsHidden(!isHidden)}
            className="rounded p-1 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-300"
            title={isHidden ? "Show Track" : "Hide Track"}
          >
            {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button 
            onClick={() => setIsLocked(!isLocked)}
            className="rounded p-1 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-300"
            title={isLocked ? "Unlock Track" : "Lock Track"}
          >
            {isLocked ? <Lock size={14} /> : <LockOpen size={14} />}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`flex h-6 w-6 items-center justify-center rounded border text-xs font-bold transition-colors ${
            isMuted 
              ? "border-red-900 bg-red-900/50 text-red-500" 
              : "border-neutral-700 bg-neutral-800 text-neutral-500 hover:border-neutral-500 hover:text-neutral-300"
          }`}
          title="Mute Track"
        >
          M
        </button>
        <button
          onClick={() => setIsSolo(!isSolo)}
          className={`flex h-6 w-6 items-center justify-center rounded border text-xs font-bold transition-colors ${
            isSolo 
              ? "border-yellow-900 bg-yellow-900/50 text-yellow-500" 
              : "border-neutral-700 bg-neutral-800 text-neutral-500 hover:border-neutral-500 hover:text-neutral-300"
          }`}
          title="Solo Track"
        >
          S
        </button>
      </div>
    </div>
  );
}

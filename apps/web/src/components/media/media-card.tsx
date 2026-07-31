"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check,
  Video, 
  Image as ImageIcon, 
  Music,
  Cloud,
  CloudUpload,
  CloudOff,
  MoreHorizontal
} from "lucide-react";

export type MediaType = "video" | "image" | "audio";
export type SyncStatus = "synced" | "syncing" | "offline";

export interface MediaCardProps {
  id: string;
  name: string;
  type: MediaType;
  size: string;
  resolution?: string;
  fps?: string;
  codec?: string;
  duration?: string;
  syncStatus: SyncStatus;
  thumbnailUrl?: string;
  selected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

export const MediaCard = ({
  id,
  name,
  type,
  size,
  resolution,
  fps,
  codec,
  duration,
  syncStatus,
  thumbnailUrl,
  selected = false,
  onSelect
}: MediaCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const TypeIcon = {
    video: Video,
    image: ImageIcon,
    audio: Music
  }[type];

  const SyncIcon = {
    synced: Cloud,
    syncing: CloudUpload,
    offline: CloudOff
  }[syncStatus];

  const syncColor = {
    synced: "text-emerald-500",
    syncing: "text-blue-500",
    offline: "text-muted-foreground"
  }[syncStatus];

  const handleSelectToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(id, !selected);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      className={`group relative flex flex-col rounded-xl border ${
        selected ? "border-primary bg-primary/5" : "border-border/40 bg-card hover:border-border"
      } overflow-hidden transition-colors duration-300 shadow-sm hover:shadow-md`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection Indicator */}
      <button
        onClick={handleSelectToggle}
        className={`absolute top-3 left-3 z-20 w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${
          selected 
            ? "bg-primary border-primary opacity-100 shadow-sm" 
            : "bg-black/20 border-white/40 opacity-0 group-hover:opacity-100 backdrop-blur-md"
        }`}
      >
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Check className="w-3.5 h-3.5 text-primary-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Sync Status Badge */}
      <div className="absolute top-3 right-3 z-20 flex items-center justify-center w-6 h-6 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
        <SyncIcon className={`w-3.5 h-3.5 ${syncColor}`} />
      </div>

      {/* Thumbnail Area */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted/30">
        {thumbnailUrl ? (
          <motion.img 
            src={thumbnailUrl} 
            alt={name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered && type === "video" ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/30 flex items-center justify-center">
            <TypeIcon className="w-10 h-10 text-muted-foreground/30" />
          </div>
        )}

        {/* Video Scrubber Simulation Overlay (Linear/Frame.io style) */}
        {type === "video" && isHovered && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        )}
        
        {/* Duration Badge */}
        {duration && (
          <div className="absolute bottom-2 right-2 z-20 px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/60 text-white backdrop-blur-md border border-white/10">
            {duration}
          </div>
        )}
      </div>

      {/* Metadata Area */}
      <div className="p-3 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm text-foreground truncate" title={name}>
            {name}
          </h3>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-md hover:bg-muted text-muted-foreground shrink-0">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Badges */}
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border/50">
            {size}
          </span>
          {resolution && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border/50">
              {resolution}
            </span>
          )}
          {fps && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border/50">
              {fps}
            </span>
          )}
          {codec && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border/50">
              {codec}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

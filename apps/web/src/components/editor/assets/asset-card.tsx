"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Heart, Plus, FileVideo } from "lucide-react";

export interface AssetCardProps {
  id: string;
  title: string;
  type?: "video" | "audio" | "image";
  duration?: string;
  resolution?: string;
  thumbnailUrl?: string;
  onSelect?: (id: string) => void;
  onAdd?: (id: string) => void;
}

export function AssetCard({
  id,
  title,
  type = "video",
  duration = "00:05:23",
  resolution = "4K",
  thumbnailUrl,
  onSelect,
  onAdd,
}: AssetCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <motion.div
      drag
      dragSnapToOrigin
      whileDrag={{ scale: 1.05, zIndex: 50, opacity: 0.8 }}
      className="relative flex flex-col w-40 rounded-md bg-neutral-900 border border-neutral-800 overflow-hidden cursor-grab active:cursor-grabbing hover:border-neutral-700 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(id)}
    >
      {/* Thumbnail Area */}
      <div className="relative h-24 bg-neutral-950 flex items-center justify-center overflow-hidden">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="object-cover w-full h-full opacity-80" />
        ) : (
          <FileVideo className="w-8 h-8 text-neutral-600" strokeWidth={1.5} />
        )}

        {/* Corner Badges */}
        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/60 text-neutral-300 backdrop-blur-sm">
          {resolution}
        </div>
        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/60 text-neutral-300 backdrop-blur-sm">
          {duration}
        </div>

        {/* Hover Overlay Toolbar */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 backdrop-blur-[1px] transition-opacity">
            <button
              className="p-1.5 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Preview logic could go here
              }}
              title="Preview"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
            <button
              className="p-1.5 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onAdd?.(id);
              }}
              title="Add to Timeline"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              className="p-1.5 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              title="Favorite"
            >
              <Heart
                className={`w-3.5 h-3.5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Details Area */}
      <div className="p-2 flex flex-col gap-0.5 bg-neutral-900">
        <span className="text-xs font-medium text-neutral-200 truncate" title={title}>
          {title}
        </span>
        <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
          {type}
        </span>
      </div>
    </motion.div>
  );
}

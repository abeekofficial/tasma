"use client";

import * as React from "react";
import { motion } from "framer-motion";

export type ViewMode = "grid" | "list";

export interface Asset {
  id: string;
  name: string;
  type: string;
  duration?: string;
  size?: string;
  thumbnailUrl?: string;
}

interface AssetGridProps {
  assets: Asset[];
  viewMode: ViewMode;
  onAssetClick?: (asset: Asset) => void;
}

export function AssetGrid({ assets, viewMode, onAssetClick }: AssetGridProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-neutral-900/95">
      <div
        className={`p-3 ${
          viewMode === "grid"
            ? "grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3"
            : "flex flex-col gap-1"
        }`}
      >
        {assets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            viewMode={viewMode}
            onClick={() => onAssetClick?.(asset)}
          />
        ))}
      </div>
    </div>
  );
}

interface AssetCardProps {
  asset: Asset;
  viewMode: ViewMode;
  onClick: () => void;
}

function AssetCard({ asset, viewMode, onClick }: AssetCardProps) {
  if (viewMode === "list") {
    return (
      <div
        onClick={onClick}
        className="flex items-center gap-3 p-1.5 rounded bg-neutral-800/30 hover:bg-neutral-800 cursor-pointer group transition-colors border border-transparent hover:border-neutral-700"
      >
        <div className="w-12 h-8 bg-neutral-950 rounded overflow-hidden relative shrink-0">
          {asset.thumbnailUrl ? (
            <img src={asset.thumbnailUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[10px]">
              {asset.type}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-neutral-200 truncate group-hover:text-white transition-colors">
            {asset.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {asset.duration && (
              <span className="text-[10px] text-neutral-500">{asset.duration}</span>
            )}
            {asset.size && (
              <span className="text-[10px] text-neutral-500">{asset.size}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={onClick}
      className="flex flex-col gap-1.5 cursor-pointer group"
    >
      <div className="relative aspect-video bg-neutral-950 rounded-md overflow-hidden border border-neutral-800 group-hover:border-neutral-600 transition-colors">
        {asset.thumbnailUrl ? (
          <img src={asset.thumbnailUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs">
            {asset.type}
          </div>
        )}
        {asset.duration && (
          <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/70 backdrop-blur text-[10px] text-white rounded">
            {asset.duration}
          </div>
        )}
      </div>
      <p className="text-[11px] text-neutral-300 truncate group-hover:text-white transition-colors px-0.5">
        {asset.name}
      </p>
    </div>
  );
}

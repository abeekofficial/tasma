"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Edit2, Trash2, Download, Share2, Info } from "lucide-react";

export interface AssetDetails {
  id: string;
  title: string;
  fileSize: string;
  codec: string;
  path: string;
  dateAdded: string;
  type: string;
  resolution?: string;
  duration?: string;
}

export interface DetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  asset: AssetDetails | null;
  onRename?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDownload?: (id: string) => void;
  onShare?: (id: string) => void;
}

export function DetailsPanel({
  isOpen,
  onClose,
  asset,
  onRename,
  onDelete,
  onDownload,
  onShare,
}: DetailsPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && asset && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-72 h-full bg-neutral-900 border-l border-neutral-800 flex flex-col shadow-2xl flex-shrink-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-neutral-400" />
              <h3 className="text-sm font-medium text-neutral-200">Asset Details</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Title Section */}
            <div>
              <h4 className="text-sm font-medium text-white break-all mb-1">
                {asset.title}
              </h4>
              <p className="text-xs text-neutral-500 uppercase tracking-wider">
                {asset.type} {asset.resolution && `• ${asset.resolution}`}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 gap-3">
              <MetadataRow label="File Size" value={asset.fileSize} />
              <MetadataRow label="Codec" value={asset.codec} />
              {asset.duration && <MetadataRow label="Duration" value={asset.duration} />}
              <MetadataRow label="Date Added" value={asset.dateAdded} />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">
                  Path
                </span>
                <span className="text-xs text-neutral-300 font-mono bg-neutral-950 p-1.5 rounded border border-neutral-800 break-all">
                  {asset.path}
                </span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-neutral-800 grid grid-cols-2 gap-2">
            <ActionButton
              icon={<Edit2 className="w-3.5 h-3.5" />}
              label="Rename"
              onClick={() => onRename?.(asset.id)}
            />
            <ActionButton
              icon={<Download className="w-3.5 h-3.5" />}
              label="Download"
              onClick={() => onDownload?.(asset.id)}
            />
            <ActionButton
              icon={<Share2 className="w-3.5 h-3.5" />}
              label="Share"
              onClick={() => onShare?.(asset.id)}
            />
            <ActionButton
              icon={<Trash2 className="w-3.5 h-3.5" />}
              label="Delete"
              onClick={() => onDelete?.(asset.id)}
              variant="danger"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MetadataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-xs text-neutral-200">{value}</span>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "default" | "danger";
}) {
  const baseClasses =
    "flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors border";
  const variants = {
    default:
      "bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700 hover:text-white",
    danger:
      "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300",
  };

  return (
    <button className={`${baseClasses} ${variants[variant]}`} onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}

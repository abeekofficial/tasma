"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, Download, Share2, MoreHorizontal, Play, ChevronLeft, ChevronRight } from "lucide-react";

interface MediaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl?: string;
  type?: "video" | "image";
}

export function MediaPreviewModal({
  isOpen,
  onClose,
  mediaUrl,
  type = "video",
}: MediaPreviewModalProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 flex h-[90vh] w-[95vw] max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-2xl"
          >
            {/* Top Bar (Overlay) */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent p-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-white/90">
                  campaign-hero-v2.mp4
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/70 backdrop-blur-md">
                  RAW
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-full bg-black/20 p-2 text-white/70 hover:bg-white/10 hover:text-white backdrop-blur-md transition-colors">
                  <Download className="h-4 w-4" />
                </button>
                <button className="rounded-full bg-black/20 p-2 text-white/70 hover:bg-white/10 hover:text-white backdrop-blur-md transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="rounded-full bg-black/20 p-2 text-white/70 hover:bg-white/10 hover:text-white backdrop-blur-md transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                <div className="h-4 w-px bg-white/20 mx-2" />
                <button
                  onClick={onClose}
                  className="rounded-full bg-black/20 p-2 text-white/70 hover:bg-red-500/80 hover:text-white backdrop-blur-md transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex w-full h-full">
              {/* Media Player / Viewer */}
              <div className="relative flex h-full flex-1 items-center justify-center bg-black">
                {/* Navigation Arrows */}
                <button className="absolute left-4 z-20 rounded-full bg-black/20 p-3 text-white/50 hover:bg-white/10 hover:text-white backdrop-blur-md transition-colors">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button className="absolute right-4 z-20 rounded-full bg-black/20 p-3 text-white/50 hover:bg-white/10 hover:text-white backdrop-blur-md transition-colors">
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Media Placeholder */}
                {type === "video" ? (
                  <div className="group relative flex aspect-video w-full max-w-4xl items-center justify-center overflow-hidden rounded-lg bg-gray-800">
                    <img 
                      src="https://images.unsplash.com/photo-1621619856624-42fd193a0661?q=80&w=2000&auto=format&fit=crop" 
                      alt="Video thumbnail"
                      className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay"
                    />
                    <button className="z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-transform group-hover:scale-110">
                      <Play className="h-8 w-8 ml-1" fill="currentColor" />
                    </button>
                  </div>
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1621619856624-42fd193a0661?q=80&w=2000&auto=format&fit=crop"
                    alt="Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>

              {/* Metadata Inspector Panel */}
              <div className="flex w-80 shrink-0 flex-col border-l border-white/10 bg-gray-900/95 backdrop-blur-xl">
                <div className="flex items-center gap-2 border-b border-white/10 p-4">
                  <Info className="h-5 w-5 text-gray-400" />
                  <h2 className="text-sm font-semibold text-white">Metadata Inspector</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500">File Information</h3>
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <span className="text-gray-400">File Name</span>
                        <span className="truncate text-gray-200" title="campaign-hero-v2.mp4">campaign-hero-v2.mp4</span>
                        
                        <span className="text-gray-400">File Size</span>
                        <span className="text-gray-200">124.5 MB</span>
                        
                        <span className="text-gray-400">Date Added</span>
                        <span className="text-gray-200">Oct 24, 2023</span>
                        
                        <span className="text-gray-400">Uploader</span>
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                          <span className="text-gray-200">Alex R.</span>
                        </div>
                      </div>
                    </div>

                    {/* Media Details */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500">Media Details</h3>
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <span className="text-gray-400">Dimensions</span>
                        <span className="text-gray-200">3840 x 2160 (4K)</span>
                        
                        <span className="text-gray-400">Codec</span>
                        <span className="text-gray-200">H.265 / HEVC</span>
                        
                        <span className="text-gray-400">Frame Rate</span>
                        <span className="text-gray-200">59.94 fps</span>
                        
                        <span className="text-gray-400">Duration</span>
                        <span className="text-gray-200">00:02:14</span>
                        
                        <span className="text-gray-400">Color Space</span>
                        <span className="text-gray-200">Rec. 709</span>
                      </div>
                    </div>

                    {/* EXIF / Camera Data */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500">Camera Data (EXIF)</h3>
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <span className="text-gray-400">Camera</span>
                        <span className="text-gray-200">RED Komodo 6K</span>
                        
                        <span className="text-gray-400">Lens</span>
                        <span className="text-gray-200">Sigma 18-35mm f/1.8</span>
                        
                        <span className="text-gray-400">ISO</span>
                        <span className="text-gray-200">800</span>
                        
                        <span className="text-gray-400">Aperture</span>
                        <span className="text-gray-200">f/2.8</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

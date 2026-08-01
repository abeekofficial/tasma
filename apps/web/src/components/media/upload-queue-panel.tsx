"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minus,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  File,
  Image as ImageIcon,
  Video,
} from "lucide-react";

interface UploadItem {
  id: string;
  name: string;
  type: "image" | "video" | "document";
  progress: number;
  status: "uploading" | "paused" | "completed" | "error";
  size: string;
}

const MOCK_UPLOADS: UploadItem[] = [
  {
    id: "1",
    name: "campaign-hero-v2.mp4",
    type: "video",
    progress: 45,
    status: "uploading",
    size: "124 MB",
  },
  {
    id: "2",
    name: "product-shots-raw.zip",
    type: "document",
    progress: 89,
    status: "paused",
    size: "1.2 GB",
  },
  {
    id: "3",
    name: "social-media-assets.png",
    type: "image",
    progress: 100,
    status: "completed",
    size: "4.2 MB",
  },
  {
    id: "4",
    name: "interview-b-roll.mov",
    type: "video",
    progress: 12,
    status: "error",
    size: "856 MB",
  },
];

export function UploadQueuePanel() {
  const [uploads, setUploads] = useState<UploadItem[]>(MOCK_UPLOADS);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  const totalProgress = Math.round(
    uploads.reduce((acc, curr) => acc + curr.progress, 0) / uploads.length
  );
  const activeCount = uploads.filter(
    (u) => u.status === "uploading" || u.status === "paused"
  ).length;

  const handleAction = (id: string, action: "pause" | "resume" | "retry" | "cancel") => {
    setUploads((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          switch (action) {
            case "pause":
              return { ...item, status: "paused" };
            case "resume":
              return { ...item, status: "uploading" };
            case "retry":
              return { ...item, status: "uploading", progress: 0 };
            case "cancel":
              return { ...item, status: "error" }; // Mock cancellation
          }
        }
        return item;
      })
    );
  };

  const getFileIcon = (type: UploadItem["type"]) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4 text-blue-500" />;
      case "video":
        return <Video className="h-4 w-4 text-purple-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence initial={false}>
        <motion.div
          layout
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-[400px] overflow-hidden rounded-xl border border-gray-200/50 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/60"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200/50 bg-gray-50/50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-gray-200 dark:stroke-gray-800"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-blue-500 transition-all duration-300 ease-in-out"
                    strokeWidth="3"
                    strokeDasharray="100"
                    strokeDashoffset={100 - totalProgress}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[10px] font-medium text-gray-700 dark:text-gray-300">
                  {totalProgress}%
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Uploading {activeCount} item{activeCount !== 1 ? "s" : ""}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {uploads.length - activeCount} completed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-200/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-200/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Upload List */}
          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="max-h-[320px] overflow-y-auto p-2"
              >
                <div className="flex flex-col gap-1">
                  {uploads.map((item) => (
                    <div
                      key={item.id}
                      className="group relative flex flex-col gap-2 rounded-lg p-2.5 transition-colors hover:bg-gray-100/50 dark:hover:bg-white/5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-white/10">
                            {getFileIcon(item.type)}
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              {item.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {item.size}
                            </span>
                          </div>
                        </div>

                        {/* Actions / Status */}
                        <div className="flex shrink-0 items-center gap-2">
                          {item.status === "completed" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : item.status === "error" ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleAction(item.id, "retry")}
                                className="rounded p-1 text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 dark:hover:text-white"
                                title="Retry"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                              </button>
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              {item.status === "uploading" ? (
                                <button
                                  onClick={() => handleAction(item.id, "pause")}
                                  className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
                                >
                                  <Pause className="h-3.5 w-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleAction(item.id, "resume")}
                                  className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
                                >
                                  <Play className="h-3.5 w-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleAction(item.id, "cancel")}
                                className="rounded p-1 text-gray-500 hover:bg-red-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {(item.status === "uploading" || item.status === "paused") && (
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                          <motion.div
                            className={`h-full rounded-full ${
                              item.status === "paused" ? "bg-gray-400" : "bg-blue-500"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

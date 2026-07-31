"use client";

import { motion } from "framer-motion";
import { Play, Edit2, Trash2, Pin, Sparkles, Clock, MonitorPlay } from "lucide-react";
import { useState } from "react";

export interface Project {
  id: string;
  name: string;
  thumbnail: string;
  duration: string;
  fps: number;
  resolution: string;
  aiEnhanced: boolean;
  pinned: boolean;
  lastEdited: string;
  teamAvatars: string[];
}

interface ProjectCardProps {
  project: Project;
  layoutId?: string;
}

export function ProjectCard({ project, layoutId }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layoutId={layoutId}
      className="group relative flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
        <img
          src={project.thumbnail}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 pointer-events-none">
          {project.pinned && (
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10">
              <Pin className="w-3.5 h-3.5 fill-current" />
            </div>
          )}
          {project.aiEnhanced && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">AI Enhanced</span>
            </div>
          )}
        </div>

        <div className="absolute bottom-3 right-3 flex gap-2 pointer-events-none">
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-xs font-medium">
            <Clock className="w-3 h-3" />
            {project.duration}
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-xs font-medium">
            {project.resolution}
          </div>
        </div>

        {/* Hover Toolbar */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center gap-3 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-white text-black shadow-lg hover:shadow-xl transition-shadow"
          >
            <Play className="w-5 h-5 fill-current" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-red-500/10 text-red-400 backdrop-blur-md border border-red-500/20 hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate flex-1">
            {project.name}
          </h3>
          <div className="flex -space-x-2">
            {project.teamAvatars.map((avatar, i) => (
              <img
                key={i}
                src={avatar}
                alt={`Team member ${i + 1}`}
                className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-900 z-10 relative"
                style={{ zIndex: 10 - i }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400">
          <span>Edited {project.lastEdited}</span>
          <span className="mx-2">•</span>
          <span>{project.fps} FPS</span>
        </div>
      </div>
    </motion.div>
  );
}

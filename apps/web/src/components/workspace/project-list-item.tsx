"use client";

import { motion } from "framer-motion";
import { Play, Edit2, Trash2, Pin, Sparkles, Clock, MonitorPlay, MoreHorizontal } from "lucide-react";
import { Project } from "./project-card";

interface ProjectListItemProps {
  project: Project;
  layoutId?: string;
}

export function ProjectListItem({ project, layoutId }: ProjectListItemProps) {
  return (
    <motion.div
      layoutId={layoutId}
      className="group flex items-center gap-4 p-3 pr-4 bg-white dark:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 rounded-xl transition-all duration-200 hover:shadow-sm"
    >
      <div className="relative w-24 h-16 shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-950">
        <img
          src={project.thumbnail}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-5 h-5 text-white fill-current drop-shadow-md" />
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
            {project.name}
          </h3>
          {project.pinned && <Pin className="w-3 h-3 text-zinc-400 fill-current shrink-0" />}
          {project.aiEnhanced && <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />}
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {project.duration}
          </span>
          <span className="flex items-center gap-1">
            <MonitorPlay className="w-3 h-3" />
            {project.resolution}
          </span>
          <span>{project.fps} FPS</span>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end justify-center mr-4">
        <div className="text-xs text-zinc-900 dark:text-zinc-100 font-medium mb-1">
          Last edited
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {project.lastEdited}
        </div>
      </div>

      <div className="hidden md:flex -space-x-2 mr-6">
        {project.teamAvatars.map((avatar, i) => (
          <img
            key={i}
            src={avatar}
            alt={`Team member ${i + 1}`}
            className="w-7 h-7 rounded-full border-2 border-white dark:border-zinc-900 relative"
            style={{ zIndex: 10 - i }}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <Edit2 className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors md:hidden">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

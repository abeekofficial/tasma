"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectToolbar } from '@/components/workspace/project-toolbar';
import { ProjectCard } from '@/components/workspace/project-card';
import { ProjectListItem } from '@/components/workspace/project-list-item';
import { CreateProjectDialog } from '@/components/workspace/create-project-dialog';
import { ContextMenu } from '@/components/workspace/context-menu';

// Mock data
export type Project = {
  id: string;
  title: string;
  duration: string;
  fps: number;
  resolution: string;
  isAi: boolean;
  isPinned: boolean;
  teamAvatars: string[];
  updatedAt: string;
};

const mockProjects: Project[] = [
  { id: '1', title: 'Neon Cyberpunk Ad', duration: '00:15:30', fps: 60, resolution: '4K', isAi: true, isPinned: true, teamAvatars: ['/avatars/1.png', '/avatars/2.png'], updatedAt: '2 hours ago' },
  { id: '2', title: 'Product Launch Teaser', duration: '00:01:45', fps: 30, resolution: '1080p', isAi: false, isPinned: true, teamAvatars: ['/avatars/3.png'], updatedAt: '5 hours ago' },
  { id: '3', title: 'Docuseries Episode 4', duration: '00:45:00', fps: 24, resolution: '4K', isAi: true, isPinned: false, teamAvatars: ['/avatars/1.png', '/avatars/4.png', '/avatars/5.png'], updatedAt: '1 day ago' },
  { id: '4', title: 'Social Media Shorts', duration: '00:00:15', fps: 60, resolution: '1080p Vertical', isAi: true, isPinned: false, teamAvatars: ['/avatars/2.png'], updatedAt: '2 days ago' },
  { id: '5', title: 'Corporate Training Q3', duration: '01:20:00', fps: 30, resolution: '1080p', isAi: false, isPinned: false, teamAvatars: ['/avatars/6.png'], updatedAt: '3 days ago' },
  { id: '6', title: 'Music Video - Starlight', duration: '00:03:45', fps: 24, resolution: '8K', isAi: true, isPinned: false, teamAvatars: ['/avatars/3.png', '/avatars/7.png'], updatedAt: '4 days ago' },
  { id: '7', title: 'Indie Game Trailer', duration: '00:02:10', fps: 60, resolution: '4K', isAi: false, isPinned: false, teamAvatars: ['/avatars/1.png', '/avatars/8.png'], updatedAt: '1 week ago' },
  { id: '8', title: 'Wedding Highlight Reel', duration: '00:05:30', fps: 24, resolution: '4K', isAi: true, isPinned: false, teamAvatars: ['/avatars/4.png', '/avatars/5.png'], updatedAt: '2 weeks ago' },
];

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full bg-background/50 backdrop-blur-xl">
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8">
        <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
          {/* Header & Toolbar */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">Projects</h1>
              <p className="text-muted-foreground text-sm mt-1">Manage and collaborate on your video projects.</p>
            </div>
            <ProjectToolbar 
              viewMode={viewMode} 
              onViewModeChange={setViewMode} 
              onCreateProject={() => setIsCreateDialogOpen(true)} 
            />
          </div>

          {/* Project Grid / List */}
          <motion.div 
            layout
            className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "flex flex-col gap-3"
            }
          >
            <AnimatePresence mode="popLayout">
              {mockProjects.map((project) => (
                <ContextMenu key={project.id}>
                  <motion.div
                    layout
                    layoutId={`project-${project.id}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  >
                    {viewMode === 'grid' ? (
                      <ProjectCard project={project} />
                    ) : (
                      <ProjectListItem project={project} />
                    )}
                  </motion.div>
                </ContextMenu>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      
      <CreateProjectDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  );
}

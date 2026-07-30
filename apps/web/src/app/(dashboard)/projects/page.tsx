'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, LayoutGrid, List, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { SkeletonCard } from '@/components/ui/skeleton';
import { ProjectCard } from '@/components/projects/project-card';
import { CreateProjectDialog } from '@/components/projects/create-project-dialog';
import { useApi } from '@/hooks/use-api';

interface Project {
  id: string;
  name: string;
  platform: 'YOUTUBE_SHORTS' | 'TIKTOK' | 'INSTAGRAM_REELS' | 'FACEBOOK_REELS';
  status: 'DRAFT' | 'PROCESSING' | 'READY' | 'PUBLISHED' | 'ERROR';
  thumbnailUrl?: string;
  duration?: number;
  updatedAt: string;
}

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: projects, loading, error, request } = useApi<Project[]>();

  useEffect(() => {
    // Simulated API call for initial load
    // In a real app, this would be request({ url: '/api/v1/projects' })
    const loadProjects = async () => {
      try {
        await request({ url: '/api/v1/projects' });
      } catch (err) {
        // Handle error or use mock data for demo
        console.error('Failed to load projects:', err);
      }
    };
    loadProjects();
  }, [request]);

  // Mock data fallback for preview
  const displayProjects = projects || [];

  return (
    <div className="flex flex-col h-full space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Projects</h1>
          <p className="text-sm text-zinc-400">Manage and create your video projects.</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 glass rounded-xl border border-zinc-800/50">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input 
            placeholder="Search projects..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full bg-zinc-900/50"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select 
            value={platformFilter} 
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="w-full sm:w-36"
            options={[
              { value: 'ALL', label: 'All Platforms' },
              { value: 'YOUTUBE_SHORTS', label: 'YouTube' },
              { value: 'TIKTOK', label: 'TikTok' },
              { value: 'INSTAGRAM_REELS', label: 'Instagram' }
            ]}
          />
          <Select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-36"
            options={[
              { value: 'ALL', label: 'All Status' },
              { value: 'DRAFT', label: 'Draft' },
              { value: 'READY', label: 'Ready' },
              { value: 'PUBLISHED', label: 'Published' }
            ]}
          />
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {loading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {[1, 2, 3, 4].map(i => (
              <SkeletonCard key={i} className="h-64" />
            ))}
          </div>
        ) : displayProjects.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {displayProjects.map(project => (
              <ProjectCard 
                key={project.id} 
                {...project} 
                onClick={() => console.log('Navigate to project', project.id)}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
            <div className="w-20 h-20 bg-violet-500/10 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-10 h-10 text-violet-500" />
            </div>
            <h3 className="text-xl font-medium text-zinc-200 mb-2">No projects yet</h3>
            <p className="text-zinc-400 mb-6 max-w-sm">
              Create your first AI video project to get started. Choose from templates or start from scratch.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create First Project
            </Button>
          </div>
        )}
      </div>

      <CreateProjectDialog 
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)} 
      />
    </div>
  );
}

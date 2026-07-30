import React from 'react';
import { MoreVertical, Edit2, Copy, Trash2, Clock } from 'lucide-react';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface ProjectCardProps {
  id: string;
  name: string;
  platform: 'YOUTUBE_SHORTS' | 'TIKTOK' | 'INSTAGRAM_REELS' | 'FACEBOOK_REELS';
  status: 'DRAFT' | 'PROCESSING' | 'READY' | 'PUBLISHED' | 'ERROR';
  thumbnailUrl?: string;
  duration?: number;
  updatedAt: string;
  onClick?: () => void;
}

export function ProjectCard({ 
  id, 
  name, 
  platform, 
  status, 
  thumbnailUrl, 
  duration, 
  updatedAt,
  onClick
}: ProjectCardProps) {
  
  const getPlatformColors = () => {
    switch(platform) {
      case 'YOUTUBE_SHORTS': return 'from-red-600 to-red-800';
      case 'TIKTOK': return 'from-pink-600 to-cyan-600';
      case 'INSTAGRAM_REELS': return 'from-purple-600 to-orange-500';
      case 'FACEBOOK_REELS': return 'from-blue-600 to-blue-800';
      default: return 'from-violet-600 to-purple-800';
    }
  };

  const getPlatformLabel = () => {
    switch(platform) {
      case 'YOUTUBE_SHORTS': return 'YouTube';
      case 'TIKTOK': return 'TikTok';
      case 'INSTAGRAM_REELS': return 'Instagram';
      case 'FACEBOOK_REELS': return 'Facebook';
      default: return platform;
    }
  };

  const getStatusBadge = () => {
    switch(status) {
      case 'DRAFT': return <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">Draft</Badge>;
      case 'PROCESSING': return <Badge variant="default" className="bg-blue-500/20 text-blue-300">Processing</Badge>;
      case 'READY': return <Badge variant="default" className="bg-violet-500/20 text-violet-300">Ready</Badge>;
      case 'PUBLISHED': return <Badge variant="default" className="bg-emerald-500/20 text-emerald-300">Published</Badge>;
      case 'ERROR': return <Badge variant="destructive">Error</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Simple relative time formatter
  const getRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="glass rounded-xl border border-zinc-800/60 overflow-hidden group hover:border-violet-500/50 transition-colors flex flex-col h-full cursor-pointer relative">
      <div 
        className="absolute inset-0 z-0" 
        onClick={onClick} 
        aria-label={`Open project ${name}`}
      />
      
      {/* Thumbnail Area */}
      <div className={`h-40 relative ${thumbnailUrl ? '' : `bg-gradient-to-br ${getPlatformColors()}`}`}>
        {thumbnailUrl && (
          <img src={thumbnailUrl} alt={name} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <Badge className="bg-black/60 backdrop-blur-md text-white border-none text-[10px]">
            {getPlatformLabel()}
          </Badge>
          
          <div className="z-10" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu 
              trigger={
                <button className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              }
            >
              <DropdownMenuItem icon={<Edit2 className="w-4 h-4" />}>Edit</DropdownMenuItem>
              <DropdownMenuItem icon={<Copy className="w-4 h-4" />}>Duplicate</DropdownMenuItem>
              <DropdownMenuItem variant="destructive" icon={<Trash2 className="w-4 h-4" />}>Delete</DropdownMenuItem>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Bottom duration */}
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5 text-[10px] text-white font-medium flex items-center">
            <Clock className="w-3 h-3 mr-1 opacity-70" />
            {formatDuration(duration)}
          </div>
        )}
      </div>
      
      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 bg-zinc-950/50">
        <div className="flex justify-between items-start mb-2 z-10 pointer-events-none">
          <h3 className="font-semibold text-zinc-100 truncate pr-2 text-lg">{name}</h3>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          {getStatusBadge()}
        </div>
        
        <div className="mt-auto pt-4 border-t border-zinc-800/50 text-xs text-zinc-500 flex justify-between items-center z-10 pointer-events-none">
          <span>Updated {getRelativeTime(updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}

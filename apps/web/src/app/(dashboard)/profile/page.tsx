import React from 'react';
import Link from 'next/link';
import { Settings, Video, Wand2, FolderDot, MapPin, Clock, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const isLoading = false; // Add real state later
  const user = {
    name: "Alex Doe",
    username: "alexdoe",
    bio: "Video creator & AI enthusiast",
    location: "San Francisco, CA",
    timezone: "PST",
    memberSince: "2024",
    plan: "Pro",
    stats: {
      projects: 24,
      videos: 156,
      generations: 1205
    }
  };

  const getPlanColor = (plan: string) => {
    switch(plan.toLowerCase()) {
      case 'pro': return 'bg-violet-600 text-white';
      case 'business': return 'bg-cyan-500 text-white';
      case 'enterprise': return 'bg-zinc-100 text-zinc-900';
      default: return 'bg-zinc-800 text-zinc-300';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-48 rounded-xl bg-zinc-800/50"></div>
        <div className="flex gap-6 px-6">
          <div className="w-24 h-24 rounded-full bg-zinc-800 -mt-12 border-4 border-[#09090b]"></div>
          <div className="space-y-3 flex-1 pt-2">
            <div className="h-6 bg-zinc-800 rounded w-1/3"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl">
        {/* Cover Image */}
        <div className="h-48 w-full bg-gradient-to-r from-violet-600/40 via-purple-500/40 to-cyan-400/40 object-cover">
        </div>
        
        {/* Profile Info */}
        <div className="px-6 pb-6 flex flex-col md:flex-row gap-6 items-start">
          <div className="-mt-12 relative">
            <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-[#09090b] flex items-center justify-center text-3xl text-zinc-400 overflow-hidden">
              <span className="bg-violet-600 w-full h-full flex items-center justify-center text-white">AD</span>
            </div>
            <span className={`absolute bottom-0 right-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${getPlanColor(user.plan)} border-2 border-[#09090b]`}>
              {user.plan}
            </span>
          </div>
          
          <div className="flex-1 pt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-zinc-100">{user.name}</h1>
                <p className="text-zinc-400">@{user.username}</p>
              </div>
              <Link 
                href="/settings/account"
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg transition-colors text-sm font-medium border border-zinc-700"
              >
                <Settings className="w-4 h-4" />
                Edit Profile
              </Link>
            </div>
            
            <p className="mt-4 text-zinc-300 max-w-2xl">{user.bio}</p>
            
            <div className="flex flex-wrap gap-4 mt-6 text-sm text-zinc-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {user.location}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {user.timezone}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Joined {user.memberSince}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Projects', value: user.stats.projects, icon: FolderDot, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Videos Created', value: user.stats.videos, icon: Video, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'AI Generations', value: user.stats.generations, icon: Wand2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
              <p className="text-2xl font-bold text-zinc-100">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div>
        <h2 className="text-xl font-bold text-zinc-100 mb-4">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-violet-500/50 transition-colors backdrop-blur-xl">
              <div className="aspect-video rounded-lg bg-zinc-800 mb-4 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <h3 className="font-medium text-zinc-100 mb-1">Project Alpha {i}</h3>
              <p className="text-sm text-zinc-500">Edited 2 days ago</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

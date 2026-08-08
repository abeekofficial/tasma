"use client";

import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Video, Wand2, Settings } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const MOCK_STATS = [
  { label: "Videos Created", value: "12", trend: "+3", trendUp: true },
  { label: "Templates Used", value: "4", trend: "+1", trendUp: true },
  { label: "Recent Renders", value: "8", trend: "+2", trendUp: true },
  { label: "Storage Used", value: "1.2 GB", trend: "+0.1 GB", trendUp: false },
];

const MOCK_PROJECTS = [
  { id: "1", title: "Summer Campaign 2024", duration: "01:24", lastEdited: "2 hours ago", thumbnail: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500&q=80" },
  { id: "2", title: "Product Launch Teaser", duration: "00:45", lastEdited: "5 hours ago", thumbnail: "https://images.unsplash.com/photo-1557683316-973673baf926?w=500&q=80" },
  { id: "3", title: "Social Media Ad", duration: "00:15", lastEdited: "1 day ago", thumbnail: "https://images.unsplash.com/photo-1579546929662-711afa0ed314?w=500&q=80" },
  { id: "4", title: "Corporate Overview", duration: "03:10", lastEdited: "2 days ago", thumbnail: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=500&q=80" },
];

const MOCK_ACTIVITIES = [
  { id: "a1", user: "Alice", action: "rendered", target: "Summer Campaign 2024", time: "2m ago" },
  { id: "a2", user: "You", action: "uploaded", target: "8 assets", time: "1h ago" },
  { id: "a3", user: "Bob", action: "commented on", target: "Product Launch Teaser", time: "3h ago" },
  { id: "a4", user: "System", action: "processed", target: "Voiceover generation", time: "5h ago" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const { data } = useSession();

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* Top Section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
            Welcome back, {data?.user?.name?.split(" ")[0] || "Creator"}!
          </h1>
          <p className="text-zinc-400 mt-2">Here's your studio overview for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-zinc-900/50 backdrop-blur-md border-zinc-800">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          <Button variant="outline" className="gap-2 bg-zinc-900/50 backdrop-blur-md border-zinc-800">
            <Upload className="w-4 h-4" />
            Upload
          </Button>
          <Link href="/create">
            <Button className="gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <Plus className="w-4 h-4" />
              Create Short
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Middle Section: Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_STATS.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </motion.div>

      {/* Bottom Section */}
      <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-100">Recent Projects</h2>
            <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100">View all</Button>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {MOCK_PROJECTS.map((project) => (
              <Card key={project.id} className="group overflow-hidden bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm hover:border-zinc-700 transition-all cursor-pointer">
                <div className="aspect-video relative overflow-hidden bg-zinc-950">
                  <Image 
                    src={project.thumbnail} 
                    alt={project.title}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 transition-opacity group-hover:scale-105 duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <span className="text-sm font-medium text-zinc-100 truncate pr-2">{project.title}</span>
                    <span className="text-xs font-mono text-zinc-300 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-md">{project.duration}</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                      <Video className="w-5 h-5 fill-current" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-3 bg-zinc-950/50 border-t border-zinc-800/50">
                  <p className="text-xs text-zinc-500 text-right">{project.lastEdited}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-100">Activity</h2>
          <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm h-[calc(100%-2.5rem)]">
            <CardContent className="p-0">
              <ActivityFeed activities={MOCK_ACTIVITIES} />
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, HardDrive, Zap, Clock, Plus, Upload, Wand2 } from "lucide-react";

export default function DashboardPage() {
  const { data } = useSession();

  const stats = [
    { label: "Projects", value: "12", icon: Video, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Storage Used", value: "4.2 GB", icon: HardDrive, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "AI Credits", value: "850", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Renders", value: "24", icon: Clock, color: "text-violet-500", bg: "bg-violet-500/10" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Welcome back, {data?.user?.name?.split(" ")[0] || "Creator"}!</h1>
          <p className="text-zinc-400 text-sm mt-1">Here's what's happening in your studio.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<Upload className="w-4 h-4" />}>Upload</Button>
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>New Project</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} variant="default" className="border-zinc-800/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-zinc-100 mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-100">Recent Projects</h2>
            <Button variant="ghost" size="sm">View all</Button>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} variant="default" hover className="cursor-pointer group">
                <div className="aspect-video bg-zinc-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-sm font-medium text-white">Project {i}</div>
                  <div className="absolute inset-0 bg-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white shadow-lg">
                      <Video className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 py-3 flex justify-between items-center text-xs text-zinc-400">
                  <span>Edited 2 days ago</span>
                  <span>02:45</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-zinc-100">Quick Actions</h2>
          <div className="space-y-3">
            <Button variant="secondary" fullWidth className="justify-start h-12" leftIcon={<Wand2 className="w-4 h-4 text-violet-400" />}>
              Generate Script with AI
            </Button>
            <Button variant="secondary" fullWidth className="justify-start h-12" leftIcon={<Upload className="w-4 h-4 text-emerald-400" />}>
              Upload Media Assets
            </Button>
            <Button variant="secondary" fullWidth className="justify-start h-12" leftIcon={<Video className="w-4 h-4 text-blue-400" />}>
              Browse Templates
            </Button>
          </div>

          <Card className="mt-8 border-violet-500/20 bg-violet-500/5">
            <CardHeader>
              <CardTitle className="text-violet-300 text-sm">Upgrade to Pro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400 mb-4">Unlock 4K rendering, custom fonts, and 50GB storage.</p>
              <Button variant="primary" fullWidth size="sm">Upgrade Now</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

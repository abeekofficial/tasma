"use client";

import { motion } from "framer-motion";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, Clock, Zap } from "lucide-react";

const MOCK_USAGE_DATA = [
  { date: "Jan 1", renders: 12, aiGenerations: 45, bandwidth: 2.1 },
  { date: "Jan 2", renders: 18, aiGenerations: 52, bandwidth: 3.4 },
  { date: "Jan 3", renders: 15, aiGenerations: 38, bandwidth: 2.8 },
  { date: "Jan 4", renders: 24, aiGenerations: 65, bandwidth: 4.2 },
  { date: "Jan 5", renders: 32, aiGenerations: 80, bandwidth: 5.5 },
  { date: "Jan 6", renders: 28, aiGenerations: 72, bandwidth: 4.8 },
  { date: "Jan 7", renders: 35, aiGenerations: 95, bandwidth: 6.1 },
];

const SECONDARY_STATS = [
  { label: "Processing Time", value: "45s", trend: "-12%", trendUp: true, icon: Clock },
  { label: "Failed Jobs", value: "3", trend: "-2", trendUp: true, icon: AlertTriangle },
  { label: "API Requests", value: "124K", trend: "+15%", trendUp: false, icon: Activity },
  { label: "Credit Balance", value: "850", trend: "-150", trendUp: false, icon: Zap },
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

export default function AnalyticsPage() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Analytics Overview</h1>
        <p className="text-zinc-400">Deep dive into your studio's performance and usage metrics.</p>
      </motion.div>

      {/* Primary Chart Section */}
      <motion.div variants={itemVariants}>
        <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-zinc-100">Compute & AI Usage (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <UsageChart data={MOCK_USAGE_DATA} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Secondary Stats Section */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold text-zinc-100 mb-4">System Performance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SECONDARY_STATS.map((stat, i) => (
            <Card key={i} className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-zinc-800/50 rounded-lg">
                    <stat.icon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <span className={\`text-xs font-medium px-2 py-1 rounded-full \${stat.trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}\`}>
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-zinc-100 mt-1">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

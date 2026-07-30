import * as React from "react";
import { CheckCircle2, MessageSquare, Play, Upload } from "lucide-react";

interface Activity {
  id: string;
  type: "upload" | "process" | "comment" | "complete";
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "upload",
    title: "New raw footage uploaded",
    description: "Drone-shots-V2.mp4 uploaded to Project Alpha",
    timestamp: "10 mins ago",
    user: "Sarah J.",
  },
  {
    id: "2",
    type: "process",
    title: "AI Processing started",
    description: "Auto-color grading and stabilization initiated",
    timestamp: "45 mins ago",
    user: "System",
  },
  {
    id: "3",
    type: "comment",
    title: "Feedback added",
    description: "Please crop the opening sequence tighter.",
    timestamp: "2 hours ago",
    user: "Mike R.",
  },
  {
    id: "4",
    type: "complete",
    title: "Render completed",
    description: "Version 1.0 is ready for review",
    timestamp: "Yesterday",
    user: "System",
  },
];

const iconMap = {
  upload: Upload,
  process: Play,
  comment: MessageSquare,
  complete: CheckCircle2,
};

const colorMap = {
  upload: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20",
  process: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20",
  comment: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20",
  complete: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20",
};

export function ActivityFeed() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-sm dark:shadow-none dark:border-white/10 dark:bg-black/40">
      <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
        Recent Activity
      </h3>
      <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-4 before:-ml-px before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:via-gray-200 before:to-transparent dark:before:from-white/10 dark:before:via-white/10">
        {mockActivities.map((activity) => {
          const Icon = iconMap[activity.type];
          return (
            <div key={activity.id} className="relative flex items-start gap-4">
              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-white dark:ring-[#111] ${colorMap[activity.type]}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col flex-1 gap-1 pt-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {activity.title}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {activity.description}
                </p>
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                  by {activity.user}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

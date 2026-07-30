"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Mon", rendering: 120, ai: 80 },
  { name: "Tue", rendering: 132, ai: 90 },
  { name: "Wed", rendering: 101, ai: 70 },
  { name: "Thu", rendering: 140, ai: 110 },
  { name: "Fri", rendering: 190, ai: 140 },
  { name: "Sat", rendering: 210, ai: 160 },
  { name: "Sun", rendering: 170, ai: 130 },
];

export function UsageChart() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-sm dark:shadow-none dark:border-white/10 dark:bg-black/40">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          System Usage
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Rendering time vs AI processing (minutes) over the last 7 days.
        </p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRendering" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(156, 163, 175, 0.2)"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
              itemStyle={{ color: "#fff" }}
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="rendering"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRendering)"
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="ai"
              stroke="#8b5cf6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAi)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import * as React from "react";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

export interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
}: StatsCardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10 dark:border-white/10 dark:bg-black/40 dark:hover:bg-black/60 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <div className="rounded-md bg-white/10 p-2 text-gray-600 dark:bg-white/5 dark:text-gray-300">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <h3 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {value}
        </h3>
      </div>
      {trend !== undefined && (
        <div className="mt-2 flex items-center gap-1 text-sm">
          <span
            className={`flex items-center font-medium ${
              isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : isNegative
                ? "text-rose-600 dark:text-rose-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="mr-1 h-4 w-4" />
            ) : isNegative ? (
              <ArrowDownRight className="mr-1 h-4 w-4" />
            ) : null}
            {Math.abs(trend)}%
          </span>
          {trendLabel && (
            <span className="text-gray-500 dark:text-gray-400">
              {trendLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

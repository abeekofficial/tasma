"use client";

import { Check, X } from "lucide-react";
import { cn } from "../ui/button";

interface PasswordStrengthProps {
  password?: string;
}

export function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  const reqs = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains number", met: /[0-9]/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const metCount = reqs.filter((r) => r.met).length;
  let strengthLabel = "Weak";
  let color = "bg-zinc-800";
  let barWidth = "w-0";

  if (metCount > 0) {
    if (metCount <= 2) {
      strengthLabel = "Weak";
      color = "bg-rose-500";
      barWidth = "w-1/4";
    } else if (metCount === 3) {
      strengthLabel = "Medium";
      color = "bg-amber-500";
      barWidth = "w-2/4";
    } else if (metCount === 4) {
      strengthLabel = "Strong";
      color = "bg-emerald-400";
      barWidth = "w-3/4";
    } else if (metCount === 5) {
      strengthLabel = "Very Strong";
      color = "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
      barWidth = "w-full";
    }
  }

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-400">Password strength</span>
        <span className={cn("font-medium", color.replace("bg-", "text-").split(" ")[0])}>
          {password.length === 0 ? "" : strengthLabel}
        </span>
      </div>
      
      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div className={cn("h-full transition-all duration-300 rounded-full", color, barWidth)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
        {reqs.map((req, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            {req.met ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <X className="w-3.5 h-3.5 text-zinc-600" />
            )}
            <span className={req.met ? "text-zinc-300" : "text-zinc-500"}>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

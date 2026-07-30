"use client";

import { cn } from "./button";
import Image from "next/image";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  initials?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy" | "away";
}

export function Avatar({ src, alt, initials, size = "md", status, className, ...props }: AvatarProps) {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
  };

  const statusColors = {
    online: "bg-emerald-500",
    offline: "bg-zinc-500",
    busy: "bg-rose-500",
    away: "bg-amber-500",
  };

  return (
    <div className={cn("relative inline-block", className)} {...props}>
      <div className={cn("relative rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center border border-zinc-700", sizes[size])}>
        {src ? (
          <Image src={src} alt={alt || "Avatar"} fill className="object-cover" />
        ) : (
          <span className="text-zinc-300 font-medium">{initials?.substring(0, 2).toUpperCase() || "?"}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-zinc-950",
            statusColors[status],
            size === "xs" ? "w-1.5 h-1.5" : size === "sm" ? "w-2 h-2" : size === "md" ? "w-2.5 h-2.5" : "w-3 h-3"
          )}
        />
      )}
    </div>
  );
}

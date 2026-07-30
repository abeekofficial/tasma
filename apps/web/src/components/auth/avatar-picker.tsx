"use client";

import { useState } from "react";
import { Camera, ImagePlus, User } from "lucide-react";
import { cn } from "@/lib/utils";

const GRADIENTS = [
  "bg-gradient-to-tr from-rose-400 to-orange-300",
  "bg-gradient-to-tr from-violet-500 to-purple-300",
  "bg-gradient-to-tr from-blue-500 to-cyan-300",
  "bg-gradient-to-tr from-emerald-400 to-cyan-400",
  "bg-gradient-to-tr from-amber-200 to-yellow-500",
  "bg-gradient-to-tr from-fuchsia-500 to-pink-500",
];

interface AvatarPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <div 
          className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-medium shadow-sm transition-all duration-300 shrink-0",
            value && value.startsWith("bg-gradient") ? value : "bg-muted text-muted-foreground border-2 border-dashed border-border"
          )}
        >
          {!value && <User size={40} className="opacity-50" />}
          {value === "upload" && <ImagePlus size={32} className="opacity-50" />}
        </div>
        <div className="flex-1 space-y-3">
          <p className="text-sm font-medium text-foreground">Choose an avatar</p>
          <div className="flex flex-wrap gap-3">
            {GRADIENTS.map((gradient) => (
              <button
                key={gradient}
                type="button"
                onClick={() => onChange(gradient)}
                className={cn(
                  "w-10 h-10 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background",
                  gradient,
                  value === gradient && "ring-2 ring-primary ring-offset-2 scale-110"
                )}
                aria-label="Select gradient avatar"
              />
            ))}
            <button
              type="button"
              onClick={() => onChange("upload")}
              className={cn(
                "w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background text-muted-foreground",
                value === "upload" && "ring-2 ring-primary ring-offset-2 scale-110"
              )}
              aria-label="Upload custom avatar"
            >
              <Camera size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

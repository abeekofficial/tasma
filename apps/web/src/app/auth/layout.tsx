"use client";

import { Sparkles, Video, Zap, Globe } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-zinc-950">
      {/* Left side branded panel */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-between p-12 overflow-hidden border-r border-zinc-800/50">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-zinc-950 to-zinc-950" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent opacity-50" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <Sparkles className="w-8 h-8 text-violet-500" />
            <span className="text-2xl font-bold text-zinc-100">Tasma</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-zinc-100 leading-tight mb-6">
            Create Viral Videos <br />
            <span className="text-gradient">in Seconds</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-md">
            Join thousands of creators building their audience with our next-generation AI video tools.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          {[
            { icon: Zap, text: "AI-Powered Generation" },
            { icon: Video, text: "Professional Timeline Editor" },
            { icon: Globe, text: "One-Click Publishing" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 text-zinc-300">
              <div className="w-10 h-10 rounded-lg glass flex items-center justify-center text-violet-400">
                <item.icon className="w-5 h-5" />
              </div>
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 bg-zinc-950/50 backdrop-blur-3xl lg:hidden" />
        <div className="w-full max-w-md relative z-10 animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}

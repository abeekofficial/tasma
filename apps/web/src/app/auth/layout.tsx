"use client";

import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left side - Auth Forms */}
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 border-r border-border/50 bg-background/50 backdrop-blur-3xl z-10">
        <div className="w-full max-w-sm mx-auto lg:w-96">
          {children}
        </div>
      </div>
      
      {/* Right side - Animated Graphic */}
      <div className="hidden lg:flex relative flex-1 w-0 items-center justify-center bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950" />
        {/* Animated Gradient Mesh / Abstract Shape */}
        <div className="relative w-full max-w-2xl aspect-square">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 via-purple-500/20 to-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute inset-20 bg-gradient-to-bl from-zinc-800 via-zinc-900 to-black rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl rotate-12 transition-transform hover:rotate-6 duration-700" />
          <div className="absolute inset-32 bg-gradient-to-tr from-white/5 to-transparent rounded-2xl border border-white/5 -rotate-6 transition-transform hover:rotate-0 duration-700 backdrop-blur-md" />
        </div>
      </div>
    </div>
  );
}

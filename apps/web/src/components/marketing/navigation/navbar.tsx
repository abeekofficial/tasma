"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-zinc-950/50 backdrop-blur-md">
      <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-500" />
            <span className="text-xl font-bold text-zinc-100">Tasma</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
            <Link href="#features" className="hover:text-zinc-100 transition-colors">Features</Link>
            <Link href="#workflow" className="hover:text-zinc-100 transition-colors">Workflow</Link>
            <Link href="#pricing" className="hover:text-zinc-100 transition-colors">Pricing</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="hidden sm:block text-sm text-zinc-300 hover:text-zinc-100 transition-colors">
            Log in
          </Link>
          <Link href="/auth/register">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-violet-600 hover:bg-violet-500 text-white rounded-full px-6">
                Get Started
              </Button>
            </motion.div>
          </Link>
        </div>
      </nav>
    </header>
  );
}

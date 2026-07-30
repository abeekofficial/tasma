"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/auth/glass-card';
import { Clock } from 'lucide-react';
import Link from 'next/link';

export default function SessionExpiredPage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
    >
      <GlassCard className="p-8 max-w-sm w-full mx-4 shadow-2xl border-border/50 bg-background/90">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 mb-6">
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Session Expired</h2>
          <p className="text-sm text-muted-foreground mb-8">
            For your security, you have been logged out due to inactivity. Please sign in again to continue.
          </p>
          
          <Link
            href="/auth/login"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
          >
            Sign In Again
          </Link>
        </div>
      </GlassCard>
    </motion.div>
  );
}

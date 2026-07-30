"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/auth/glass-card';
import { OtpInput } from '@/components/auth/otp-input';
import { authClient } from '@/lib/auth-client';
import { ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TwoFactorAuthPage() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async (code: string) => {
    setIsLoading(true);
    try {
      await authClient.twoFactor.verify({ code });
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard className="p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-6">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">Two-Factor Authentication</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <div className="flex justify-center py-4">
          <OtpInput
            length={6}
            value={otp}
            onChange={setOtp}
            onComplete={handleVerify}
            disabled={isLoading}
          />
        </div>

        <div className="mt-8 text-center text-sm">
          <button 
            className="font-medium text-muted-foreground hover:text-foreground transition-colors"
            disabled={isLoading}
          >
            Use a recovery code instead
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

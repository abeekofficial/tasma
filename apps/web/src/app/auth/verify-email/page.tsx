"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/auth/glass-card';
import { OtpInput } from '@/components/auth/otp-input';
import { authClient } from '@/lib/auth-client';
import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleVerify = async (code: string) => {
    setIsLoading(true);
    try {
      await authClient.verifyEmail({ code });
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
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
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-semibold tracking-tight">Verify your email</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  We sent a code to your email. Enter it below to verify your account.
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
                  onClick={() => { /* resend logic */ }}
                >
                  Didn't receive a code? Resend
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100/10 mb-6">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Verified</h3>
              <p className="text-sm text-muted-foreground mb-8">
                Your email has been successfully verified. You can now access all features.
              </p>
              <button
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                onClick={() => router.push('/dashboard')}
              >
                Continue to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}

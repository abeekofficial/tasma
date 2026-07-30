"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    // Simulate API call for forgot password
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="w-full text-center space-y-6">
        <div className="w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center mx-auto text-violet-500 mb-6">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-100">Check your email</h2>
        <p className="text-zinc-400 text-sm max-w-sm mx-auto">
          We've sent a password reset link to <span className="font-medium text-zinc-200">{email}</span>. 
          Please check your inbox.
        </p>
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 mt-4">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-zinc-100">Reset your password</h2>
        <p className="text-zinc-400 mt-2 text-sm">Enter your email and we'll send you a link to reset your password.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Button type="submit" variant="primary" fullWidth isLoading={loading} className="mt-4">
          Send Reset Link
        </Button>
      </form>

      <p className="text-center text-sm text-zinc-400 mt-8">
        <Link href="/auth/login" className="inline-flex items-center gap-2 hover:text-zinc-300">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
      </p>
    </div>
  );
}

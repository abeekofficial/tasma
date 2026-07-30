"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    // Simulate verification process
    const timer = setTimeout(() => {
      setStatus("success");
      
      // Auto redirect after success
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="w-full text-center">
      {status === "loading" && (
        <div className="space-y-6 flex flex-col items-center">
          <Spinner size="lg" />
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">Verifying your email</h2>
            <p className="text-zinc-400 mt-2 text-sm">Please wait a moment...</p>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6 animate-scale-in flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">Email Verified!</h2>
            <p className="text-zinc-400 mt-2 text-sm">Redirecting you to the dashboard...</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <XCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">Verification Failed</h2>
            <p className="text-zinc-400 mt-2 text-sm">The link might be expired or invalid.</p>
          </div>
          <Button variant="primary" onClick={() => setStatus("loading")}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}

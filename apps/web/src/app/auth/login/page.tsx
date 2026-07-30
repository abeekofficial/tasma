"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-zinc-100">Welcome back</h2>
        <p className="text-zinc-400 mt-2 text-sm">Sign in to your Tasma account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />
        
        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-zinc-700 bg-zinc-900 text-violet-500 focus:ring-violet-500/20 focus:ring-offset-0"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              />
              Remember me
            </label>
            <Link href="/auth/forgot-password" className="text-sm text-violet-400 hover:text-violet-300">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" variant="primary" fullWidth isLoading={loading} className="mt-6">
          Sign In
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4 before:h-px before:flex-1 before:bg-zinc-800 after:h-px after:flex-1 after:bg-zinc-800">
        <span className="text-xs text-zinc-500 uppercase">or continue with</span>
      </div>

      <OAuthButtons />

      <p className="text-center text-sm text-zinc-400 mt-8">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-violet-400 hover:text-violet-300 font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}

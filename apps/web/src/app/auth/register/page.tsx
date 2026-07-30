"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { toast } from "sonner";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", email: "", password: "", confirmPassword: "", terms: false 
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = registerSchema.safeParse(formData);
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
      await signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      toast.success("Account created! Please check your email.");
      router.push("/auth/verify-email");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-zinc-100">Create your account</h2>
        <p className="text-zinc-400 mt-2 text-sm">Join Tasma and start creating today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />
        
        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />
          <PasswordStrength password={formData.password} />
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
        />

        <div className="pt-2">
          <label className="flex items-start gap-2 text-sm text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 rounded border-zinc-700 bg-zinc-900 text-violet-500 focus:ring-violet-500/20"
              checked={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
            />
            <span>
              I agree to the <Link href="/terms" className="text-violet-400 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-violet-400 hover:underline">Privacy Policy</Link>
            </span>
          </label>
          {errors.terms && <p className="text-xs text-rose-500 mt-1">{errors.terms}</p>}
        </div>

        <Button type="submit" variant="primary" fullWidth isLoading={loading} className="mt-4">
          Create Account
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4 before:h-px before:flex-1 before:bg-zinc-800 after:h-px after:flex-1 after:bg-zinc-800">
        <span className="text-xs text-zinc-500 uppercase">or register with</span>
      </div>

      <OAuthButtons />

      <p className="text-center text-sm text-zinc-400 mt-8">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}

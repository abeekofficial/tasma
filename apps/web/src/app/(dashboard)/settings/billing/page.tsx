"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Download } from "lucide-react";

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6">
      <Card className="border-violet-500/30">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                Pro Plan <Badge variant="premium">Active</Badge>
              </CardTitle>
              <CardDescription className="mt-1">You are currently on the Pro plan.</CardDescription>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-zinc-100">$49</span>
              <span className="text-sm text-zinc-400">/mo</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2 text-sm text-zinc-300">
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-500" /> Unlimited Projects</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-500" /> 4K Video Exports</div>
            </div>
            <div className="space-y-2 text-sm text-zinc-300">
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-500" /> Custom Fonts</div>
              <div className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-500" /> Priority Support</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="primary">Upgrade to Team</Button>
            <Button variant="outline">Cancel Subscription</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage Metrics</CardTitle>
          <CardDescription>Your current usage for this billing period (resets in 12 days).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-300">Storage</span>
              <span className="text-zinc-400">4.2 GB / 50 GB</span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[8%]" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-300">AI Credits</span>
              <span className="text-zinc-400">850 / 1000</span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[85%]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your billing details and payment methods.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-zinc-800 rounded flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">Visa ending in 4242</p>
                <p className="text-xs text-zinc-500">Expires 12/2025</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

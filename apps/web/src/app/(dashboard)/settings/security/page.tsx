"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Monitor, Smartphone, Globe, LogOut } from "lucide-react";

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-md space-y-4">
            <Input label="Current Password" type="password" />
            <Input label="New Password" type="password" />
            <Input label="Confirm New Password" type="password" />
            <Button variant="primary">Update Password</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-zinc-200">Authenticator App</h4>
              <p className="text-xs text-zinc-500 mt-1">Use an app like Google Authenticator to generate codes.</p>
            </div>
            <Button variant="outline" size="sm">Enable 2FA</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>Manage devices that are currently logged in.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-400">
            Log out of all
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { device: "MacBook Pro", browser: "Chrome", location: "San Francisco, CA", active: true, icon: Monitor },
              { device: "iPhone 13", browser: "Safari", location: "San Francisco, CA", active: false, icon: Smartphone },
            ].map((session, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                    <session.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                      {session.device} - {session.browser}
                      {session.active && <span className="text-[10px] uppercase tracking-wider bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-sm font-semibold">Active now</span>}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {session.location} • {session.active ? "Current session" : "Last active 2 hours ago"}
                    </p>
                  </div>
                </div>
                {!session.active && (
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-rose-500" title="Revoke access">
                    <LogOut className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

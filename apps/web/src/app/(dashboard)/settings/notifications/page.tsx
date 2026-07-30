"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotificationsSettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to be notified about activity.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-zinc-200">Email Notifications</h3>
            <div className="space-y-3">
              {[
                { id: "render_complete", label: "Video Render Complete", desc: "Get notified when your video is ready to download." },
                { id: "team_invites", label: "Team Invites", desc: "When someone invites you to their workspace." },
                { id: "comments", label: "Comments & Mentions", desc: "When someone comments on your project." },
                { id: "marketing", label: "News & Updates", desc: "Product updates and marketing emails." },
              ].map((item) => (
                <div key={item.id} className="flex items-start justify-between p-3 border border-zinc-800 rounded-lg bg-zinc-900/50">
                  <div className="flex-1 pr-4">
                    <label htmlFor={item.id} className="text-sm font-medium text-zinc-200 cursor-pointer">{item.label}</label>
                    <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
                  </div>
                  <div className="flex items-center h-5 mt-1">
                    <input 
                      id={item.id} 
                      type="checkbox" 
                      defaultChecked={item.id !== "marketing"}
                      className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-violet-500 focus:ring-violet-500/20"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-200">Digest Frequency</h3>
            <div className="flex gap-4">
              {["Real-time", "Daily", "Weekly", "Never"].map((freq) => (
                <label key={freq} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="digest" defaultChecked={freq === "Daily"} className="text-violet-500 focus:ring-violet-500/20 border-zinc-700 bg-zinc-900" />
                  <span className="text-sm text-zinc-300">{freq}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="primary">Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

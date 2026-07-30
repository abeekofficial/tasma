"use client";

import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Camera, Trash2 } from "lucide-react";

export default function AccountSettingsPage() {
  const { data } = useSession();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your photo and personal details here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer">
              <Avatar 
                src={data?.user?.image} 
                initials={data?.user?.name || data?.user?.email} 
                size="xl" 
                className="group-hover:opacity-50 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-zinc-200">Profile picture</h4>
              <p className="text-xs text-zinc-500">JPG, GIF or PNG. Max size of 800K</p>
              <div className="flex gap-2 pt-2">
                <Button variant="secondary" size="sm">Upload</Button>
                <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-400">Remove</Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Full Name" defaultValue={data?.user?.name || ""} />
            <Input label="Username" defaultValue="creator123" />
            <div className="md:col-span-2">
              <Input label="Email Address" defaultValue={data?.user?.email || ""} disabled helperText="Contact support to change your email address." />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Bio</label>
              <textarea 
                className="flex w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:border-violet-500 focus-visible:ring-violet-500/20 min-h-[100px] resize-y"
                placeholder="Write a few sentences about yourself."
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="primary">Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-rose-500/20 bg-rose-500/5">
        <CardHeader>
          <CardTitle className="text-rose-500">Danger Zone</CardTitle>
          <CardDescription>Permanently delete your account and all of your content.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />}>
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

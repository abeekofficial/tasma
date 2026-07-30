"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Video, 
  LayoutTemplate, 
  Image as ImageIcon, 
  Sparkles, 
  Settings,
  Menu
} from "lucide-react";
import { cn } from "../ui/button";
import { useSession } from "@/lib/auth-client";
import { Avatar } from "../ui/avatar";

export function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean, setMobileOpen: (v: boolean) => void }) {
  const pathname = usePathname();
  const { data } = useSession();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/projects", label: "Projects", icon: Video },
    { href: "/templates", label: "Templates", icon: LayoutTemplate },
    { href: "/media", label: "Media Library", icon: ImageIcon },
    { href: "/ai-studio", label: "AI Studio", icon: Sparkles },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-zinc-950/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed top-0 left-0 z-50 h-screen w-64 glass border-y-0 border-l-0 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-500" />
            <span className="text-xl font-bold text-zinc-100">Tasma</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-violet-500/10 text-violet-400" 
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-3 border-t border-zinc-800 space-y-1">
          <Link
            href="/settings/account"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname.startsWith("/settings")
                ? "bg-violet-500/10 text-violet-400"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
            )}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          
          <div className="mt-4 flex items-center gap-3 px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900/50">
            <Avatar 
              src={data?.user?.image} 
              initials={data?.user?.name || data?.user?.email} 
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-200 truncate">
                {data?.user?.name || "User"}
              </p>
              <p className="text-xs text-zinc-500 truncate">
                {data?.user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ChevronDown, 
  Home, 
  Folder, 
  BarChart2, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/projects", icon: Folder },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ 
          width: collapsed ? 80 : 256,
          x: mobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -256 : 0)
        }}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/10 bg-zinc-950/80 backdrop-blur-xl transition-transform lg:static lg:translate-x-0`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
          {!collapsed && (
            <button className="flex items-center gap-2 rounded-md hover:bg-white/5 p-2 transition-colors w-full">
              <div className="h-6 w-6 rounded bg-gradient-to-tr from-indigo-500 to-purple-500" />
              <span className="text-sm font-medium text-zinc-100 flex-1 text-left">Acme Corp</span>
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            </button>
          )}
          {collapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded bg-gradient-to-tr from-indigo-500 to-purple-500" />
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : "text-zinc-400"}`} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white">
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>
          
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full mt-4 items-center justify-center rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </motion.aside>
    </>
  );
}

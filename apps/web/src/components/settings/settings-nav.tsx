"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Shield, Bell, CreditCard, Key, Link as LinkIcon } from "lucide-react";
import { cn } from "../ui/button";

export function SettingsNav() {
  const pathname = usePathname();

  const items = [
    { href: "/settings/account", label: "Account", icon: User },
    { href: "/settings/security", label: "Security", icon: Shield },
    { href: "/settings/notifications", label: "Notifications", icon: Bell },
    { href: "/settings/billing", label: "Billing", icon: CreditCard },
    { href: "/settings/api-keys", label: "API Keys", icon: Key },
    { href: "/settings/connected-accounts", label: "Connected Accounts", icon: LinkIcon },
  ];

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" 
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 border border-transparent"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  FileText,
  Layers,
  Factory,
  Settings,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare, badge: true },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/materials", label: "Materials", icon: Layers },
  { href: "/admin/factory", label: "Factory", icon: Factory },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    async function fetchNewCount() {
      try {
        const res = await fetch("/api/inquiries?status=NEW");
        if (res.ok) {
          const data = await res.json();
          setNewCount(Array.isArray(data) ? data.length : 0);
        }
      } catch {
        /* ignore */
      }
    }

    fetchNewCount();
    const interval = setInterval(fetchNewCount, 60000);
    return () => clearInterval(interval);
  }, []);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-gold/5 bg-char-ddd">
      <div className="flex items-center gap-2.5 border-b border-gold/5 px-5 py-5">
        <Logo size={28} />
        <div>
          <p className="text-sm font-medium tracking-wide text-t1">GC CRAFTS</p>
          <p className="text-[10px] uppercase tracking-widest text-t3">Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors",
                active
                  ? "border-l-2 border-gold bg-gold/5 text-gold"
                  : "border-l-2 border-transparent text-t2 hover:bg-char-d hover:text-t1"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && newCount > 0 && (
                <Badge variant="warning" className="min-w-[1.25rem] justify-center px-1.5">
                  {newCount}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-0.5 border-t border-gold/5 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-sm px-3 py-2.5 text-sm text-t2 transition-colors hover:bg-char-d hover:text-gold"
        >
          <ExternalLink className="h-4 w-4" />
          View live site
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-2 rounded-sm px-3 py-2.5 text-sm text-t2 transition-colors hover:bg-char-d hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}

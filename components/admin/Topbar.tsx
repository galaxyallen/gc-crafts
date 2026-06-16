"use client";

import { Bell } from "lucide-react";

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gold/5 bg-char-dd px-6">
      <h1 className="font-display text-lg font-medium text-t1">{title}</h1>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative rounded-sm p-2 text-t2 transition-colors hover:bg-char-d hover:text-t1"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-xs font-semibold text-gold ring-1 ring-gold/30">
          GC
        </div>
      </div>
    </header>
  );
}

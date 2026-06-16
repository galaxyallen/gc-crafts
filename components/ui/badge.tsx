import * as React from "react";
import { cn } from "./utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        {
          default: "bg-gold/10 text-gold",
          secondary: "bg-char text-t2",
          success: "bg-green-500/10 text-green-400",
          warning: "bg-yellow-500/10 text-yellow-400",
          destructive: "bg-red-500/10 text-red-400",
        }[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };

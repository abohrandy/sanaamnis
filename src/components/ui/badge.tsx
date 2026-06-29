import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "destructive";
}

export function Badge({ className, variant = "primary", ...props }: BadgeProps) {
  const base = "inline-flex items-center px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-bold font-sans border transition-all duration-300";
  
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary text-secondary-foreground border-border/40",
    success: "bg-green-500/10 text-green-600 border-green-500/20",
    warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props} />
  );
}

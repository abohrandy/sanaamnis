import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "botanical"
    | "gold"
    | "secondary"
    | "destructive"
    | "outline"
    | "accent"
    | "glass"
    | "pill"
    | "primary"
    | "alabaster"
    | "success"
    | "warning";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center rounded-full border uppercase font-sans font-bold tracking-[0.2em] transition-all duration-300 select-none";

  const variants = {
    default: "border-transparent bg-[#1C3322] text-[#FAF8F5] shadow-ambient-sm",
    botanical: "bg-[#1C3322]/10 text-[#1C3322] border-[#1C3322]/20 backdrop-blur-xs",
    gold: "bg-[#C9A227]/15 text-[#8C531B] border-[#C9A227]/40 backdrop-blur-xs",
    secondary: "border-transparent bg-[#F3EFE8] text-[#161A17] hover:bg-[#EADBCE]",
    destructive: "border-transparent bg-rose-500/10 text-rose-700 border-rose-500/20",
    outline: "text-[#161A17] border-[#E2E6E3] dark:text-[#FAF8F5]",
    accent: "border-gold-hairline bg-[#C9A227] text-[#FAF8F5] shadow-ambient-sm",
    glass: "glass-alabaster text-[#161A17] dark:glass-obsidian dark:text-[#FAF8F5]",
    pill: "bg-[#F3EFE8] text-[#1C3322] border-transparent font-bold",
    primary: "bg-[#1C3322] text-[#FAF8F5] border-transparent",
    alabaster: "glass-alabaster text-[#161A17] border-[#E2E6E3] shadow-ambient-sm",
    success: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-[9px]",
    md: "px-3 py-1 text-[10px]",
  };

  return <span className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}



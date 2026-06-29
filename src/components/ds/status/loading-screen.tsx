import React from "react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  className?: string;
  label?: string;
}

export function LoadingScreen({ className, label = "Restoring Session" }: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 bg-background flex flex-col items-center justify-center z-50",
        className
      )}
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Brand logo */}
        <span className="font-serif text-3xl font-bold tracking-[0.25em] text-foreground animate-pulse">
          SANA AMNIS
        </span>
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        {/* Animated label */}
        <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold font-sans animate-pulse">
          {label}...
        </span>
      </div>
    </div>
  );
}

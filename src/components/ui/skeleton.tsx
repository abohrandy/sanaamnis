"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "card" | "text" | "avatar" | "button";
}

export function Skeleton({ className, variant = "text", ...props }: SkeletonProps) {
  const variants = {
    text: "h-4 w-full rounded-[0.375rem]",
    card: "h-64 w-full rounded-[1.25rem]",
    avatar: "h-12 w-12 rounded-full",
    button: "h-12 w-32 rounded-[0.5rem]",
  };

  return (
    <div
      className={cn(
        "animate-shimmer bg-[#F3EFE8] border border-[#E2E6E3]/40",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-[1.25rem] border border-[#E2E6E3] bg-[#FAF8F5] p-4 space-y-4">
      <Skeleton variant="card" className="aspect-[4/5] h-auto" />
      <Skeleton variant="text" className="w-1/3 h-3" />
      <Skeleton variant="text" className="w-3/4 h-5" />
      <div className="flex justify-between items-center pt-4 border-t border-[#E2E6E3]">
        <Skeleton variant="text" className="w-1/4 h-5" />
        <Skeleton variant="button" className="w-20 h-8" />
      </div>
    </div>
  );
}

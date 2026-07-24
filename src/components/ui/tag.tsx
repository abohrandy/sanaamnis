"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
  onRemove?: () => void;
}

export function Tag({ className, active = false, onRemove, children, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 font-sans text-xs transition-all duration-200 border cursor-pointer select-none",
        active
          ? "bg-[#1C3322] text-[#FAF8F5] border-transparent shadow-ambient-sm"
          : "bg-[#F3EFE8] text-[#161A17] hover:bg-[#EAE4D9] border-[#E2E6E3]",
        className
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 rounded-full p-0.5 hover:bg-black/10 focus:outline-none"
          aria-label="Remove tag"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

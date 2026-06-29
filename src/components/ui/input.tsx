"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== "";

    return (
      <div className="relative w-full">
        <div className="relative">
          <input
            type={type}
            ref={ref}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              "w-full px-4 py-4 pt-6 pb-2 border bg-card text-foreground font-sans text-sm outline-hidden transition-all duration-300 rounded-none",
              error
                ? "border-destructive focus:border-destructive"
                : focused
                ? "border-primary"
                : "border-border hover:border-foreground/30",
              className
            )}
            {...props}
          />
          {label && (
            <label
              className={cn(
                "absolute left-4 pointer-events-none transition-all duration-300 font-sans uppercase tracking-wider text-[10px] font-bold text-muted-foreground",
                focused || hasValue || props.placeholder
                  ? "top-2 text-[8px] text-primary"
                  : "top-1/2 -translate-y-1/2 text-xs"
              )}
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="mt-1 text-[10px] uppercase tracking-wider text-destructive font-semibold">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

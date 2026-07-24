"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, icon, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== "";

    return (
      <div className="relative w-full">
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-4 z-10 text-[#676E6A] dark:text-[#FAF8F5]/60 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              "w-full px-4 py-3.5 bg-[#FAF8F5] dark:bg-[#161A17] text-[#161A17] dark:text-[#FAF8F5] font-sans text-sm outline-none transition-all duration-300 rounded-[0.875rem] border",
              label ? "pt-6 pb-2" : "py-3.5",
              icon ? "pl-11" : "pl-4",
              error
                ? "border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]"
                : focused
                ? "border-[#1C3322] ring-1 ring-[#1C3322] dark:border-[#C9A227] dark:ring-[#C9A227] shadow-ambient-sm"
                : "border-[#E2E6E3] dark:border-[#161A17]/60 hover:border-[#1C3322]/40",
              className
            )}
            {...props}
          />
          {label && (
            <label
              className={cn(
                "absolute pointer-events-none transition-all duration-300 font-sans uppercase tracking-[0.18em] font-semibold text-[10px]",
                icon ? "left-11" : "left-4",
                focused || hasValue || props.placeholder
                  ? "top-2 text-[9px] text-[#1C3322] dark:text-[#C9A227]"
                  : "top-1/2 -translate-y-1/2 text-xs text-[#676E6A]"
              )}
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-[10px] uppercase tracking-[0.15em] text-[#DC2626] font-semibold pl-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";



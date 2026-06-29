"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {label && (
          <label className="block text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full px-4 py-4 pr-10 border bg-card text-foreground font-sans text-xs uppercase tracking-wider outline-hidden transition-all duration-300 appearance-none rounded-none cursor-pointer focus:border-primary",
              error ? "border-destructive" : "border-border hover:border-foreground/30",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-card text-foreground font-sans text-xs">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            <ChevronDown className="w-4 h-4" />
          </div>
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

Select.displayName = "Select";

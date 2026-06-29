"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  checked?: boolean;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, checked, onChange, ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div className="relative">
          <input
            type="radio"
            ref={ref}
            checked={checked}
            onChange={onChange}
            className="sr-only"
            {...props}
          />
          <motion.div
            animate={{
              borderColor: checked ? "var(--color-primary)" : "hsl(var(--border))",
            }}
            className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 bg-transparent",
              className
            )}
          >
            {checked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.15 }}
                className="w-2.5 h-2.5 rounded-full bg-primary"
              />
            )}
          </motion.div>
        </div>
        {label && (
          <span className="font-sans text-xs uppercase tracking-wider text-foreground font-semibold">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Radio.displayName = "Radio";

"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "botanical" | "alabaster" | "gold" | "ghost" | "iconPill" | "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "botanical", size = "md", loading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-sans uppercase tracking-[0.18em] font-semibold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1C3322] disabled:opacity-40 disabled:pointer-events-none cursor-pointer select-none rounded-[0.875rem] active:scale-[0.98]";

    const variants = {
      botanical:
        "bg-[#1C3322] text-[#FAF8F5] hover:bg-[#2D4E35] shadow-ambient-sm hover:shadow-ambient-md border border-transparent hover-lift-luxury",
      alabaster:
        "glass-alabaster text-[#161A17] hover:bg-[#F3EFE8] shadow-ambient-sm border border-[#E2E6E3] hover-lift-luxury",
      gold:
        "bg-[#C9A227] text-[#FAF8F5] hover:bg-[#B59120] shadow-ambient-sm border border-gold-hairline hover-lift-luxury",
      ghost:
        "bg-transparent text-[#161A17] hover:bg-[#F3EFE8] hover:text-[#1C3322] dark:text-[#FAF8F5]",
      iconPill:
        "rounded-full glass-alabaster text-[#161A17] hover:bg-[#1C3322] hover:text-[#FAF8F5] transition-colors p-2.5 shadow-ambient-sm border border-[#E2E6E3]",
      primary: "bg-[#1C3322] text-[#FAF8F5] hover:bg-[#2D4E35] shadow-ambient-sm hover-lift-luxury",
      secondary: "bg-[#F3EFE8] text-[#161A17] hover:bg-[#EADBCE] border border-[#E2E6E3]",
      outline: "border border-[#E2E6E3] bg-transparent text-[#161A17] hover:bg-[#F3EFE8] hover:border-[#1C3322]",
    };

    const sizes = {
      sm: "px-4 py-2 text-[10px] tracking-[0.2em]",
      md: "px-6 py-3 text-xs tracking-[0.18em]",
      lg: "px-8 py-4 text-xs md:text-sm tracking-[0.2em]",
      icon: "p-2.5 text-xs",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        disabled={disabled || loading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";


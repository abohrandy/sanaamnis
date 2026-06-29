"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: "modal" | "drawer";
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  children,
  variant = "modal",
  className,
}: DialogProps) {
  const isDrawer = variant === "drawer";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Dialog Container */}
          <motion.div
            initial={isDrawer ? { x: "100%" } : { opacity: 0, scale: 0.95, y: "-45%", x: "-50%" }}
            animate={isDrawer ? { x: 0 } : { opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
            exit={isDrawer ? { x: "100%" } : { opacity: 0, scale: 0.95, y: "-45%", x: "-50%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className={cn(
              "fixed bg-card border border-border/40 shadow-2xl z-50 flex flex-col rounded-none",
              isDrawer
                ? "right-0 top-0 bottom-0 w-full sm:w-[450px]"
                : "left-1/2 top-1/2 w-[90%] max-w-lg p-6 max-h-[85vh] overflow-y-auto",
              className
            )}
          >
            {/* Header */}
            <div className={cn("flex items-center justify-between pb-4 border-b border-border/20 mb-6", isDrawer && "p-6")}>
              {title ? (
                <h3 className="font-serif text-lg font-medium text-foreground tracking-tight">
                  {title}
                </h3>
              ) : (
                <div />
              )}
              <button onClick={onClose} className="p-2 hover:bg-muted transition-colors rounded-full text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className={cn("flex-1 overflow-y-auto", isDrawer && "px-6 pb-6")}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

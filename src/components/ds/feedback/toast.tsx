"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertTriangle, AlertOctagon, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "warning" | "error" | "info";
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
  className?: string;
}

export function ToastContainer({ toasts, onClose, className }: ToastContainerProps) {
  const icons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertOctagon,
  };

  const borderColors = {
    info: "border-blue-500/30",
    success: "border-green-500/30",
    warning: "border-amber-500/30",
    error: "border-destructive/30",
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-55 flex flex-col gap-3 max-w-sm w-full pointer-events-none", className)}>
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.variant || "info"];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              layout
              className={cn(
                "w-full bg-card border p-4 flex gap-3 shadow-2xl pointer-events-auto items-start rounded-none",
                borderColors[t.variant || "info"]
              )}
            >
              <Icon className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1 space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-sans">
                  {t.title}
                </h4>
                {t.description && (
                  <p className="text-[10px] text-muted-foreground leading-relaxed font-sans font-medium">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => onClose(t.id)}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

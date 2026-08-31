"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center p-12 rounded-[1.5rem] border border-[#E2E6E3] bg-[#FAF8F5] glass-alabaster shadow-ambient-sm my-8"
    >
      <div className="w-16 h-16 rounded-full bg-[#F3EFE8] text-[#1C3322] flex items-center justify-center mb-6 shadow-ambient-sm">
        <Icon className="w-7 h-7 stroke-[1.4]" />
      </div>

      <h3 className="font-serif text-2xl md:text-3xl font-medium text-[#161A17] mb-2 leading-snug">
        {title}
      </h3>

      <p className="text-xs md:text-sm text-[#676E6A] font-sans max-w-md leading-relaxed mb-8">
        {description}
      </p>

      {actionText && actionHref && (
        <Link href={actionHref}>
          <Button variant="botanical" size="md">
            {actionText}
          </Button>
        </Link>
      )}

      {actionText && !actionHref && onAction && (
        <Button variant="botanical" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </motion.div>
  );
}

export function NotFoundState() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-[#FAF8F5]">
      <span className="font-serif text-8xl font-medium text-[#C9A227] mb-2">404</span>
      <h1 className="font-serif text-3xl md:text-5xl font-medium text-[#161A17] mb-4">
        Page Not Found
      </h1>
      <p className="text-xs md:text-sm text-[#676E6A] font-sans max-w-md leading-relaxed mb-8">
        The product or page you are looking for has moved or is no longer available.
      </p>
      <Link href="/">
        <Button variant="botanical" size="lg">
          Return Home
        </Button>
      </Link>
    </div>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  subtitle,
  description,
  badge,
  className,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col p-8 rounded-[1.25rem] border border-[#E2E6E3] bg-[#FAF8F5] glass-alabaster transition-all duration-500 hover:shadow-ambient-md hover-lift-luxury",
        className
      )}
    >
      {/* Icon Badge */}
      <div className="w-12 h-12 rounded-full bg-[#1C3322] text-[#FAF8F5] flex items-center justify-center mb-6 shadow-ambient-sm group-hover:bg-[#C9A227] transition-colors duration-400">
        <Icon className="w-5 h-5" />
      </div>

      {badge && (
        <span className="text-[9px] uppercase tracking-[0.25em] font-sans font-bold text-[#C9A227] mb-2">
          {badge}
        </span>
      )}

      <h3 className="font-serif font-medium text-[#161A17] text-xl md:text-2xl mb-1 leading-snug">
        {title}
      </h3>

      <p className="text-xs uppercase tracking-[0.18em] text-[#676E6A] font-sans font-semibold mb-3">
        {subtitle}
      </p>

      <p className="text-xs text-[#676E6A] font-sans leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

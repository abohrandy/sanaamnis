"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CollectionCardProps {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  imageUrl: string;
  itemCount?: number;
  className?: string;
}

export function CollectionCard({
  id,
  title,
  subtitle,
  slug,
  imageUrl,
  itemCount,
  className,
}: CollectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col aspect-[4/5] rounded-[1.25rem] border border-[#E2E6E3] overflow-hidden bg-[#161A17] transition-all duration-500 hover:shadow-ambient-lg hover-lift-luxury",
        className
      )}
    >
      {/* Background Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover opacity-85 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-95"
      />

      {/* Dark Ambient Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#161A17] via-[#161A17]/40 to-transparent z-10" />

      {/* Top Floating Info */}
      {itemCount !== undefined && (
        <div className="absolute top-6 left-6 z-20">
          <span className="px-3.5 py-1.5 rounded-full glass-obsidian text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-[#FAF8F5]">
            {itemCount} Products
          </span>
        </div>
      )}

      {/* Bottom Editorial Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-sans font-semibold mb-1">
          {subtitle}
        </span>

        <h3 className="font-serif font-medium text-[#FAF8F5] text-2xl md:text-3xl mb-4 leading-snug">
          {title}
        </h3>

        <Link
          href={`/collections/${slug}`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#FAF8F5] font-sans font-semibold group-hover:text-[#C9A227] transition-colors"
        >
          Explore Collection <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}

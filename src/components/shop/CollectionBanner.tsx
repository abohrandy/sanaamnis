"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Leaf } from "lucide-react";

export interface CollectionBannerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  itemCount?: number;
  imageUrl?: string;
}

export function CollectionBanner({
  title = "The Botanical Selection",
  subtitle = "100% COLD-PRESSED ORGANIC FORMULATIONS",
  description = "Explore our unrefined organic coconut elixirs, cold-pressed nectars, and artisanal body formulations sourced directly from local farmers across Nigeria.",
  itemCount,
  // The shop page never passes an image, so this default is what customers
  // actually see — it was a generic Unsplash stock photo unrelated to the brand.
  imageUrl = "/products/range-full-dark.jpg",
}: CollectionBannerProps) {
  return (
    <div className="relative rounded-[2rem] overflow-hidden bg-[#161A17] text-[#FAF8F5] mb-12 border border-gold-hairline shadow-ambient-lg min-h-[360px] flex items-center">
      {/* Background Hero Image */}
      <Image
        src={imageUrl}
        alt=""
        fill
        sizes="100vw"
        priority
        className="object-cover opacity-40 scale-105"
      />

      {/* Gradient Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#161A17] via-[#161A17]/85 to-transparent z-10" />

      {/* Content Inner */}
      <div className="relative z-20 max-w-3xl p-8 md:p-14 space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant="gold">{subtitle}</Badge>
          {itemCount !== undefined && (
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#FAF8F5]/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C9A227]" /> {itemCount} Formulations
            </span>
          )}
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-serif text-3xl md:text-5xl font-medium text-[#FAF8F5] leading-tight"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xs md:text-sm text-[#FAF8F5]/80 font-sans leading-relaxed max-w-2xl"
        >
          {description}
        </motion.p>
      </div>
    </div>
  );
}

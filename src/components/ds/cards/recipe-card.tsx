"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ChefHat, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface RecipeCardProps {
  id: string;
  title: string;
  slug: string;
  prepTime: string;
  difficulty: "Easy" | "Artisanal" | "Master";
  imageUrl: string;
  ingredientsCount: number;
  description: string;
  className?: string;
}

export function RecipeCard({
  id,
  title,
  slug,
  prepTime,
  difficulty,
  imageUrl,
  ingredientsCount,
  description,
  className,
}: RecipeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col rounded-[1.25rem] border border-[#E2E6E3] overflow-hidden bg-[#FAF8F5] transition-all duration-500 hover:shadow-ambient-md hover-lift-luxury",
        className
      )}
    >
      {/* Recipe Photo Frame */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#F3EFE8]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
          <Badge variant="botanical" className="bg-white/80 backdrop-blur-md">
            {difficulty}
          </Badge>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-alabaster text-[10px] font-sans font-semibold uppercase tracking-[0.18em] text-[#161A17]">
            <Clock className="w-3 h-3 text-[#C9A227]" /> {prepTime}
          </div>
        </div>
      </div>

      {/* Editorial Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2 text-[10px] font-sans uppercase tracking-[0.2em] text-[#676E6A]">
          <ChefHat className="w-3.5 h-3.5 text-[#1C3322]" />
          <span>{ingredientsCount} Botanical Ingredients</span>
        </div>

        <Link href={`/recipes/${slug}`} className="group-hover:text-[#1C3322] transition-colors">
          <h3 className="font-serif font-medium text-[#161A17] text-lg md:text-xl mb-2 line-clamp-1 leading-snug">
            {title}
          </h3>
        </Link>

        <p className="text-xs text-[#676E6A] font-sans font-normal leading-relaxed line-clamp-2 mb-6">
          {description}
        </p>

        <div className="mt-auto pt-4 border-t border-[#E2E6E3]/60 flex items-center justify-between">
          <span className="text-xs font-serif italic text-[#8C531B]">
            Botanical Culinary Guide
          </span>
          <Link
            href={`/recipes/${slug}`}
            className="w-8 h-8 rounded-full bg-[#F3EFE8] text-[#161A17] group-hover:bg-[#1C3322] group-hover:text-[#FAF8F5] transition-colors flex items-center justify-center"
            aria-label={`View recipe: ${title}`}
          >
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  date: string;
  imageUrl: string;
  className?: string;
}

export function BlogCard({
  title,
  excerpt,
  slug,
  category,
  date,
  imageUrl,
  className,
}: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "group flex flex-col border border-border/40 overflow-hidden bg-card transition-all duration-300 hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 bg-card/90 text-foreground text-[8px] uppercase tracking-widest font-bold px-3 py-1.5 backdrop-blur-xs">
          {category}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">
          {date}
        </span>
        <h3 className="font-serif text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-muted-foreground text-xs leading-relaxed mb-6 font-sans line-clamp-3">
          {excerpt}
        </p>

        <Link
          href={`/journal/${slug}`}
          className="mt-auto text-[10px] uppercase tracking-widest text-foreground hover:text-primary transition-colors font-bold flex items-center gap-1.5"
        >
          Read Journal Entry <span className="transform translate-x-0 group-hover:translate-x-1 duration-200">→</span>
        </Link>
      </div>
    </motion.article>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  name: string;
  slug: string;
  count?: number;
  imageUrl: string;
  className?: string;
}

export function CategoryCard({ name, slug, count, imageUrl, className }: CategoryCardProps) {
  return (
    <Link
      href={`/catalog?category=${slug}`}
      className={cn(
        "group relative block aspect-[4/5] overflow-hidden border border-border/40 bg-neutral-900",
        className
      )}
    >
      {/* Background Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-full object-cover scale-100 transition-transform duration-1000 group-hover:scale-105 filter brightness-75 group-hover:brightness-50"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

      {/* Meta Text */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 text-white">
        <span className="text-[9px] uppercase tracking-[0.25em] text-amber-300 font-bold mb-1">
          Collection
        </span>
        <h3 className="font-serif text-2xl font-semibold tracking-tight mb-2">
          {name}
        </h3>
        {count !== undefined && (
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium font-sans">
            {count} pieces
          </span>
        )}
      </div>
    </Link>
  );
}

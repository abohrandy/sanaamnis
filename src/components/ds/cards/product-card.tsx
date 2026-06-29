"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  imageUrl: string;
  className?: string;
  onAddToCart?: () => void;
}

export function ProductCard({
  id,
  title,
  slug,
  category,
  price,
  imageUrl,
  className,
  onAddToCart,
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        "group flex flex-col border border-border/40 overflow-hidden bg-card transition-all duration-300 hover:shadow-xl",
        className
      )}
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Floating actions container */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
          <Link
            href={`/products/${slug}`}
            className="p-3 bg-white text-neutral-900 hover:bg-neutral-100 transition-colors shadow-lg hover:scale-105 transform duration-200"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          {onAddToCart && (
            <button
              onClick={onAddToCart}
              className="p-3 bg-primary text-primary-foreground hover:bg-primary/95 transition-colors shadow-lg hover:scale-105 transform duration-200"
              title="Add to Selection"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Meta Content */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 font-sans font-bold">
          {category}
        </span>
        <h3 className="font-sans font-medium text-foreground text-sm mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {title}
        </h3>
        <div className="mt-auto pt-4 border-t border-border/20 flex items-center justify-between">
          <span className="font-serif font-bold text-primary text-sm">
            ₦{price.toLocaleString()}
          </span>
          <Link
            href={`/products/${slug}`}
            className="text-[10px] uppercase tracking-widest text-foreground hover:text-primary transition-colors font-bold flex items-center gap-1"
          >
            Explore <span className="transform translate-x-0 group-hover:translate-x-1 duration-200">→</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Eye, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  imageUrl: string;
  tagline?: string;
  badgeText?: string;
  className?: string;
  isWishlisted?: boolean;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
}

export function ProductCard({
  id,
  title,
  slug,
  category,
  price,
  imageUrl,
  tagline,
  badgeText = "ORGANIC",
  className,
  isWishlisted = false,
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
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
      {/* Top Floating Badge & Wishlist */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <Badge variant="gold" size="sm" className="pointer-events-auto shadow-ambient-sm">
          {badgeText}
        </Badge>
        {onToggleWishlist && (
          <button
            onClick={onToggleWishlist}
            aria-label="Add to wishlist"
            className={cn(
              "p-2.5 rounded-full glass-alabaster transition-all duration-300 pointer-events-auto shadow-ambient-sm hover:scale-110 cursor-pointer",
              isWishlisted ? "text-[#C9A227]" : "text-[#161A17] hover:text-[#C9A227]"
            )}
          >
            <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
          </button>
        )}
      </div>

      {/* Image Frame */}
      <Link href={`/products/${slug}`} className="relative aspect-[4/5] overflow-hidden bg-[#F3EFE8] block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Hover Quick Action Backdrop Overlay */}
        <div className="absolute inset-0 bg-[#161A17]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4 z-10">
          <div className="flex items-center gap-3 w-full">
            <Link href={`/products/${slug}`} className="flex-1">
              <Button variant="alabaster" size="sm" className="w-full flex items-center justify-center gap-2 text-[10px]">
                <Eye className="w-3.5 h-3.5" /> Quick View
              </Button>
            </Link>
            {onAddToCart && (
              <Button
                variant="botanical"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart();
                }}
                className="flex items-center justify-center gap-2 text-[10px]"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Add
              </Button>
            )}
          </div>
        </div>

      </Link>

      {/* Editorial Content */}
      <div className="p-6 flex flex-col flex-1 bg-[#FAF8F5]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#676E6A] font-sans font-semibold">
            {category}
          </span>
        </div>

        <Link href={`/products/${slug}`} className="group-hover:text-[#1C3322] transition-colors">
          <h3 className="font-serif font-medium text-[#161A17] text-base md:text-lg mb-1 line-clamp-1 leading-snug">
            {title}
          </h3>
        </Link>

        {tagline && (
          <p className="text-xs text-[#676E6A] font-sans font-normal line-clamp-1 mb-4 italic">
            {tagline}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-[#E2E6E3]/60 flex items-center justify-between">
          <span className="font-serif font-bold text-[#1C3322] text-base">
            ₦{price.toLocaleString()}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#161A17] group-hover:text-[#C9A227] transition-colors font-semibold flex items-center gap-1">
            Discover <span className="transform translate-x-0 group-hover:translate-x-1 duration-300">→</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}



"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ShoppingBag, Heart, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  categoryOrFallback,
  formatNaira,
  startingPrice,
  type CatalogProduct,
} from "@/lib/catalog";
import { useCartStore } from "@/store/cartStore";

export interface ProductCardProps {
  product: CatalogProduct;
  className?: string;
  /** Set on the first row of a grid so those images are not lazy-loaded. */
  priority?: boolean;
  /** Passed to next/image; tune per grid so the browser fetches the right size. */
  sizes?: string;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: CatalogProduct) => void;
  /** Hide the quick-add control where it does not belong, e.g. tight related grids. */
  showQuickAdd?: boolean;
}

export function ProductCard({
  product,
  className,
  priority = false,
  sizes = "(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 320px",
  isWishlisted = false,
  onToggleWishlist,
  showQuickAdd = true,
}: ProductCardProps) {
  const reduceMotion = useReducedMotion();
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = React.useState(false);

  const image = product.images[0] ?? "/products/placeholder.jpg";
  const category = categoryOrFallback(product.categorySlug);
  const from = startingPrice(product);
  const hasChoices = product.variants.length > 1;
  const soldOut = product.variants.every((v) => v.stock <= 0);

  /**
   * Quick-add only makes sense for single-variant products. Anything with a size
   * choice sends the customer to the product page rather than guessing for them.
   */
  const canQuickAdd = showQuickAdd && !hasChoices && !soldOut;

  const handleQuickAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const variant = product.variants[0];
    if (!variant) return;
    addItem({
      variantId: variant.id,
      productId: product.id,
      sku: variant.sku,
      name: variant.name,
      title: product.title,
      price: variant.price,
      stock: variant.stock,
      imageUrl: variant.imageUrl || image,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col rounded-[1.25rem] border border-[#E2E6E3] overflow-hidden bg-[#FAF8F5] transition-all duration-500 hover:shadow-ambient-md hover-lift-luxury",
        className
      )}
    >
      <div className="absolute top-4 left-4 right-4 z-20 flex items-start justify-between gap-2 pointer-events-none">
        {product.badge ? (
          <Badge variant="gold" size="sm" className="shadow-ambient-sm">
            {product.badge}
          </Badge>
        ) : (
          <span />
        )}

        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist(product);
            }}
            aria-label={
              isWishlisted
                ? `Remove ${product.title} from wishlist`
                : `Save ${product.title} to wishlist`
            }
            aria-pressed={isWishlisted}
            className={cn(
              "p-2.5 rounded-full glass-alabaster transition-all duration-300 pointer-events-auto shadow-ambient-sm hover:scale-110 cursor-pointer",
              isWishlisted ? "text-[#C9A227]" : "text-[#161A17] hover:text-[#C9A227]"
            )}
          >
            <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
          </button>
        )}
      </div>

      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/5] overflow-hidden bg-[#F3EFE8] block"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={image}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />

        {soldOut && (
          <div className="absolute inset-0 bg-[#FAF8F5]/70 flex items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1C3322] bg-[#FAF8F5] px-4 py-2 rounded-full border border-[#E2E6E3]">
              Sold Out
            </span>
          </div>
        )}

        {canQuickAdd && (
          <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 focus-within:opacity-100 focus-within:translate-y-0 transition-all duration-300 pointer-events-none">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="w-full pointer-events-auto flex items-center justify-center gap-2 py-3 rounded-[0.5rem] bg-[#1C3322] text-[#FAF8F5] text-[10px] font-bold uppercase tracking-[0.18em] hover:bg-[#2D4E35] transition-colors cursor-pointer shadow-ambient-md"
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#C9A227]" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
                </>
              )}
            </button>
          </div>
        )}
      </Link>

      <div className="p-5 md:p-6 flex flex-col flex-1">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#676E6A] font-sans font-semibold mb-1.5">
          {category.name}
        </span>

        <h3 className="font-serif font-medium text-[#161A17] text-base md:text-lg leading-snug mb-1">
          <Link
            href={`/products/${product.slug}`}
            className="transition-colors hover:text-[#1C3322] focus-visible:outline-none focus-visible:underline underline-offset-4"
          >
            {/* Stretches the link over the whole card without nesting anchors. */}
            <span className="absolute inset-0 z-10" aria-hidden="true" />
            {product.title}
          </Link>
        </h3>

        {product.tagline && (
          <p className="text-xs text-[#676E6A] font-sans leading-relaxed line-clamp-2 mb-4">
            {product.tagline}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-[#E2E6E3]/70 flex items-baseline justify-between gap-2">
          <span className="font-serif font-semibold text-[#1C3322] text-base">
            {hasChoices && (
              <span className="text-[10px] uppercase tracking-[0.15em] text-[#676E6A] font-sans font-semibold mr-1.5">
                From
              </span>
            )}
            {formatNaira(from)}
          </span>

          {hasChoices && (
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#676E6A] font-semibold">
              {product.variants.length} sizes
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

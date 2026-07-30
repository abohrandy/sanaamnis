"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/ds/cards/product-card";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlistStore";
import { useHydrated } from "@/hooks/useHydratedStore";
import { CATALOG, CATEGORIES, startingPrice } from "@/lib/catalog";
import { ProductCardSkeleton } from "@/components/ui/skeleton";

export interface WishlistGridProps {
  columns?: 2 | 3 | 4;
  emptyTitle?: string;
  emptyBody?: string;
}

/**
 * Renders saved items from the wishlist store.
 *
 * Shared by the account page, the wishlist page and the header drawer so all three
 * show the same thing — they used to each render their own hardcoded list.
 */
export function WishlistGrid({
  columns = 3,
  emptyTitle = "Nothing saved yet",
  emptyBody = "Tap the heart on any product to keep it here for later.",
}: WishlistGridProps) {
  const hydrated = useHydrated();
  const items = useWishlistStore((s) => s.items);
  const toggle = useWishlistStore((s) => s.toggle);

  const gridClass =
    columns === 4
      ? "lg:grid-cols-4"
      : columns === 3
        ? "lg:grid-cols-3"
        : "lg:grid-cols-2";

  // Before hydration the persisted store is empty, which would flash the empty
  // state at anyone who does have saved items.
  if (!hydrated) {
    return (
      <div className={`grid grid-cols-2 gap-4 md:gap-6 ${gridClass}`}>
        {Array.from({ length: columns }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Resolve against the catalog so saved items always reflect current pricing and
  // never resurrect a product that has since been withdrawn.
  const products = items
    .map((item) => CATALOG.find((p) => p.slug === item.slug))
    .filter(Boolean) as typeof CATALOG;

  if (products.length === 0) {
    return (
      <div className="py-16 px-8 text-center rounded-[1.5rem] border border-dashed border-[#E2E6E3] bg-[#F3EFE8]/40 space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#E2E6E3] flex items-center justify-center mx-auto">
          <Heart className="w-6 h-6 text-[#676E6A] stroke-[1.4]" />
        </div>
        <h3 className="font-serif text-xl font-medium text-[#161A17]">{emptyTitle}</h3>
        <p className="text-xs text-[#676E6A] max-w-sm mx-auto leading-relaxed">{emptyBody}</p>
        <Link href="/shop" className="inline-block pt-1">
          <Button variant="botanical" size="md">
            Browse products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 gap-4 md:gap-6 ${gridClass}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isWishlisted
          sizes="(max-width: 768px) 50vw, 320px"
          onToggleWishlist={(p) =>
            toggle({
              productId: p.id,
              slug: p.slug,
              title: p.title,
              price: startingPrice(p),
              imageUrl: p.images[0],
              categoryName: CATEGORIES[p.categorySlug].name,
            })
          }
        />
      ))}
    </div>
  );
}

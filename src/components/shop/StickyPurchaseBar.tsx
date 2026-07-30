"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { formatNaira, type CatalogProduct, type CatalogVariant } from "@/lib/catalog";

export interface StickyPurchaseBarProps {
  product: CatalogProduct;
  /** Mirrors the variant selected in the main buy panel. */
  variant?: CatalogVariant;
  isVisible: boolean;
}

/**
 * Appears once the main buy panel scrolls out of view, so price and add-to-bag
 * stay reachable down a long product page.
 */
export function StickyPurchaseBar({ product, variant, isVisible }: StickyPurchaseBarProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  if (!variant) return null;

  const image = variant.imageUrl || product.images[0] || "/products/placeholder.jpg";
  const soldOut = variant.stock <= 0;

  const handleAdd = () => {
    if (soldOut) return;
    addItem({
      variantId: variant.id,
      productId: product.id,
      sku: variant.sku,
      name: variant.name,
      title: product.title,
      price: variant.price,
      stock: variant.stock,
      imageUrl: image,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 inset-x-0 z-40 glass-alabaster border-t border-[#E2E6E3] shadow-ambient-lg"
        >
          <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-11 h-11 rounded-[0.5rem] overflow-hidden bg-[#F3EFE8] shrink-0 border border-[#E2E6E3] hidden sm:block">
                <Image src={image} alt="" fill sizes="44px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="font-serif text-sm font-medium text-[#161A17] truncate">
                  {product.title}
                </p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#676E6A] font-semibold truncate">
                  {variant.name} ·{" "}
                  <span className="text-[#1C3322] font-bold">{formatNaira(variant.price)}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {added && (
                <Link
                  href="/cart"
                  className="hidden sm:inline text-[11px] font-bold uppercase tracking-[0.14em] text-[#1C3322] underline underline-offset-4 hover:text-[#C9A227] transition-colors"
                >
                  View bag
                </Link>
              )}
              <Button
                variant="botanical"
                size="md"
                type="button"
                disabled={soldOut}
                onClick={handleAdd}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                {added ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#C9A227]" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {soldOut ? "Sold Out" : "Add to Bag"}
                    </span>
                    <span className="sm:hidden">{soldOut ? "Sold Out" : "Add"}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useHydrated } from "@/hooks/useHydratedStore";
import { CATALOG, formatNaira } from "@/lib/catalog";

export interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Saved items panel.
 *
 * Reads the shared store directly. It previously took an `items` prop that the
 * header never passed, so the drawer was permanently empty no matter what a
 * customer had saved.
 */
export function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const hydrated = useHydrated();
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);

  // Stop the page behind the drawer from scrolling while it is open.
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const saved = hydrated ? items : [];

  const moveToBag = (slug: string, productId: string) => {
    const product = CATALOG.find((p) => p.slug === slug);
    const variant = product?.variants.find((v) => v.stock > 0) ?? product?.variants[0];
    if (!product || !variant) return;

    addItem({
      variantId: variant.id,
      productId: product.id,
      sku: variant.sku,
      name: variant.name,
      title: product.title,
      price: variant.price,
      stock: variant.stock,
      imageUrl: variant.imageUrl || product.images[0],
    });
    remove(productId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#161A17]/60 backdrop-blur-sm z-50 cursor-pointer"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Saved items"
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FAF8F5] z-50 flex flex-col shadow-ambient-lg border-l border-[#E2E6E3]"
          >
            <header className="flex items-center justify-between px-6 py-5 border-b border-[#E2E6E3]">
              <h2 className="font-serif text-lg font-medium text-[#161A17] flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#C9A227]" aria-hidden="true" />
                Saved items
                {saved.length > 0 && (
                  <span className="text-[10px] font-sans font-bold text-[#676E6A]">
                    ({saved.length})
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close saved items"
                className="p-2 rounded-full hover:bg-[#F3EFE8] text-[#161A17] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {saved.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#F3EFE8] border border-[#E2E6E3] flex items-center justify-center">
                  <Heart className="w-6 h-6 text-[#676E6A] stroke-[1.4]" aria-hidden="true" />
                </div>
                <p className="text-sm text-[#676E6A] leading-relaxed max-w-xs">
                  Nothing saved yet. Tap the heart on any product to keep it here.
                </p>
                <Link href="/shop" onClick={onClose}>
                  <Button variant="botanical" size="md">
                    Browse products
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                  {saved.map((item) => (
                    <li
                      key={item.productId}
                      className="flex gap-4 pb-4 border-b border-[#E2E6E3]/70 last:border-0"
                    >
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={onClose}
                        className="relative w-20 h-24 rounded-[0.6rem] overflow-hidden bg-[#F3EFE8] border border-[#E2E6E3] shrink-0"
                      >
                        <Image
                          src={item.imageUrl}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </Link>

                      <div className="flex-1 min-w-0 flex flex-col">
                        <span className="text-[10px] uppercase tracking-[0.16em] text-[#676E6A] font-semibold">
                          {item.categoryName}
                        </span>
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={onClose}
                          className="font-serif text-sm font-medium text-[#161A17] hover:text-[#1C3322] transition-colors line-clamp-2"
                        >
                          {item.title}
                        </Link>
                        <span className="font-serif text-sm font-semibold text-[#1C3322] mt-1">
                          {formatNaira(item.price)}
                        </span>

                        <div className="mt-auto pt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => moveToBag(item.slug, item.productId)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-[0.5rem] bg-[#1C3322] text-[#FAF8F5] text-[10px] font-bold uppercase tracking-[0.14em] hover:bg-[#2D4E35] transition-colors cursor-pointer"
                          >
                            <ShoppingBag className="w-3 h-3" /> Add to cart
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(item.productId)}
                            aria-label={`Remove ${item.title} from saved items`}
                            className="p-2 rounded-[0.5rem] border border-[#E2E6E3] text-[#676E6A] hover:text-[#8C531B] hover:border-[#8C531B]/40 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="px-6 py-5 border-t border-[#E2E6E3]">
                  <Link href="/wishlist" onClick={onClose} className="block">
                    <Button variant="alabaster" size="lg" className="w-full">
                      View all saved items
                    </Button>
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatNaira, type CatalogProduct, type CatalogVariant } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductInteractiveFormProps {
  product: CatalogProduct;
  /** Notifies the parent so the sticky bar can mirror the chosen variant. */
  onVariantChange?: (variant: CatalogVariant) => void;
}

const LOW_STOCK_THRESHOLD = 10;

export default function ProductInteractiveForm({
  product,
  onVariantChange,
}: ProductInteractiveFormProps) {
  const inStockFirst =
    product.variants.find((v) => v.stock > 0) ?? product.variants[0];

  const [selected, setSelected] = useState<CatalogVariant | undefined>(inStockFirst);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  if (!selected) {
    return (
      <div className="p-5 rounded-[0.875rem] bg-[#F3EFE8] border border-[#E2E6E3] text-xs uppercase tracking-[0.18em] text-[#676E6A] text-center font-semibold">
        Currently Unavailable
      </div>
    );
  }

  const soldOut = selected.stock <= 0;
  const maxQuantity = Math.max(1, selected.stock);

  const pick = (variant: CatalogVariant) => {
    setSelected(variant);
    setQuantity(1);
    onVariantChange?.(variant);
  };

  const handleAddToCart = () => {
    if (soldOut) return;
    addItem(
      {
        variantId: selected.id,
        productId: product.id,
        sku: selected.sku,
        name: selected.name,
        title: product.title,
        price: selected.price,
        stock: selected.stock,
        imageUrl: selected.imageUrl || product.images[0],
      },
      quantity
    );
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2600);
  };

  return (
    <div className="space-y-7">
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-3xl md:text-4xl font-semibold text-[#1C3322]">
          {formatNaira(selected.price)}
        </span>
        {product.variants.length > 1 && (
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#676E6A] font-semibold">
            {selected.name}
          </span>
        )}
      </div>

      {product.variants.length > 1 && (
        <fieldset className="space-y-3">
          <legend className="text-[10px] uppercase tracking-[0.2em] text-[#676E6A] font-bold mb-3">
            Choose a size
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((variant) => {
              const isActive = selected.id === variant.id;
              const unavailable = variant.stock <= 0;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => pick(variant)}
                  disabled={unavailable}
                  aria-pressed={isActive}
                  className={cn(
                    "px-4 py-2.5 rounded-[0.5rem] text-[11px] font-semibold uppercase tracking-[0.12em] border transition-all duration-300 cursor-pointer",
                    isActive
                      ? "border-[#1C3322] bg-[#1C3322] text-[#FAF8F5] shadow-ambient-sm"
                      : "border-[#E2E6E3] text-[#161A17] hover:border-[#1C3322]",
                    unavailable &&
                      "opacity-40 cursor-not-allowed line-through hover:border-[#E2E6E3]"
                  )}
                >
                  {variant.name}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-[0.5rem] border border-[#E2E6E3] overflow-hidden">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || soldOut}
            aria-label="Decrease quantity"
            className="p-3 hover:bg-[#F3EFE8] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-sans text-sm font-bold tabular-nums" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
            disabled={quantity >= maxQuantity || soldOut}
            aria-label="Increase quantity"
            className="p-3 hover:bg-[#F3EFE8] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <span className="text-[11px] font-sans text-[#676E6A]">
          {soldOut ? (
            <span className="text-[#8C531B] font-semibold uppercase tracking-[0.12em]">
              Sold out
            </span>
          ) : selected.stock <= LOW_STOCK_THRESHOLD ? (
            <span className="text-[#8C531B] font-semibold">
              Only {selected.stock} left
            </span>
          ) : (
            <span className="text-[#1C3322] font-semibold">In stock</span>
          )}
        </span>
      </div>

      <div className="space-y-3">
        <Button
          variant="botanical"
          size="lg"
          type="button"
          disabled={soldOut}
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2.5"
        >
          <ShoppingBag className="w-4 h-4" />
          {soldOut ? "Sold Out" : `Add to Bag — ${formatNaira(selected.price * quantity)}`}
        </Button>

        <AnimatePresence>
          {justAdded && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              role="status"
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-[0.5rem] bg-[#1C3322]/5 border border-[#1C3322]/15"
            >
              <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1C3322]">
                <Check className="w-3.5 h-3.5 text-[#C9A227]" />
                Added to your bag
              </span>
              <Link
                href="/cart"
                className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1C3322] underline underline-offset-4 hover:text-[#C9A227] transition-colors"
              >
                View bag
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

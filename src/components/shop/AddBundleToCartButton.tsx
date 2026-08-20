"use client";

import React, { useState } from "react";
import { ShoppingBag, Check, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import type { Bundle } from "@/lib/bundles";

export interface AddBundleToCartButtonProps {
  bundle: Bundle;
}

export function AddBundleToCartButton({ bundle }: AddBundleToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addBundle = useCartStore((state) => state.addBundle);

  const handleAdd = () => {
    addBundle(
      {
        bundleId: bundle.id,
        slug: bundle.slug,
        title: bundle.title,
        price: bundle.price,
        imageUrl: bundle.heroImageUrl,
        items: bundle.items.map((item) => ({
          variantId: item.variantId,
          sku: item.sku,
          productTitle: item.productTitle,
          variantName: item.variantName,
          quantity: item.quantity,
        })),
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border border-[#E2E6E3] rounded-[0.5rem] bg-[#FAF8F5] overflow-hidden shrink-0">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="p-3 hover:bg-[#F3EFE8] text-[#161A17] transition-colors cursor-pointer"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="px-3 text-sm font-bold text-[#161A17] tabular-nums">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="p-3 hover:bg-[#F3EFE8] text-[#161A17] transition-colors cursor-pointer"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <Button variant="botanical" size="lg" onClick={handleAdd} className="flex-1 flex items-center justify-center gap-2">
        {justAdded ? (
          <>
            <Check className="w-4 h-4" /> Added to cart
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" /> Add bundle to cart
          </>
        )}
      </Button>
    </div>
  );
}

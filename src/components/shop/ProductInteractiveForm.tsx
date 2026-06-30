"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Variant {
  id: string;
  sku: string;
  name: string;
  price: string;
  stock: number;
  imageUrl?: string | null;
}

interface ProductInteractiveFormProps {
  productId: string;
  productTitle: string;
  variants: Variant[];
  categoryName: string;
}

export default function ProductInteractiveForm({
  productId,
  productTitle,
  variants,
  categoryName,
}: ProductInteractiveFormProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(variants[0] || {});
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  if (!variants || variants.length === 0) {
    return (
      <div className="p-4 bg-muted border border-border text-xs uppercase tracking-widest text-muted-foreground text-center">
        Out of Stock
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      variantId: selectedVariant.id,
      productId,
      sku: selectedVariant.sku,
      name: selectedVariant.name,
      title: productTitle,
      price: Number(selectedVariant.price),
      stock: selectedVariant.stock,
      imageUrl: selectedVariant.imageUrl || undefined,
    }, quantity);
  };

  return (
    <div className="space-y-8">
      {/* Price */}
      <div>
        <span className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">Price</span>
        <span className="font-serif text-3xl font-semibold text-primary">
          ₦{Number(selectedVariant.price || 0).toLocaleString()}
        </span>
      </div>

      {/* Variants List */}
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-widest text-muted-foreground block font-semibold">
          Select Variant
        </span>
        <div className="flex flex-wrap gap-3">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                setSelectedVariant(v);
                setQuantity(1); // reset qty on variant change
              }}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider border transition-all duration-300 ${
                selectedVariant.id === v.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-foreground text-foreground"
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stock warning */}
      <div className="text-xs text-muted-foreground font-medium">
        {selectedVariant.stock > 0 ? (
          <span>Availability: <span className="text-green-600 font-bold">{selectedVariant.stock} items in stock</span></span>
        ) : (
          <span className="text-red-500 font-bold">Sold Out</span>
        )}
      </div>

      {/* Quantity adjustment */}
      {selectedVariant.stock > 0 && (
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-widest text-muted-foreground block font-semibold">
            Quantity
          </span>
          <div className="flex items-center border border-border w-32">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-3 hover:bg-muted transition-colors flex-1 text-center"
            >
              -
            </button>
            <span className="font-sans text-sm font-bold flex-1 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))}
              className="p-3 hover:bg-muted transition-colors flex-1 text-center"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Action CTA */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        disabled={selectedVariant.stock <= 0}
        onClick={handleAddToCart}
        className="w-full py-4 bg-primary text-primary-foreground font-semibold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-primary/95 transition-all duration-300 shadow-xl disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed"
      >
        <ShoppingBag className="w-4 h-4" />
        Add to Cart
      </motion.button>
    </div>
  );
}

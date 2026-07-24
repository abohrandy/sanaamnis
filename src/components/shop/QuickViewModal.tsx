"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Heart, ShieldCheck, Sparkles, Plus, Minus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cartStore";

export interface QuickViewModalProps {
  product: {
    id: string;
    title: string;
    slug: string;
    category: string | { id: string; name: string };
    price: number;
    imageUrl: string;
    description?: string;
    variants?: Array<{
      id: string;
      name: string;
      price: number;
      stock: number;
    }>;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleWishlist?: (id: string) => void;
  isWishlisted?: boolean;
}


export function QuickViewModal({
  product,
  isOpen,
  onClose,
  onToggleWishlist,
  isWishlisted = false,
}: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const currentVariant = product.variants?.[selectedVariantIndex] || {
    id: product.id,
    name: "Standard 250ml",
    price: product.price,
    stock: 50,
  };

  const handleAddToCart = () => {
    addItem({
      variantId: currentVariant.id,
      productId: product.id,
      sku: product.slug,
      name: currentVariant.name,
      title: product.title,
      price: currentVariant.price,
      imageUrl: product.imageUrl,
      stock: currentVariant.stock || 50,
    }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#161A17]/70 backdrop-blur-md z-50 cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-y-auto px-4 z-50"
          >
            <div className="rounded-[1.5rem] border border-[#E2E6E3] bg-[#FAF8F5] glass-alabaster shadow-ambient-lg p-6 md:p-10 relative grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2.5 rounded-full hover:bg-[#F3EFE8] text-[#161A17] transition-colors z-20"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Product Photo Frame */}
              <div className="md:col-span-6 relative aspect-[4/5] rounded-[1.25rem] overflow-hidden bg-[#F3EFE8] border border-[#E2E6E3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="gold">ORGANIC CERTIFIED</Badge>
                </div>
              </div>

              {/* Editorial Product Detail Actions */}
              <div className="md:col-span-6 flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-[10px] font-sans uppercase font-bold tracking-[0.2em] text-[#676E6A] block mb-1">
                    {typeof product.category === "object" ? product.category.name : product.category}
                  </span>


                  <h2 className="font-serif text-2xl md:text-3xl font-medium text-[#161A17] mb-2 leading-snug">
                    {product.title}
                  </h2>

                  <span className="font-serif text-2xl font-bold text-[#1C3322] block mb-4">
                    ₦{currentVariant.price.toLocaleString()}
                  </span>

                  <p className="text-xs text-[#676E6A] font-sans leading-relaxed line-clamp-3 mb-6">
                    {product.description ||
                      "Cold-pressed zero-heat extraction harvested from organic Badagry coconut palms. Preserves 100% of fatty acid polyphenols and natural lauric hydration."}
                  </p>

                  {/* Variants Selection */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="mb-6">
                      <span className="text-[10px] font-sans uppercase font-bold tracking-[0.18em] text-[#161A17] block mb-2">
                        Select Volume Size:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((variant, idx) => (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariantIndex(idx)}
                            className={`px-3.5 py-2 rounded-[0.5rem] text-xs font-sans font-semibold transition-all duration-200 border cursor-pointer ${
                              selectedVariantIndex === idx
                                ? "bg-[#1C3322] text-[#FAF8F5] border-transparent shadow-ambient-sm"
                                : "bg-[#F3EFE8] text-[#161A17] border-[#E2E6E3] hover:bg-[#EAE4D9]"
                            }`}
                          >
                            {variant.name} — ₦{variant.price.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Counter */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[10px] font-sans uppercase font-bold tracking-[0.18em] text-[#161A17]">
                      Quantity:
                    </span>
                    <div className="flex items-center rounded-[0.5rem] border border-[#E2E6E3] bg-[#FAF8F5] overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-[#F3EFE8] text-[#161A17] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 text-xs font-sans font-bold text-[#161A17]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-[#F3EFE8] text-[#161A17] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Purchase Actions */}
                <div className="space-y-3 pt-4 border-t border-[#E2E6E3]/60">
                  <div className="flex items-center gap-3">
                    <Button
                      variant={added ? "gold" : "botanical"}
                      size="lg"
                      className="flex-1 py-4 text-xs"
                      onClick={handleAddToCart}
                    >
                      {added ? (
                        <span className="flex items-center gap-2">
                          <Check className="w-4 h-4" /> Added To Selection
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4" /> Reserve Formula
                        </span>
                      )}
                    </Button>

                    {onToggleWishlist && (
                      <button
                        onClick={() => onToggleWishlist(product.id)}
                        className={`p-3.5 rounded-[0.5rem] border border-[#E2E6E3] glass-alabaster transition-colors ${
                          isWishlisted ? "text-[#C9A227]" : "text-[#161A17] hover:text-[#C9A227]"
                        }`}
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                      </button>
                    )}
                  </div>

                  <p className="text-[10px] font-sans uppercase tracking-[0.15em] text-[#676E6A] text-center flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" /> Encrypted Checkout & 100% Quality Assurance
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items?: Array<{
    id: string;
    title: string;
    slug: string;
    price: number;
    imageUrl: string;
  }>;
  onRemoveItem?: (id: string) => void;
  onAddToCart?: (item: any) => void;
}

export function WishlistDrawer({
  isOpen,
  onClose,
  items = [],
  onRemoveItem,
  onAddToCart,
}: WishlistDrawerProps) {
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
            className="fixed inset-0 bg-[#161A17]/60 backdrop-blur-sm z-50 cursor-pointer"
          />

          {/* Wishlist Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[460px] bg-[#FAF8F5] border-l border-[#E2E6E3] z-50 flex flex-col shadow-ambient-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E2E6E3]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#C9A227]/20 text-[#8C531B] flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#161A17]">Your Wishlist</h3>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#676E6A]">
                    {items.length} Saved {items.length === 1 ? "Formula" : "Formulas"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 rounded-full hover:bg-[#F3EFE8] text-[#161A17] transition-colors"
                aria-label="Close wishlist drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#F3EFE8] flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-[#676E6A] stroke-[1.2]" />
                  </div>
                  <h4 className="font-serif text-lg font-medium text-[#161A17] mb-1">No Saved Elixirs</h4>
                  <p className="text-xs text-[#676E6A] font-sans max-w-[240px] mb-6 leading-relaxed">
                    Save your favorite organic formulas to build your personalized daily wellness routine.
                  </p>
                  <Button variant="botanical" size="md" onClick={onClose}>
                    Discover Products
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-6 border-b border-[#E2E6E3] last:border-0"
                  >
                    <div className="w-20 h-24 rounded-[0.75rem] bg-[#F3EFE8] overflow-hidden border border-[#E2E6E3] shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif font-medium text-[#161A17] text-sm mb-1">
                          {item.title}
                        </h4>
                        <span className="font-serif font-bold text-[#1C3322] text-sm">
                          ₦{item.price.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {onAddToCart && (
                          <button
                            onClick={() => onAddToCart(item)}
                            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] font-sans font-bold text-[#1C3322] hover:text-[#C9A227] transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                          </button>
                        )}
                        {onRemoveItem && (
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-[#676E6A] hover:text-[#DC2626] transition-colors p-1"
                            aria-label="Remove item from wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

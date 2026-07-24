"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface StickyPurchaseBarProps {
  title: string;
  price: number;
  imageUrl: string;
  selectedVariantName?: string;
  onAddToCart: () => void;
  isVisible: boolean;
}

export function StickyPurchaseBar({
  title,
  price,
  imageUrl,
  selectedVariantName = "Standard 250ml",
  onAddToCart,
  isVisible,
}: StickyPurchaseBarProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5] border-t border-[#E2E6E3] glass-alabaster shadow-ambient-lg p-4"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Product Meta */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-[0.5rem] bg-[#F3EFE8] border border-[#E2E6E3] overflow-hidden shrink-0 hidden sm:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
              </div>
              <div className="truncate">
                <h4 className="font-serif font-medium text-sm text-[#161A17] truncate">
                  {title}
                </h4>
                <p className="text-[10px] font-sans uppercase tracking-[0.18em] text-[#676E6A] truncate">
                  {selectedVariantName} — <span className="font-bold text-[#1C3322]">₦{price.toLocaleString()}</span>
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="botanical"
                size="md"
                onClick={onAddToCart}
                className="py-3 px-6 text-xs flex items-center gap-2 shadow-ambient-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Reserve Formula
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

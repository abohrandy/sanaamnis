"use client";

import React from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useHydrated } from "@/hooks/useHydratedStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const isHydrated = useHydrated();
  const rawItems = useCartStore((state) => state.items);
  const items = isHydrated ? rawItems : [];
  const rawBundles = useCartStore((state) => state.bundles);
  const bundles = isHydrated ? rawBundles : [];
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateBundleQuantity = useCartStore((state) => state.updateBundleQuantity);
  const removeBundle = useCartStore((state) => state.removeBundle);
  const totalAmount = useCartStore((state) => state.getTotalAmount)();
  const hasContent = items.length > 0 || bundles.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Ambient Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#161A17]/60 backdrop-blur-md z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-[#FAF8F5] border-l border-[#E2E6E3] z-50 flex flex-col shadow-ambient-lg font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E2E6E3]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1C3322] text-[#FAF8F5] flex items-center justify-center shadow-ambient-sm">
                  <ShoppingBag className="w-4 h-4 text-[#C9A227]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#161A17]">Your Cart</h3>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#676E6A]">
                    {items.length + bundles.length} {items.length + bundles.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close cart drawer"
                className="p-2.5 rounded-full hover:bg-[#F3EFE8] text-[#161A17] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Cart Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {!hasContent ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#F3EFE8] flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-[#676E6A] stroke-[1.2]" />
                  </div>
                  <h4 className="font-serif text-lg font-medium text-[#161A17]">Your Cart is Empty</h4>
                  <p className="text-xs text-[#676E6A] font-sans max-w-[240px] leading-relaxed">
                    Explore our coconut products and body care to complete your order.
                  </p>
                  <Button variant="botanical" size="md" onClick={onClose}>
                    Explore Selection
                  </Button>
                </div>
              ) : (
                <>
                  {/* Bundles */}
                  {bundles.length > 0 && (
                    <div className="space-y-4">
                      {bundles.map((bundle) => (
                        <div
                          key={bundle.bundleId}
                          className="flex gap-4 pb-4 border-b border-[#E2E6E3] last:border-0"
                        >
                          <div className="relative w-20 h-24 rounded-[0.75rem] bg-[#F3EFE8] overflow-hidden border border-[#C9A227]/40 shrink-0">
                            <Image
                              src={bundle.imageUrl || "/products/placeholder.jpg"}
                              alt=""
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[9px] uppercase tracking-[0.15em] text-[#C9A227] font-bold block mb-0.5">Bundle</span>
                                <h4 className="font-serif font-medium text-[#161A17] text-sm line-clamp-1">
                                  {bundle.title}
                                </h4>
                              </div>
                              <span className="font-serif font-bold text-[#1C3322] text-sm">
                                ₦{(bundle.price * bundle.quantity).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center rounded-[0.5rem] border border-[#E2E6E3] bg-[#FAF8F5] overflow-hidden">
                                <button
                                  onClick={() => updateBundleQuantity(bundle.bundleId, bundle.quantity - 1)}
                                  className="p-1.5 hover:bg-[#F3EFE8] text-[#161A17] transition-colors cursor-pointer"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-3 text-xs font-sans font-bold text-[#161A17]">
                                  {bundle.quantity}
                                </span>
                                <button
                                  onClick={() => updateBundleQuantity(bundle.bundleId, bundle.quantity + 1)}
                                  className="p-1.5 hover:bg-[#F3EFE8] text-[#161A17] transition-colors cursor-pointer"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeBundle(bundle.bundleId)}
                                className="text-[#676E6A] hover:text-[#DC2626] transition-colors p-1.5 cursor-pointer"
                                aria-label="Remove bundle"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Cart Items List */}
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.variantId}
                        className="flex gap-4 pb-4 border-b border-[#E2E6E3] last:border-0"
                      >
                        <div className="relative w-20 h-24 rounded-[0.75rem] bg-[#F3EFE8] overflow-hidden border border-[#E2E6E3] shrink-0">
                          <Image
                            src={item.imageUrl || "/products/placeholder.jpg"}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-serif font-medium text-[#161A17] text-sm line-clamp-1">
                                {item.title}
                              </h4>
                              <span className="text-[10px] uppercase tracking-[0.15em] text-[#676E6A] font-sans font-semibold">
                                {item.name}
                              </span>
                            </div>
                            <span className="font-serif font-bold text-[#1C3322] text-sm">
                              ₦{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center rounded-[0.5rem] border border-[#E2E6E3] bg-[#FAF8F5] overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                className="p-1.5 hover:bg-[#F3EFE8] text-[#161A17] transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-3 text-xs font-sans font-bold text-[#161A17]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                className="p-1.5 hover:bg-[#F3EFE8] text-[#161A17] transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.variantId)}
                              className="text-[#676E6A] hover:text-[#DC2626] transition-colors p-1.5 cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Logistics Estimator */}
                </>
              )}
            </div>

            {/* Footer Summary & Luxury Checkout CTA */}
            {hasContent && (
              <div className="p-6 border-t border-[#E2E6E3] bg-[#F3EFE8]/70 glass-alabaster space-y-4">
                <div className="space-y-1 text-xs font-sans">
                  <div className="flex justify-between items-baseline pt-2">
                    <span className="text-xs uppercase font-bold tracking-[0.18em] text-[#161A17]">Subtotal</span>
                    <span className="font-serif text-2xl font-bold text-[#1C3322]">₦{totalAmount.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-[#676E6A]">VAT and delivery are confirmed at checkout — pickup or delivery.</p>
                </div>

                <Link href="/checkout" onClick={onClose} className="block w-full">
                  <Button variant="botanical" size="lg" className="w-full py-4 text-xs flex items-center justify-center gap-2 shadow-ambient-md">
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <p className="text-center text-[10px] uppercase tracking-[0.15em] text-[#676E6A] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" /> 256-Bit Encrypted Payment Powered by Paystack
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

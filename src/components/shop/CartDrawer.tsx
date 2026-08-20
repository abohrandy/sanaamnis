"use client";

import React, { useState } from "react";
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
  Sparkles,
  Truck,
  ArrowRight,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FREE_SHIPPING_THRESHOLD = 50000;

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

  // Informational only — no monetary effect, so nothing here can disagree with
  // what checkout actually charges. This drawer previously also had a coupon
  // form and a gift-wrap toggle that both changed the "Estimated Total" shown
  // here without checkout (src/lib/pricing.ts) knowing anything about either —
  // a customer could apply "SANA10", see a 10% discount, then be charged the
  // full undiscounted amount at checkout. Removed rather than left half-wired.
  const [selectedCity, setSelectedCity] = useState<"lagos" | "abuja" | "ph">("lagos");

  const progressPercentage = Math.min((totalAmount / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - totalAmount, 0);

  const deliveryEstimates = {
    lagos: "We offer 24 to 48 hours delivery of orders in cities where our distributors are domicile. Orders outside these cities take 3 to 5 working days.",
    abuja: "We offer 24 to 48 hours delivery of orders in cities where our distributors are domicile. Orders outside these cities take 3 to 5 working days.",
    ph: "We offer 24 to 48 hours delivery of orders in cities where our distributors are domicile. Orders outside these cities take 3 to 5 working days.",
  };

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

            {/* Delivery information */}
            <div className="hidden bg-[#F3EFE8] px-6 py-3.5 border-b border-[#E2E6E3]">
              {false ? (
                <p className="text-xs font-sans text-[#161A17] mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                  Delivery charges are calculated at checkout.
                </p>
              ) : (
                <p className="text-xs font-sans text-[#1C3322] font-semibold mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C9A227]" /> Delivery charges are calculated at checkout.
                </p>
              )}
              <div className="w-full h-1.5 bg-[#E2E6E3] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#1C3322] to-[#C9A227]"
                />
              </div>
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
                  <div className="p-4 rounded-[1rem] bg-[#FAF8F5] border border-[#E2E6E3] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#161A17]">
                      <Truck className="w-4 h-4 text-[#C9A227]" />
                      <span>Delivery Dispatch Estimator</span>
                    </div>

                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value as "lagos" | "abuja" | "ph")}
                      className="w-full p-2 bg-[#F3EFE8] border border-[#E2E6E3] rounded-[0.5rem] text-xs font-sans outline-none cursor-pointer"
                    >
                      <option value="lagos">Lagos (Mainland & Islands)</option>
                      <option value="abuja">Abuja (FCT Metropolis)</option>
                      <option value="ph">Port Harcourt (Rivers)</option>
                    </select>

                    <p className="text-[10px] font-sans text-[#676E6A] flex items-center gap-1.5 pt-1">
                      <Clock className="w-3 h-3 text-[#C9A227]" /> {deliveryEstimates[selectedCity]}
                    </p>
                  </div>
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
                  <p className="text-[10px] text-[#676E6A]">Shipping and any taxes are calculated at checkout.</p>
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

"use client";

import React, { useState, useEffect } from "react";
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
  Gift,
  Tag,
  Truck,
  Check,
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

const MOCK_CROSS_SELLS = [
  {
    id: "cs-1",
    productId: "cs-1",
    variantId: "cs-v1",
    title: "Travel Virgin Coconut Oil (50ml)",
    name: "50ml Travel Bottle",
    price: 3500,
    imageUrl: "https://drive.google.com/thumbnail?id=1cRxBW7bAXR5Alft8iGGt5AVugXPRusMY&sz=w500",
    stock: 50,
  },
  {
    id: "cs-2",
    productId: "cs-2",
    variantId: "cs-v2",
    title: "Organic Coconut Lip Balm",
    name: "15g Balm Tin",
    price: 2500,
    imageUrl: "https://drive.google.com/thumbnail?id=1Xcc9CmWFaAEvsU4ovWMHKYkEiEhzN0cr&sz=w500",
    stock: 100,
  },
];

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const isHydrated = useHydrated();
  const rawItems = useCartStore((state) => state.items);
  const items = isHydrated ? rawItems : [];
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const rawTotalAmount = useCartStore((state) => state.getTotalAmount)();

  // Gift wrap state
  const [includeGiftWrap, setIncludeGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState("");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Delivery estimator state
  const [selectedCity, setSelectedCity] = useState<"lagos" | "abuja" | "ph">("lagos");

  // Recently viewed state
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  useEffect(() => {
    const storedRaw = localStorage.getItem("sana_amnis_recently_viewed");
    if (storedRaw) {
      try {
        const parsed = JSON.parse(storedRaw);
        setRecentlyViewed(parsed.slice(0, 2));
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    if (couponCode.toUpperCase() === "SANA10") {
      setAppliedDiscount(0.1);
      setCouponSuccess("10% Sanctuary Privilege Applied");
    } else {
      setCouponError("Invalid promo code. Try 'SANA10'");
    }
  };

  const giftWrapFee = includeGiftWrap ? 2500 : 0;
  const discountAmount = rawTotalAmount * appliedDiscount;
  const finalTotalAmount = Math.max(0, rawTotalAmount - discountAmount + giftWrapFee);

  const progressPercentage = Math.min((rawTotalAmount / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - rawTotalAmount, 0);

  const deliveryEstimates = {
    lagos: "24 Hours Express (Lagos Metropolis)",
    abuja: "48 Hours Courier (Abuja FCT)",
    ph: "48 Hours Courier (Port Harcourt)",
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
                  <h3 className="font-serif text-lg font-medium text-[#161A17]">Your Sanctuary Selection</h3>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#676E6A]">
                    {items.length} {items.length === 1 ? "Formula" : "Formulations"} Reserved
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

            {/* Free Shipping Progress Bar */}
            <div className="bg-[#F3EFE8] px-6 py-3.5 border-b border-[#E2E6E3]">
              {remainingForFreeShipping > 0 ? (
                <p className="text-xs font-sans text-[#161A17] mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                  Add <span className="font-bold text-[#1C3322]">₦{remainingForFreeShipping.toLocaleString()}</span> for Complimentary Express Shipping
                </p>
              ) : (
                <p className="text-xs font-sans text-[#1C3322] font-semibold mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C9A227]" /> Complimentary Luxury Express Shipping Unlocked
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
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#F3EFE8] flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-[#676E6A] stroke-[1.2]" />
                  </div>
                  <h4 className="font-serif text-lg font-medium text-[#161A17]">Your Bag is Empty</h4>
                  <p className="text-xs text-[#676E6A] font-sans max-w-[240px] leading-relaxed">
                    Explore our cold-pressed organic formulations to curate your wellness ritual.
                  </p>
                  <Button variant="botanical" size="md" onClick={onClose}>
                    Explore Selection
                  </Button>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.variantId}
                        className="flex gap-4 pb-4 border-b border-[#E2E6E3] last:border-0"
                      >
                        <div className="w-20 h-24 rounded-[0.75rem] bg-[#F3EFE8] overflow-hidden border border-[#E2E6E3] shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300"}
                            alt={item.title}
                            className="w-full h-full object-cover"
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

                  {/* Organic Gift Wrap Toggle Option */}
                  <div className="p-4 rounded-[1rem] bg-[#F3EFE8] border border-[#E2E6E3] space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#161A17]">
                        <Gift className="w-4 h-4 text-[#C9A227]" />
                        <span>Organic Linen Gift Wrapping & Card (+₦2,500)</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={includeGiftWrap}
                        onChange={(e) => setIncludeGiftWrap(e.target.checked)}
                        className="w-4 h-4 accent-[#1C3322] cursor-pointer"
                      />
                    </label>

                    {includeGiftWrap && (
                      <textarea
                        rows={2}
                        value={giftNote}
                        onChange={(e) => setGiftNote(e.target.value)}
                        placeholder="Enter custom gift note message..."
                        className="w-full p-2.5 bg-[#FAF8F5] border border-[#E2E6E3] rounded-[0.5rem] text-xs outline-none focus:border-[#1C3322] resize-none"
                      />
                    )}
                  </div>

                  {/* Delivery Logistics Estimator */}
                  <div className="p-4 rounded-[1rem] bg-[#FAF8F5] border border-[#E2E6E3] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#161A17]">
                      <Truck className="w-4 h-4 text-[#C9A227]" />
                      <span>Delivery Dispatch Estimator</span>
                    </div>

                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value as any)}
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

                  {/* One-Click Cross-Sell Pairings */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C9A227] block">
                      Enhance Your Order
                    </span>

                    <div className="space-y-2">
                      {MOCK_CROSS_SELLS.map((cs) => (
                        <div
                          key={cs.id}
                          className="flex items-center justify-between p-3 rounded-[0.75rem] bg-[#FAF8F5] border border-[#E2E6E3]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-[0.375rem] bg-[#F3EFE8] overflow-hidden shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={cs.imageUrl} alt={cs.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h5 className="text-xs font-semibold text-[#161A17] line-clamp-1">{cs.title}</h5>
                              <span className="text-[10px] text-[#1C3322] font-serif font-bold">₦{cs.price.toLocaleString()}</span>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              addItem({
                                variantId: cs.variantId,
                                productId: cs.productId,
                                sku: cs.id,
                                name: cs.name,
                                title: cs.title,
                                price: cs.price,
                                imageUrl: cs.imageUrl,
                                stock: cs.stock,
                              })
                            }
                            className="px-3 py-1.5 rounded-[0.375rem] bg-[#1C3322] text-[#FAF8F5] text-[10px] uppercase font-bold tracking-wider hover:bg-[#C9A227] hover:text-[#161A17] transition-colors cursor-pointer"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coupon Promo Code UX */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Promo Code (e.g. SANA10)"
                        className="w-full p-2.5 bg-[#F3EFE8] border border-[#E2E6E3] rounded-[0.5rem] text-xs outline-none uppercase tracking-wider font-semibold focus:border-[#1C3322]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#1C3322] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider rounded-[0.5rem] hover:bg-[#C9A227] hover:text-[#161A17] transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                  {couponSuccess && <p className="text-[10px] text-green-600 font-bold">{couponSuccess}</p>}
                  {couponError && <p className="text-[10px] text-red-500 font-bold">{couponError}</p>}
                </>
              )}
            </div>

            {/* Footer Summary & Luxury Checkout CTA */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#E2E6E3] bg-[#F3EFE8]/70 glass-alabaster space-y-4">
                <div className="space-y-1 text-xs font-sans">
                  <div className="flex justify-between text-[#676E6A]">
                    <span>Subtotal</span>
                    <span>₦{rawTotalAmount.toLocaleString()}</span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-green-700 font-semibold">
                      <span>Privilege Discount (10%)</span>
                      <span>-₦{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {includeGiftWrap && (
                    <div className="flex justify-between text-[#161A17]">
                      <span>Linen Gift Wrap</span>
                      <span>+₦2,500</span>
                    </div>
                  )}

                  <div className="flex justify-between items-baseline pt-2 border-t border-[#E2E6E3]">
                    <span className="text-xs uppercase font-bold tracking-[0.18em] text-[#161A17]">Estimated Total</span>
                    <span className="font-serif text-2xl font-bold text-[#1C3322]">₦{finalTotalAmount.toLocaleString()}</span>
                  </div>
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

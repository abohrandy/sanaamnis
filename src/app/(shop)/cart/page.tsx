"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  Trash2,
  ShoppingBag,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Truck,
  Clock,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useHydrated } from "@/hooks/useHydratedStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WishlistGrid } from "@/components/shop/WishlistGrid";
import { useWishlistStore } from "@/store/wishlistStore";

const FREE_SHIPPING_THRESHOLD = 50000;

export default function CartPage() {
  const hydrated = useHydrated();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const rawSubtotal = useCartStore((state) => state.getTotalAmount)();

  // Informational only — no monetary effect, so nothing here can disagree with
  // what checkout actually charges.
  const [selectedCity, setSelectedCity] = useState<"lagos" | "abuja" | "ph">("lagos");

  const savedCount = useWishlistStore((s) => (hydrated ? s.items.length : 0));

  const progressPercentage = Math.min((rawSubtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - rawSubtotal, 0);

  const deliveryEstimates = {
    lagos: "We offer 24 to 48 hours delivery of orders in cities where our distributors are domicile. Orders outside these cities take 3 to 5 working days.",
    abuja: "We offer 24 to 48 hours delivery of orders in cities where our distributors are domicile. Orders outside these cities take 3 to 5 working days.",
    ph: "We offer 24 to 48 hours delivery of orders in cities where our distributors are domicile. Orders outside these cities take 3 to 5 working days.",
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center">
        <Header />
        <div className="w-8 h-8 border-4 border-[#1C3322] border-t-transparent rounded-full animate-spin"></div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full space-y-12">
        {/* Intro */}
        <div className="max-w-2xl space-y-3">
          <Badge variant="gold">SANCTUARY INVENTORY</Badge>
          <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17]">
            Shopping Cart
          </h1>
          <p className="text-xs text-[#676E6A] font-sans">
            Review your reserved cold-pressed elixirs, configure gift preferences, and calculate logistics delivery.
          </p>
        </div>

        {items.length > 0 ? (
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Items Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Delivery information */}
              <div className="hidden p-4 rounded-[1.25rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster shadow-ambient-sm">
                {false ? (
                  <p className="text-xs font-sans text-[#161A17] mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                    Delivery charges are calculated at checkout.
                  </p>
                ) : (
                  <p className="text-xs font-sans text-[#1C3322] font-semibold mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#C9A227]" /> Delivery charges are calculated at checkout.
                  </p>
                )}
                <div className="w-full h-2 bg-[#E2E6E3] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${progressPercentage}%` }}
                    className="h-full bg-gradient-to-r from-[#1C3322] to-[#C9A227] transition-all duration-500"
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.variantId}
                    className="p-6 rounded-[1.25rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster flex gap-6 shadow-ambient-sm"
                  >
                    <div className="relative w-24 h-28 bg-[#F3EFE8] rounded-[0.75rem] overflow-hidden border border-[#E2E6E3] shrink-0">
                      <Image
                        src={item.imageUrl || "/products/placeholder.jpg"}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-serif text-base font-medium text-[#161A17]">
                            {item.title}
                          </h3>
                          <p className="text-[10px] uppercase tracking-[0.18em] text-[#676E6A] font-semibold mt-0.5">
                            {item.name}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-[#676E6A] hover:text-[#DC2626] p-1 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-end pt-4">
                        <div className="flex items-center border border-[#E2E6E3] rounded-[0.5rem] bg-[#FAF8F5] overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-2 hover:bg-[#F3EFE8] text-[#161A17] transition-colors cursor-pointer"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-[#161A17]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-2 hover:bg-[#F3EFE8] text-[#161A17] transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-serif text-lg font-bold text-[#1C3322]">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Dispatch Estimator */}
              <div className="p-6 rounded-[1.25rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#161A17]">
                  <Truck className="w-4 h-4 text-[#C9A227]" />
                  <span>Delivery Logistics Estimator</span>
                </div>

                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value as "lagos" | "abuja" | "ph")}
                  className="w-full p-3 bg-[#F3EFE8] border border-[#E2E6E3] rounded-[0.5rem] text-xs font-sans outline-none cursor-pointer"
                >
                  <option value="lagos">Lagos (Mainland & Islands)</option>
                  <option value="abuja">Abuja (FCT Metropolis)</option>
                  <option value="ph">Port Harcourt (Rivers)</option>
                </select>

                <p className="text-xs text-[#676E6A] flex items-center gap-1.5 pt-1">
                  <Clock className="w-3.5 h-3.5 text-[#C9A227]" /> {deliveryEstimates[selectedCity]}
                </p>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-5 p-8 rounded-[1.5rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster shadow-ambient-md space-y-6 sticky top-28">
              <h3 className="font-serif text-xl font-medium text-[#161A17] pb-4 border-b border-[#E2E6E3]">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs font-sans text-[#676E6A]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#161A17]">₦{rawSubtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping & Taxes</span>
                  <span className="font-bold text-[#1C3322]">Calculated at Checkout</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E6E3] flex justify-between items-baseline">
                <span className="font-sans text-xs uppercase font-bold tracking-[0.18em] text-[#161A17]">
                  Subtotal
                </span>
                <span className="font-serif text-3xl font-bold text-[#1C3322]">
                  ₦{rawSubtotal.toLocaleString()}
                </span>
              </div>

              <Link href="/checkout" className="block w-full">
                <Button variant="botanical" size="lg" className="w-full py-4 text-xs flex items-center justify-center gap-2 shadow-ambient-md">
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <p className="text-center text-[10px] uppercase tracking-[0.15em] text-[#676E6A] flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" /> 256-Bit Encrypted Payment Powered by Paystack
              </p>
            </div>
          </div>
        ) : (
          <div className="py-24 text-center bg-[#FAF8F5] border border-[#E2E6E3] rounded-[1.5rem] max-w-xl mx-auto space-y-6 p-10 shadow-ambient-sm">
            <div className="w-16 h-16 rounded-full bg-[#F3EFE8] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8 text-[#676E6A] stroke-[1.2]" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#161A17]">Your Shopping Cart is Empty</h3>
            <p className="text-xs text-[#676E6A] font-sans max-w-sm mx-auto leading-relaxed">
              Discover coconut water, milk powder, oils, kitchen staples and body care in our catalog.
            </p>
            <Link href="/shop" className="inline-block">
              <Button variant="botanical" size="md">
                Browse Shop Catalog <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}

        {/* Saved for later — real wishlist rather than a localStorage guess. */}
        {savedCount > 0 && (
          <div className="pt-16 border-t border-[#E2E6E3] space-y-6">
            <h3 className="font-serif text-2xl font-medium text-[#161A17]">
              Saved for later
            </h3>
            <WishlistGrid columns={4} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

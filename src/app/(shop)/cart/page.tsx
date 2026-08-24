"use client";

import React from "react";
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
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useHydrated } from "@/hooks/useHydratedStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WishlistGrid } from "@/components/shop/WishlistGrid";
import { useWishlistStore } from "@/store/wishlistStore";

export default function CartPage() {
  const hydrated = useHydrated();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const bundles = useCartStore((state) => state.bundles);
  const removeBundle = useCartStore((state) => state.removeBundle);
  const updateBundleQuantity = useCartStore((state) => state.updateBundleQuantity);
  const rawSubtotal = useCartStore((state) => state.getTotalAmount)();

  const savedCount = useWishlistStore((s) => (hydrated ? s.items.length : 0));

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
          <Badge variant="gold">YOUR CART</Badge>
          <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17]">
            Shopping Cart
          </h1>
          <p className="text-xs text-[#676E6A] font-sans">
            Review your reserved cold-pressed elixirs and choose pickup or delivery at checkout.
          </p>
        </div>

        {items.length > 0 || bundles.length > 0 ? (
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Items Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Bundles */}
              {bundles.length > 0 && (
                <div className="space-y-4">
                  {bundles.map((bundle) => (
                    <div
                      key={bundle.bundleId}
                      className="p-6 rounded-[1.25rem] bg-[#F3EFE8] border border-[#C9A227]/40 glass-alabaster flex gap-6 shadow-ambient-sm"
                    >
                      <div className="relative w-24 h-28 bg-[#FAF8F5] rounded-[0.75rem] overflow-hidden border border-[#E2E6E3] shrink-0">
                        <Image
                          src={bundle.imageUrl || "/products/placeholder.jpg"}
                          alt=""
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge variant="gold" size="sm" className="mb-1.5">Bundle</Badge>
                            <h3 className="font-serif text-base font-medium text-[#161A17]">
                              {bundle.title}
                            </h3>
                            <ul className="text-[10px] text-[#676E6A] mt-1 space-y-0.5">
                              {bundle.items.map((component) => (
                                <li key={component.variantId}>
                                  {component.quantity} × {component.productTitle} ({component.variantName})
                                </li>
                              ))}
                            </ul>
                          </div>
                          <button
                            onClick={() => removeBundle(bundle.bundleId)}
                            className="text-[#676E6A] hover:text-[#DC2626] p-1 transition-colors cursor-pointer shrink-0"
                            aria-label="Remove bundle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex justify-between items-end pt-4">
                          <div className="flex items-center border border-[#E2E6E3] rounded-[0.5rem] bg-[#FAF8F5] overflow-hidden">
                            <button
                              onClick={() => updateBundleQuantity(bundle.bundleId, bundle.quantity - 1)}
                              className="p-2 hover:bg-[#F3EFE8] text-[#161A17] transition-colors cursor-pointer"
                              disabled={bundle.quantity <= 1}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs font-bold text-[#161A17]">
                              {bundle.quantity}
                            </span>
                            <button
                              onClick={() => updateBundleQuantity(bundle.bundleId, bundle.quantity + 1)}
                              className="p-2 hover:bg-[#F3EFE8] text-[#161A17] transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="font-serif text-lg font-bold text-[#1C3322]">
                            ₦{(bundle.price * bundle.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

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
                  <span>VAT & Delivery</span>
                  <span className="font-bold text-[#1C3322]">Confirmed at Checkout</span>
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

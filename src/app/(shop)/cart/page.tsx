"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useHydrated } from "@/hooks/useHydratedStore";

export default function CartPage() {
  const hydrated = useHydrated();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <Header />
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-20 w-full space-y-12">
        {/* Header */}
        <div className="max-w-2xl space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">
            Order Inventory
          </span>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            My Shopping Bag
          </h1>
        </div>

        {items.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Items Column */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="bg-card border border-border/40 rounded-2xl p-6 flex gap-6 shadow-[0_10px_40px_rgba(53,94,59,0.02)]"
                >
                  <div className="w-24 h-24 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif text-base font-medium text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mt-1">
                          {item.name}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex justify-between items-end pt-4">
                      {/* Quantity buttons */}
                      <div className="flex items-center border border-border/40 rounded-full bg-background px-2">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1 hover:text-primary transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="p-1 hover:text-primary transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-primary">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="bg-card border border-border/40 rounded-2xl p-8 space-y-6 shadow-[0_10px_40px_rgba(53,94,59,0.03)]">
              <h3 className="font-serif text-lg font-medium text-foreground pb-4 border-b border-border/20">
                Summary
              </h3>

              <div className="space-y-3 text-xs uppercase tracking-widest font-bold text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-foreground">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-foreground">Calculated next</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/20 flex justify-between items-baseline">
                <span className="text-sm font-serif font-medium text-foreground">Total</span>
                <span className="text-lg font-bold text-primary">₦{subtotal.toLocaleString()}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full py-4 bg-primary text-white text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-secondary transition-colors rounded-xl"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-24 text-center bg-card border border-border/20 rounded-2xl max-w-xl mx-auto space-y-6 p-8">
            <p className="text-sm text-muted-foreground">
              Your shopping bag is empty.
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center py-4 px-6 bg-primary text-white text-[10px] uppercase tracking-widest font-bold gap-2 hover:bg-secondary transition-all rounded-xl"
            >
              Browse Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

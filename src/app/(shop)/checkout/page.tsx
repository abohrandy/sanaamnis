"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";
import { useHydrated } from "@/hooks/useHydratedStore";
import { computeTotals } from "@/lib/pricing";
import {
  CreditCard,
  ShoppingBag,
  Loader2,
  ShieldCheck,
  Lock,
  Truck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Clock,
  Check,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const isHydrated = useHydrated();
  const rawItems = useCartStore((state) => state.items);
  const items = isHydrated ? rawItems : [];
  const totalAmount = useCartStore((state) => state.getTotalAmount)();
  const clearCart = useCartStore((state) => state.clearCart);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [shippingState, setShippingState] = useState("Lagos");
  const [deliverySpeed, setDeliverySpeed] = useState<"express" | "standard">("express");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Same module the order API prices with, so this total is the amount charged.
  const totals = computeTotals(
    items.map((i) => ({ variantId: i.variantId, quantity: i.quantity, unitPrice: i.price })),
    shippingState,
    deliverySpeed
  );
  const { subtotal, vat, shipping: shippingFee, total: grandTotal } = totals;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          shippingAddress: address,
          shippingState,
          deliverySpeed,
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.authorizationUrl) {
        throw new Error(data.error || "We could not start your payment. Please try again.");
      }

      // The cart is deliberately left intact until Paystack confirms payment — the
      // success page clears it. Emptying it here lost the bag whenever a payment
      // was abandoned or declined.
      window.location.href = data.authorizationUrl;
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full space-y-12">
        {/* Breadcrumb Navigation & Steps Header */}
        <div className="space-y-6">
          <Link
            href="/cart"
            className="inline-flex items-center text-xs font-sans uppercase tracking-[0.18em] text-[#676E6A] hover:text-[#1C3322] transition-colors gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shopping Bag
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E6E3] pb-8">
            <div>
              <Badge variant="gold">BANK-GRADE ENCRYPTED CHECKOUT</Badge>
              <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17] mt-1">
                Finalize Sanctuary Order
              </h1>
            </div>

            {/* 3-Step Multi-Step Progress Indicator */}
            <div className="flex items-center gap-2 text-xs font-sans uppercase font-bold tracking-[0.15em]">
              <span className="flex items-center gap-1.5 text-[#1C3322]">
                <CheckCircle2 className="w-4 h-4 text-[#C9A227]" /> 1. Bag
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#676E6A]" />
              <span className="flex items-center gap-1.5 text-[#1C3322] border-b-2 border-[#1C3322] pb-0.5">
                2. Shipping & Delivery
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#676E6A]" />
              <span className="flex items-center gap-1.5 text-[#676E6A]">
                3. Paystack Security
              </span>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="py-24 text-center bg-[#FAF8F5] border border-[#E2E6E3] rounded-[1.5rem] max-w-xl mx-auto space-y-6 p-10 shadow-ambient-sm">
            <div className="w-16 h-16 rounded-full bg-[#F3EFE8] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8 text-[#676E6A] stroke-[1.2]" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#161A17]">Your Cart is Empty</h3>
            <p className="text-xs text-[#676E6A] font-sans max-w-sm mx-auto leading-relaxed">
              You currently have no cold-pressed formulations reserved in your bag.
            </p>
            <Link href="/shop" className="inline-block">
              <Button variant="botanical" size="md">
                Browse Shop Catalog
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Form Details */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-sans font-semibold rounded-[0.75rem]">
                  {error}
                </div>
              )}

              {/* Contact Information */}
              <div className="p-8 rounded-[1.5rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster shadow-ambient-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-[#E2E6E3] pb-4">
                  <Lock className="w-4 h-4 text-[#C9A227]" />
                  <h3 className="font-serif text-lg font-medium text-[#161A17]">Contact Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-sans font-bold tracking-[0.18em] text-[#676E6A] block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Amina Yusuf"
                      className="w-full p-3.5 bg-[#F3EFE8] border border-[#E2E6E3] rounded-[0.5rem] text-xs font-sans text-[#161A17] outline-none focus:border-[#1C3322]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-sans font-bold tracking-[0.18em] text-[#676E6A] block">
                      Email Address (for Order Receipt) *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. amina@example.com"
                      className="w-full p-3.5 bg-[#F3EFE8] border border-[#E2E6E3] rounded-[0.5rem] text-xs font-sans text-[#161A17] outline-none focus:border-[#1C3322]"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping & Delivery Address */}
              <div className="p-8 rounded-[1.5rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster shadow-ambient-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-[#E2E6E3] pb-4">
                  <Truck className="w-4 h-4 text-[#C9A227]" />
                  <h3 className="font-serif text-lg font-medium text-[#161A17]">Shipping Destination</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-sans font-bold tracking-[0.18em] text-[#676E6A] block">
                      Region / State *
                    </label>
                    <select
                      value={shippingState}
                      onChange={(e) => setShippingState(e.target.value)}
                      className="w-full p-3.5 bg-[#F3EFE8] border border-[#E2E6E3] rounded-[0.5rem] text-xs font-sans text-[#161A17] outline-none focus:border-[#1C3322] cursor-pointer"
                    >
                      <option value="Lagos">Lagos State (24-Hour Express Available)</option>
                      <option value="Abuja">Abuja FCT (48-Hour Courier)</option>
                      <option value="Rivers">Port Harcourt / Rivers State (48-Hour Courier)</option>
                      <option value="Other">Other Nigerian States (72-Hour Courier)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-sans font-bold tracking-[0.18em] text-[#676E6A] block">
                      Full Delivery Street Address *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Provide street address, house/suite number, landmark, city, and state."
                      className="w-full p-3.5 bg-[#F3EFE8] border border-[#E2E6E3] rounded-[0.5rem] text-xs font-sans text-[#161A17] outline-none focus:border-[#1C3322] resize-none"
                    />
                  </div>

                  {/* Delivery Speed Selection */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] uppercase font-sans font-bold tracking-[0.18em] text-[#676E6A] block">
                      Select Courier Speed:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setDeliverySpeed("express")}
                        className={`p-4 rounded-[0.75rem] border text-left transition-all duration-300 flex items-start justify-between cursor-pointer ${
                          deliverySpeed === "express"
                            ? "bg-[#1C3322] text-[#FAF8F5] border-transparent shadow-ambient-sm"
                            : "bg-[#F3EFE8] text-[#161A17] border-[#E2E6E3]"
                        }`}
                      >
                        <div>
                          <span className="text-xs font-serif font-medium block">Priority Express Dispatch</span>
                          <span className="text-[10px] opacity-80 block mt-0.5">Dispatched within 12h (+₦1,500)</span>
                        </div>
                        {deliverySpeed === "express" && <Check className="w-4 h-4 text-[#C9A227]" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliverySpeed("standard")}
                        className={`p-4 rounded-[0.75rem] border text-left transition-all duration-300 flex items-start justify-between cursor-pointer ${
                          deliverySpeed === "standard"
                            ? "bg-[#1C3322] text-[#FAF8F5] border-transparent shadow-ambient-sm"
                            : "bg-[#F3EFE8] text-[#161A17] border-[#E2E6E3]"
                        }`}
                      >
                        <div>
                          <span className="text-xs font-serif font-medium block">Standard Courier</span>
                          <span className="text-[10px] opacity-80 block mt-0.5">24-48h Standard Window</span>
                        </div>
                        {deliverySpeed === "standard" && <Check className="w-4 h-4 text-[#C9A227]" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Paystack Submit Trigger */}
              <div className="space-y-4">
                <Button
                  type="submit"
                  variant="botanical"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full py-5 text-xs flex items-center justify-center gap-2 shadow-ambient-md cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Securing Paystack Gateway...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pay ₦{grandTotal.toLocaleString()} via Paystack</span>
                    </>
                  )}
                </Button>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 text-center text-[9px] uppercase font-sans tracking-[0.15em] text-[#676E6A] pt-2">
                  <span className="flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" /> 256-Bit SSL
                  </span>
                  <span className="flex items-center justify-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-[#C9A227]" /> PCI-DSS Level 1
                  </span>
                  <span className="flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" /> Paystack Direct
                  </span>
                </div>
              </div>
            </form>

            {/* Right Column: Order Summary Sidebar */}
            <aside className="lg:col-span-5 p-8 rounded-[1.5rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster shadow-ambient-md space-y-6 sticky top-28">
              <h3 className="font-serif text-xl font-medium text-[#161A17] pb-4 border-b border-[#E2E6E3]">
                Reserved Inventory ({items.length})
              </h3>

              <div className="divide-y divide-[#E2E6E3] max-h-[340px] overflow-y-auto pr-2 space-y-4">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 pt-4 first:pt-0">
                    <div className="relative w-14 h-16 rounded-[0.5rem] bg-[#F3EFE8] overflow-hidden border border-[#E2E6E3] shrink-0">
                      <Image
                        src={item.imageUrl || "/products/placeholder.jpg"}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-xs font-medium text-[#161A17] truncate">{item.title}</h4>
                      <span className="text-[10px] text-[#676E6A] font-sans block">{item.name} × {item.quantity}</span>
                    </div>
                    <span className="font-serif text-xs font-bold text-[#1C3322]">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E2E6E3] pt-4 space-y-2.5 text-xs font-sans text-[#676E6A]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#161A17]">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (7.5%)</span>
                  <span className="font-bold text-[#161A17]">₦{vat.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Surcharge ({shippingState})</span>
                  <span className="font-bold text-[#1C3322]">₦{shippingFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-[#E2E6E3] pt-4 flex justify-between items-baseline">
                <span className="font-sans text-xs uppercase font-bold tracking-[0.18em] text-[#161A17]">Grand Total</span>
                <span className="font-serif text-3xl font-bold text-[#1C3322]">₦{grandTotal.toLocaleString()}</span>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

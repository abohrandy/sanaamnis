"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";
import { useHydrated } from "@/hooks/useHydratedStore";
import { CreditCard, ShoppingBag, Loader2 } from "lucide-react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const subtotal = totalAmount;
  const vat = subtotal * 0.075;
  const shippingFee = shippingState === "Lagos" ? 2500 : 5000;
  const grandTotal = subtotal + vat + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

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
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process order.");
      }

      // Clear the local cart
      clearCart();

      // Redirect to Paystack Checkout page
      window.location.href = data.authorizationUrl;
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-background py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-serif text-3xl font-semibold mb-12 tracking-tight">Checkout</h1>

          {items.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border flex flex-col items-center justify-center space-y-4">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              <p className="text-muted-foreground font-sans text-sm">You have no items in your cart to checkout.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Checkout Form */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
                <h3 className="font-serif text-lg font-medium border-b border-border/40 pb-3 mb-6">
                  Shipping Information
                </h3>

                {error && (
                  <div className="p-4 bg-destructive/10 text-destructive text-xs font-semibold uppercase tracking-wider">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full p-4 border border-border bg-card text-foreground font-sans text-sm focus:border-primary outline-hidden"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    className="w-full p-4 border border-border bg-card text-foreground font-sans text-sm focus:border-primary outline-hidden"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block">
                    Shipping Region / State
                  </label>
                  <select
                    value={shippingState}
                    onChange={(e) => setShippingState(e.target.value)}
                    className="w-full p-4 border border-border bg-card text-foreground font-sans text-sm focus:border-primary outline-hidden"
                  >
                    <option value="Lagos">Lagos State (₦2,500 shipping)</option>
                    <option value="Other">Other Regions (₦5,000 shipping)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block">
                    Delivery Address
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Provide full street address, city, state and country."
                    className="w-full p-4 border border-border bg-card text-foreground font-sans text-sm focus:border-primary outline-hidden resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-primary-foreground font-semibold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-primary/95 transition-all duration-300 shadow-xl disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Securing Checkout...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Pay with Paystack (₦{grandTotal.toLocaleString()})
                    </>
                  )}
                </button>
              </form>

              {/* Order Summary Sidebar */}
              <aside className="lg:col-span-5 bg-card border border-border/40 p-6 self-start space-y-6">
                <h3 className="font-serif text-lg font-medium border-b border-border/40 pb-3">
                  Summary
                </h3>

                <div className="divide-y divide-border/20 max-h-[300px] overflow-y-auto pr-2 space-y-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 pt-4 first:pt-0">
                      <div className="w-12 h-12 bg-muted overflow-hidden border border-border/10 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-sans text-xs font-semibold text-foreground line-clamp-1">{item.title}</h4>
                        <span className="text-[10px] text-muted-foreground block">{item.name} x {item.quantity}</span>
                      </div>
                      <span className="font-serif text-xs font-semibold text-primary">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border/20 pt-4 space-y-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-foreground">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (7.5%)</span>
                    <span className="text-foreground">₦{vat.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Surcharge</span>
                    <span className="text-foreground">₦{shippingFee.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-border/40 pt-4 flex justify-between items-center font-semibold text-sm">
                  <span>Grand Total</span>
                  <span className="font-serif text-primary text-base">₦{grandTotal.toLocaleString()}</span>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

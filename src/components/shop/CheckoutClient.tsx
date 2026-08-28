"use client";

import React, { useState } from "react";
import Image from "next/image";
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
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Info,
  Check,
  Phone,
  MessageCircle,
  Landmark,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Distributor } from "@/lib/content";
import { DELIVERY_CITIES, findDeliveryZone, zonesForCity, type DeliveryCity } from "@/lib/deliveryZones";

const OFFICE_PHONE_DISPLAY = "+234 913 735 8352";
const OFFICE_PHONE_TEL = "+2349137358352";
const OFFICE_WHATSAPP_URL = "https://wa.me/2349137358352";
const NOT_LISTED = "not-listed";

export interface CheckoutClientProps {
  distributors: Distributor[];
}

type DeliveryMethod = "pickup" | "delivery";
type PaymentMethod = "paystack" | "bank_transfer";

export function CheckoutClient({ distributors }: CheckoutClientProps) {
  const isHydrated = useHydrated();
  const rawItems = useCartStore((state) => state.items);
  const items = isHydrated ? rawItems : [];
  const rawBundles = useCartStore((state) => state.bundles);
  const bundles = isHydrated ? rawBundles : [];
  const hasContent = items.length > 0 || bundles.length > 0;

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paystack");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("pickup");
  const [pickupLocation, setPickupLocation] = useState(distributors[0]?.region ?? "");
  const [deliveryCity, setDeliveryCity] = useState<string>(NOT_LISTED);
  const [deliveryZoneSlug, setDeliveryZoneSlug] = useState<string>(NOT_LISTED);
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const cityZones = deliveryCity === NOT_LISTED ? [] : zonesForCity(deliveryCity as DeliveryCity);
  const deliveryZone = deliveryZoneSlug === NOT_LISTED ? undefined : findDeliveryZone(deliveryZoneSlug);

  // Grouped in source order so each optgroup mirrors the client's own
  // corridor names (e.g. "Sangotedo & Environs") — undefined for the
  // Abuja / Lagos Mainland lists, which have no sub-corridors at all.
  const subregions = Array.from(new Set(cityZones.map((z) => z.subregion ?? "")))
    .filter(Boolean)
    .map((label) => ({ label, zones: cityZones.filter((z) => z.subregion === label) }));
  const ungroupedZones = cityZones.filter((z) => !z.subregion);

  // Same module the order API prices with, so this total is the amount charged.
  // A bundle contributes one flat-priced line here — its own price, not the sum
  // of its components — matching exactly how /api/orders prices it server-side.
  // Pickup is free. Delivery only adds a fee when the address falls inside a
  // known zone; otherwise it stays 0 and is quoted after checkout.
  const totals = computeTotals(
    [
      ...items.map((i) => ({ variantId: i.variantId, quantity: i.quantity, unitPrice: i.price })),
      ...bundles.map((b) => ({ variantId: `bundle:${b.bundleId}`, quantity: b.quantity, unitPrice: b.price })),
    ],
    deliveryMethod === "delivery" ? deliveryZone?.fee ?? 0 : 0
  );
  const { subtotal, deliveryFee, total: grandTotal } = totals;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasContent || isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          paymentMethod,
          deliveryMethod,
          pickupLocation: deliveryMethod === "pickup" ? pickupLocation : undefined,
          shippingAddress: deliveryMethod === "delivery" ? address : undefined,
          deliveryZoneSlug: deliveryMethod === "delivery" ? deliveryZoneSlug : undefined,
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          bundles: bundles.map((b) => ({
            bundleId: b.bundleId,
            quantity: b.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "We could not start your payment. Please try again.");
      }

      if (paymentMethod === "bank_transfer") {
        // No gateway redirect — the bank details are on their way by email.
        // The cart is left intact; the success page clears it once paid.
        window.location.href = `/checkout/success?reference=${encodeURIComponent(data.orderNumber)}`;
        return;
      }

      if (!data.authorizationUrl) {
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
    <>
      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full space-y-12">
        {/* Breadcrumb Navigation & Steps Header */}
        <div className="space-y-6">
          <Link
            href="/cart"
            className="inline-flex items-center text-xs font-sans uppercase tracking-[0.18em] text-[#676E6A] hover:text-[#1C3322] transition-colors gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shopping Cart
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E6E3] pb-8">
            <div>
              <Badge variant="gold">BANK-GRADE ENCRYPTED CHECKOUT</Badge>
              <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17] mt-1">
                Finalize Your Order
              </h1>
            </div>

            {/* 3-Step Multi-Step Progress Indicator */}
            <div className="flex items-center gap-2 text-xs font-sans uppercase font-bold tracking-[0.15em]">
              <span className="flex items-center gap-1.5 text-[#1C3322]">
                <CheckCircle2 className="w-4 h-4 text-[#C9A227]" /> 1. Cart
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#676E6A]" />
              <span className="flex items-center gap-1.5 text-[#1C3322] border-b-2 border-[#1C3322] pb-0.5">
                2. Delivery
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#676E6A]" />
              <span className="flex items-center gap-1.5 text-[#676E6A]">
                3. {paymentMethod === "bank_transfer" ? "Bank Transfer" : "Paystack Security"}
              </span>
            </div>
          </div>
        </div>

        {!hasContent ? (
          <div className="py-24 text-center bg-[#FAF8F5] border border-[#E2E6E3] rounded-[1.5rem] max-w-xl mx-auto space-y-6 p-10 shadow-ambient-sm">
            <div className="w-16 h-16 rounded-full bg-[#F3EFE8] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8 text-[#676E6A] stroke-[1.2]" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#161A17]">Your Cart is Empty</h3>
            <p className="text-xs text-[#676E6A] font-sans max-w-sm mx-auto leading-relaxed">
              You currently have no products reserved in your cart.
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

              {/* Delivery Method */}
              <div className="p-8 rounded-[1.5rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster shadow-ambient-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-[#E2E6E3] pb-4">
                  <Truck className="w-4 h-4 text-[#C9A227]" />
                  <h3 className="font-serif text-lg font-medium text-[#161A17]">How would you like your order?</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("pickup")}
                    className={`p-4 rounded-[0.75rem] border text-left transition-all duration-300 flex items-start justify-between cursor-pointer ${
                      deliveryMethod === "pickup"
                        ? "bg-[#1C3322] text-[#FAF8F5] border-transparent shadow-ambient-sm"
                        : "bg-[#F3EFE8] text-[#161A17] border-[#E2E6E3]"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-serif font-medium block">Pickup a Location</span>
                      <span className="text-[10px] opacity-80 block mt-0.5">Free — collect from a distributor near you</span>
                    </div>
                    {deliveryMethod === "pickup" && <Check className="w-4 h-4 text-[#C9A227]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("delivery")}
                    className={`p-4 rounded-[0.75rem] border text-left transition-all duration-300 flex items-start justify-between cursor-pointer ${
                      deliveryMethod === "delivery"
                        ? "bg-[#1C3322] text-[#FAF8F5] border-transparent shadow-ambient-sm"
                        : "bg-[#F3EFE8] text-[#161A17] border-[#E2E6E3]"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-serif font-medium block">Deliver to My Address</span>
                      <span className="text-[10px] opacity-80 block mt-0.5">Delivery cost quoted separately</span>
                    </div>
                    {deliveryMethod === "delivery" && <Check className="w-4 h-4 text-[#C9A227]" />}
                  </button>
                </div>

                {deliveryMethod === "pickup" ? (
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-sans font-bold tracking-[0.18em] text-[#676E6A] block">
                      Pickup Location *
                    </label>
                    <select
                      required
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full p-3.5 bg-[#F3EFE8] border border-[#E2E6E3] rounded-[0.5rem] text-xs font-sans text-[#161A17] outline-none focus:border-[#1C3322] cursor-pointer"
                    >
                      {distributors.map((d) => (
                        <option key={d.slug} value={d.region}>
                          {d.region}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-[#676E6A] flex items-start gap-1.5 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0 mt-0.5" />
                      We will confirm the pickup address and available time with you directly.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-sans font-bold tracking-[0.18em] text-[#676E6A] block">
                        Is Your City Covered? *
                      </label>
                      <select
                        required
                        value={deliveryCity}
                        onChange={(e) => {
                          setDeliveryCity(e.target.value);
                          setDeliveryZoneSlug(NOT_LISTED);
                        }}
                        className="w-full p-3.5 bg-[#F3EFE8] border border-[#E2E6E3] rounded-[0.5rem] text-xs font-sans text-[#161A17] outline-none focus:border-[#1C3322] cursor-pointer"
                      >
                        <option value={NOT_LISTED}>My city isn&apos;t listed — I&apos;ll arrange delivery separately</option>
                        {DELIVERY_CITIES.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    {cityZones.length > 0 && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-sans font-bold tracking-[0.18em] text-[#676E6A] block">
                          Is Your Area Listed Below? *
                        </label>
                        <select
                          required
                          value={deliveryZoneSlug}
                          onChange={(e) => setDeliveryZoneSlug(e.target.value)}
                          className="w-full p-3.5 bg-[#F3EFE8] border border-[#E2E6E3] rounded-[0.5rem] text-xs font-sans text-[#161A17] outline-none focus:border-[#1C3322] cursor-pointer"
                        >
                          <option value={NOT_LISTED}>My area isn&apos;t listed — I&apos;ll arrange delivery separately</option>
                          {ungroupedZones.map((z) => (
                            <option key={z.slug} value={z.slug}>
                              {z.area} — ₦{z.fee.toLocaleString()}
                            </option>
                          ))}
                          {subregions.map(({ label, zones }) => (
                            <optgroup key={label} label={label}>
                              {zones.map((z) => (
                                <option key={z.slug} value={z.slug}>
                                  {z.area} — ₦{z.fee.toLocaleString()}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>
                    )}

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

                    {deliveryZone ? (
                      <p className="text-xs text-[#1C3322] font-semibold flex items-start gap-1.5 bg-[#F3EFE8] p-3 rounded-[0.5rem]">
                        <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0 mt-0.5" />
                        Delivery to {deliveryZone.area}, {deliveryZone.city}: ₦{deliveryZone.fee.toLocaleString()} — added to your total below.
                      </p>
                    ) : (
                      <p className="text-xs text-[#676E6A] flex items-start gap-1.5 bg-[#F3EFE8] p-3 rounded-[0.5rem]">
                        <Info className="w-3.5 h-3.5 text-[#C9A227] shrink-0 mt-0.5" />
                        Delivery cost is not included in this payment. We will work out the delivery
                        fee for your address and share it with you after checkout — it is settled
                        separately (e.g. bank transfer) before your order ships.
                      </p>
                    )}
                  </div>
                )}

                <div className="pt-2 border-t border-[#E2E6E3] flex flex-wrap items-center gap-3">
                  <span className="text-xs text-[#676E6A]">Delivery questions? Call our office:</span>
                  <a
                    href={`tel:${OFFICE_PHONE_TEL}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[0.5rem] bg-[#1C3322] text-[#FAF8F5] text-[11px] font-bold uppercase tracking-[0.12em] hover:bg-[#2D4E35] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" aria-hidden="true" /> {OFFICE_PHONE_DISPLAY}
                  </a>
                  <a
                    href={OFFICE_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[0.5rem] border border-[#E2E6E3] text-[#161A17] text-[11px] font-bold uppercase tracking-[0.12em] hover:border-[#1C3322] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#C9A227]" aria-hidden="true" /> WhatsApp
                  </a>
                </div>
              </div>

              {/* Payment Method */}
              <div className="p-8 rounded-[1.5rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster shadow-ambient-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-[#E2E6E3] pb-4">
                  <CreditCard className="w-4 h-4 text-[#C9A227]" />
                  <h3 className="font-serif text-lg font-medium text-[#161A17]">Payment Method</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paystack")}
                    className={`flex items-center gap-3 p-4 rounded-[0.75rem] border text-left transition-colors cursor-pointer ${
                      paymentMethod === "paystack"
                        ? "border-[#1C3322] bg-[#F3EFE8]"
                        : "border-[#E2E6E3] hover:border-[#1C3322]/40"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#C9A227] shrink-0" />
                    <div>
                      <span className="block text-xs font-sans font-bold text-[#161A17]">Pay with Paystack</span>
                      <span className="block text-[10px] text-[#676E6A]">Card, transfer or USSD — instant confirmation</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank_transfer")}
                    className={`flex items-center gap-3 p-4 rounded-[0.75rem] border text-left transition-colors cursor-pointer ${
                      paymentMethod === "bank_transfer"
                        ? "border-[#1C3322] bg-[#F3EFE8]"
                        : "border-[#E2E6E3] hover:border-[#1C3322]/40"
                    }`}
                  >
                    <Landmark className="w-4 h-4 text-[#C9A227] shrink-0" />
                    <div>
                      <span className="block text-xs font-sans font-bold text-[#161A17]">Bank Transfer</span>
                      <span className="block text-[10px] text-[#676E6A]">We&apos;ll email you the account details</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Submit Trigger */}
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
                      <span>{paymentMethod === "bank_transfer" ? "Placing Order..." : "Securing Paystack Gateway..."}</span>
                    </>
                  ) : paymentMethod === "bank_transfer" ? (
                    <>
                      <Landmark className="w-4 h-4" />
                      <span>Place Order — Pay ₦{grandTotal.toLocaleString()} by Bank Transfer</span>
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
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                    {paymentMethod === "bank_transfer" ? "Manual Verification" : "Paystack Direct"}
                  </span>
                </div>
              </div>
            </form>

            {/* Right Column: Order Summary Sidebar */}
            <aside className="lg:col-span-5 p-8 rounded-[1.5rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster shadow-ambient-md space-y-6 sticky top-28">
              <h3 className="font-serif text-xl font-medium text-[#161A17] pb-4 border-b border-[#E2E6E3]">
                Cart ({items.length + bundles.length})
              </h3>

              <div className="divide-y divide-[#E2E6E3] max-h-[340px] overflow-y-auto pr-2 space-y-4">
                {bundles.map((bundle) => (
                  <div key={bundle.bundleId} className="flex gap-4 pt-4 first:pt-0">
                    <div className="relative w-14 h-16 rounded-[0.5rem] bg-[#F3EFE8] overflow-hidden border border-[#C9A227]/40 shrink-0">
                      <Image
                        src={bundle.imageUrl || "/products/placeholder.jpg"}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase tracking-[0.15em] text-[#C9A227] font-bold block">Bundle</span>
                      <h4 className="font-serif text-xs font-medium text-[#161A17] truncate">{bundle.title}</h4>
                      <span className="text-[10px] text-[#676E6A] font-sans block">× {bundle.quantity}</span>
                    </div>
                    <span className="font-serif text-xs font-bold text-[#1C3322]">
                      ₦{(bundle.price * bundle.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
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
                  <span>Delivery</span>
                  <span className="font-bold text-[#1C3322]">
                    {deliveryMethod === "pickup"
                      ? "Free (pickup)"
                      : deliveryZone
                      ? `₦${deliveryFee.toLocaleString()}`
                      : "Quoted after checkout"}
                  </span>
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
    </>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Clock, Truck, Package, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { formatNaira } from "@/lib/catalog";

type OrderState = "loading" | "paid" | "pending" | "unknown";

const COPY: Record<Exclude<OrderState, "loading">, { badge: string; title: string; body: string }> = {
  paid: {
    badge: "Payment confirmed",
    title: "Thank you — your order is confirmed",
    body: "We have received your payment and are packing your order now. A confirmation email with your receipt is on its way.",
  },
  pending: {
    badge: "Awaiting confirmation",
    title: "We have your order",
    body: "Your order is recorded and we are waiting for the payment to settle. This usually takes a few seconds, and you will get a confirmation email as soon as it clears. There is no need to pay again.",
  },
  unknown: {
    badge: "Order status",
    title: "We could not find that order",
    body: "The reference on this link does not match an order we hold. If you were charged, contact us with your payment reference and we will sort it out straight away.",
  },
};

const STEPS = [
  { icon: Package, title: "Packed", body: "We pick and seal your order, usually the same working day." },
  { icon: Truck, title: "Dispatched", body: "Delivery timing depends on your city and distributor availability." },
  { icon: CheckCircle2, title: "Delivered", body: "Something not right? Tell us within 14 days and we will fix it." },
];

/**
 * Confirmation screen.
 *
 * Reads the real order status from the API rather than trusting the reference in
 * the URL — the page previously announced "Payment Confirmed" to anyone who loaded
 * it with any reference at all.
 */
export function OrderConfirmation() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [state, setState] = useState<OrderState>(reference ? "loading" : "unknown");
  const [total, setTotal] = useState<number | null>(null);
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    if (!reference) return;
    let cancelled = false;
    let attempts = 0;

    // The webhook may land a moment after the customer is redirected back, so a
    // "pending" answer is retried briefly before being shown as final.
    const check = async () => {
      attempts += 1;
      try {
        const res = await fetch(
          `/api/orders/status?reference=${encodeURIComponent(reference)}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (cancelled) return;

        if (res.status === 404) {
          setState("unknown");
          return;
        }
        if (typeof data.total === "number") setTotal(data.total);

        if (data.state === "paid") {
          setState("paid");
          clearCart();
          return;
        }

        setState("pending");
        if (attempts < 5) window.setTimeout(check, 2000);
      } catch {
        if (!cancelled) setState("pending");
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, [reference, clearCart]);

  if (state === "loading") {
    return (
      <div className="w-full rounded-[2rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster p-14 shadow-ambient-lg text-center">
        <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin mx-auto mb-5" />
        <p className="text-sm text-[#676E6A]">Checking your order…</p>
      </div>
    );
  }

  const copy = COPY[state];
  const Icon = state === "paid" ? CheckCircle2 : state === "pending" ? Clock : AlertCircle;

  return (
    <div className="w-full rounded-[2rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster p-8 md:p-14 shadow-ambient-lg text-center space-y-8">
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-ambient-sm ${
          state === "unknown" ? "bg-[#F3EFE8] text-[#8C531B]" : "bg-[#1C3322] text-[#C9A227]"
        }`}
      >
        <Icon className="w-10 h-10 stroke-[1.5]" />
      </div>

      <div className="space-y-3 max-w-lg mx-auto">
        <Badge variant="gold">{copy.badge}</Badge>
        <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-[#161A17]">
          {copy.title}
        </h1>
        <p className="text-sm text-[#676E6A] leading-relaxed">{copy.body}</p>
        {state !== "unknown" && (
          <p className="font-serif text-lg text-[#1C3322] pt-2">
            Thank you for shopping with Sana Amnis — we appreciate you.
          </p>
        )}
      </div>

      {reference && state !== "unknown" && (
        <div className="p-4 rounded-[1rem] bg-[#F3EFE8] border border-[#E2E6E3] inline-block text-xs">
          <span className="text-[#676E6A] uppercase tracking-wider font-semibold">
            Order reference
          </span>{" "}
          <strong className="font-serif text-sm font-bold text-[#1C3322] ml-1">{reference}</strong>
          {total !== null && (
            <span className="block mt-1 text-[#676E6A]">Total {formatNaira(total)}</span>
          )}
        </div>
      )}

      {state === "paid" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#E2E6E3] text-left">
          {STEPS.map(({ icon: StepIcon, title, body }) => (
            <div key={title} className="p-4 rounded-[1rem] bg-[#FAF8F5] border border-[#E2E6E3]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#161A17] mb-1">
                <StepIcon className="w-4 h-4 text-[#C9A227]" /> {title}
              </div>
              <p className="text-[11px] text-[#676E6A] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      )}

      <div className="pt-4 border-t border-[#E2E6E3] flex flex-wrap justify-center gap-3">
        <Link href="/shop">
          <Button variant="botanical" size="lg" className="flex items-center gap-2">
            Continue shopping <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        {state !== "paid" && (
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Contact us
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

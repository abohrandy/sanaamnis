"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Clock, Truck, Package, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { formatNaira } from "@/lib/catalog";

type OrderState = "loading" | "paid" | "awaiting_confirmation" | "pending" | "unknown";

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

/** Grace period shown on the "I've Made This Payment" button, so the buyer has
 * time to actually go make the transfer before we let them claim it. */
const CONFIRM_HOLD_SECONDS = 60;

const COPY: Record<Exclude<OrderState, "loading">, { badge: string; title: string; body: string }> = {
  paid: {
    badge: "Payment confirmed",
    title: "Thank you — your order is confirmed",
    body: "We have received your payment and are packing your order now. A confirmation email with your receipt is on its way.",
  },
  awaiting_confirmation: {
    badge: "Payment claimed",
    title: "Thanks — we're checking your payment",
    body: "You told us you have made the transfer. We are verifying it against our bank statement and will email you the moment it is confirmed. There is no need to pay again.",
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
  // Only present right after checkout, carried in the redirect URL — see
  // CheckoutClient.tsx. A reload or an email-link visit won't have it, since the
  // signed token isn't worth re-exposing through the open status endpoint.
  const confirmUrl = searchParams.get("confirm");

  const [state, setState] = useState<OrderState>(reference ? "loading" : "unknown");
  const [total, setTotal] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(CONFIRM_HOLD_SECONDS);
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
        if (typeof data.paymentMethod === "string") setPaymentMethod(data.paymentMethod);
        if (data.bankDetails) setBankDetails(data.bankDetails);

        if (data.state === "paid") {
          setState("paid");
          clearCart();
          return;
        }

        setState(data.orderStatus === "awaiting_confirmation" ? "awaiting_confirmation" : "pending");
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

  // Grays out "I've Made This Payment" for CONFIRM_HOLD_SECONDS so the buyer
  // actually has time to go make the transfer before they can claim it.
  const showConfirmButton = paymentMethod === "bank_transfer" && state === "pending" && !!confirmUrl;
  useEffect(() => {
    if (!showConfirmButton) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [showConfirmButton]);

  if (state === "loading") {
    return (
      <div className="w-full rounded-[2rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster p-14 shadow-ambient-lg text-center">
        <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin mx-auto mb-5" />
        <p className="text-sm text-[#676E6A]">Checking your order…</p>
      </div>
    );
  }

  const copy = COPY[state];
  const Icon =
    state === "paid" ? CheckCircle2 : state === "pending" || state === "awaiting_confirmation" ? Clock : AlertCircle;

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

      {paymentMethod === "bank_transfer" && bankDetails && state !== "paid" && (
        <div className="text-left p-5 md:p-6 rounded-[1.25rem] bg-[#F3EFE8] border border-[#E2E6E3] space-y-4">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-[#676E6A]">
            Pay by bank transfer
          </p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[#676E6A]">Bank</dt>
              <dd className="font-bold text-[#161A17]">{bankDetails.bankName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#676E6A]">Account name</dt>
              <dd className="font-bold text-[#161A17]">{bankDetails.accountName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#676E6A]">Account number</dt>
              <dd className="font-bold text-[#161A17]">{bankDetails.accountNumber}</dd>
            </div>
          </dl>

          {state === "pending" && confirmUrl && (
            <div className="pt-3 border-t border-[#E2E6E3] space-y-2">
              <a
                href={secondsLeft === 0 ? confirmUrl : undefined}
                aria-disabled={secondsLeft > 0}
                className={`inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-[0.5rem] text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${
                  secondsLeft > 0
                    ? "bg-[#E2E6E3] text-[#9AA098] cursor-not-allowed pointer-events-none"
                    : "bg-[#1C3322] text-[#FAF8F5] hover:bg-[#2D4E35]"
                }`}
              >
                {secondsLeft > 0 ? `I've Made This Payment (${secondsLeft}s)` : "I've Made This Payment"}
              </a>
              <p className="text-[11px] text-[#676E6A]">
                Complete the transfer first, then let us know — or use the link in your confirmation email.
              </p>
            </div>
          )}

          {state === "pending" && !confirmUrl && (
            <p className="text-[11px] text-[#676E6A] pt-3 border-t border-[#E2E6E3]">
              Once you have paid, use the &ldquo;I&apos;ve Made This Payment&rdquo; button in your confirmation email, or contact us.
            </p>
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

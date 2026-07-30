import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, ArrowRight, Clock, Truck, Package, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { formatNaira } from "@/lib/catalog";
import { ClearCartOnSuccess } from "@/components/shop/ClearCartOnSuccess";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order received",
  robots: { index: false, follow: false },
};

type OrderState = "paid" | "pending" | "unknown";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;

  // The page used to announce "Payment Confirmed" purely because a reference was
  // present in the URL, so anyone could load a confirmation for an unpaid order.
  // The order's real status now decides what the customer is told.
  let state: OrderState = "unknown";
  let total: number | null = null;

  if (reference) {
    try {
      const order = await db.query.orders.findFirst({
        where: eq(orders.orderNumber, reference),
      });
      if (order) {
        state = order.status === "paid" ? "paid" : "pending";
        total = Number(order.totalAmount);
      }
    } catch (error) {
      console.error("[checkout/success] could not read order status:", error);
    }
  }

  const copy = {
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
  }[state];

  const Icon = state === "paid" ? CheckCircle2 : state === "pending" ? Clock : AlertCircle;

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      {/* Only empty the bag once payment has actually settled. */}
      {state === "paid" && <ClearCartOnSuccess />}

      <main className="flex-1 max-w-3xl mx-auto px-6 py-20 w-full flex items-center justify-center">
        <div className="w-full rounded-[2rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster p-8 md:p-14 shadow-ambient-lg text-center space-y-8">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-ambient-sm ${
              state === "unknown"
                ? "bg-[#F3EFE8] text-[#8C531B]"
                : "bg-[#1C3322] text-[#C9A227]"
            }`}
          >
            <Icon className="w-10 h-10 stroke-[1.5]" />
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            <Badge variant="gold">{copy.badge}</Badge>
            <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-[#161A17]">
              {copy.title}
            </h1>
            <p className="text-sm text-[#676E6A] font-sans leading-relaxed">{copy.body}</p>
          </div>

          {reference && state !== "unknown" && (
            <div className="p-4 rounded-[1rem] bg-[#F3EFE8] border border-[#E2E6E3] inline-block text-xs">
              <span className="text-[#676E6A] uppercase tracking-wider font-semibold">
                Order reference
              </span>{" "}
              <strong className="font-serif text-sm font-bold text-[#1C3322] ml-1">
                {reference}
              </strong>
              {total !== null && (
                <span className="block mt-1 text-[#676E6A]">Total {formatNaira(total)}</span>
              )}
            </div>
          )}

          {state === "paid" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#E2E6E3] text-left">
              {[
                {
                  icon: Package,
                  title: "Packed",
                  body: "We pick and seal your order, usually the same working day.",
                },
                {
                  icon: Truck,
                  title: "Dispatched",
                  body: "Lagos in 24–48 hours, elsewhere in Nigeria in 3–5 working days.",
                },
                {
                  icon: CheckCircle2,
                  title: "Delivered",
                  body: "Something not right? Tell us within 14 days and we will fix it.",
                },
              ].map(({ icon: StepIcon, title, body }) => (
                <div
                  key={title}
                  className="p-4 rounded-[1rem] bg-[#FAF8F5] border border-[#E2E6E3]"
                >
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
      </main>

      <Footer />
    </div>
  );
}

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;

  return (
    <>
      <Header />
      <main className="flex-1 bg-background flex items-center justify-center py-20 px-6">
        <div className="max-w-md w-full text-center space-y-8 bg-card border border-border/40 p-8 shadow-xl">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-primary stroke-1" />
          </div>

          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
              Payment Confirmed
            </span>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
              Thank You for Your Order
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Your transaction has completed successfully.
            </p>
          </div>

          {reference && (
            <div className="p-4 bg-muted border border-border text-xs font-mono rounded">
              Order Reference: <span className="text-foreground font-bold">{reference}</span>
            </div>
          )}

          <div className="text-sm text-muted-foreground leading-relaxed font-sans px-4">
            An email receipt and shipping invoice will be delivered to your inbox shortly. Keep this page open for tracking details.
          </div>

          <div className="pt-4 border-t border-border/20 flex flex-col gap-3">
            <Link
              href="/shop"
              className="py-3 bg-primary text-primary-foreground text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 hover:bg-primary/95 transition-all duration-300"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, ArrowRight, ShieldCheck, Truck, Package, RotateCcw, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const revalidate = 0;

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full flex items-center justify-center">
        <div className="w-full rounded-[2rem] bg-[#FAF8F5] border border-[#E2E6E3] glass-alabaster p-8 md:p-14 shadow-ambient-lg text-center space-y-8">
          {/* Animated Success Seal Icon */}
          <div className="w-20 h-20 rounded-full bg-[#1C3322] text-[#C9A227] flex items-center justify-center mx-auto shadow-ambient-sm">
            <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
          </div>

          {/* Title Header */}
          <div className="space-y-3 max-w-lg mx-auto">
            <Badge variant="gold">PAYMENT CONFIRMED VIA PAYSTACK</Badge>
            <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17]">
              Thank You for Your Order
            </h1>
            <p className="text-xs md:text-sm text-[#676E6A] font-sans leading-relaxed">
              Your transaction has completed successfully. Our Badagry sanctuary laboratory is now preparing your cold-pressed formulations for express dispatch.
            </p>
          </div>

          {/* Order Reference Card */}
          {reference && (
            <div className="p-4 rounded-[1rem] bg-[#F3EFE8] border border-[#E2E6E3] inline-block font-sans text-xs text-[#161A17]">
              <span className="text-[#676E6A] uppercase tracking-wider font-semibold">Order Reference:</span>{" "}
              <strong className="font-serif text-sm font-bold text-[#1C3322] ml-1">{reference}</strong>
            </div>
          )}

          {/* Dispatch & Delivery Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#E2E6E3] text-left">
            <div className="p-4 rounded-[1rem] bg-[#FAF8F5] border border-[#E2E6E3]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#161A17] mb-1">
                <Package className="w-4 h-4 text-[#C9A227]" /> 01. Lab Processing
              </div>
              <p className="text-[10px] text-[#676E6A] font-sans">
                Formulation quality seal & temperature inspection (Within 6h).
              </p>
            </div>

            <div className="p-4 rounded-[1rem] bg-[#FAF8F5] border border-[#E2E6E3]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#161A17] mb-1">
                <Truck className="w-4 h-4 text-[#C9A227]" /> 02. Courier Dispatch
              </div>
              <p className="text-[10px] text-[#676E6A] font-sans">
                Priority climate-controlled courier handoff (24-48 Hours).
              </p>
            </div>

            <div className="p-4 rounded-[1rem] bg-[#FAF8F5] border border-[#E2E6E3]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#161A17] mb-1">
                <RotateCcw className="w-4 h-4 text-[#C9A227]" /> 03. Circular Returns
              </div>
              <p className="text-[10px] text-[#676E6A] font-sans">
                Save your amber glass bottle to redeem on your next ritual order.
              </p>
            </div>
          </div>

          {/* Customer Receipt Notice */}
          <p className="text-xs text-[#676E6A] font-sans max-w-md mx-auto leading-relaxed">
            An official invoice and tracking link have been dispatched to your email address. You may keep this page open for tracking reference.
          </p>

          {/* CTA Trigger */}
          <div className="pt-4 border-t border-[#E2E6E3] flex justify-center">
            <Link href="/shop">
              <Button variant="botanical" size="lg" className="py-4 text-xs flex items-center gap-2 shadow-ambient-sm">
                <span>Continue Exploring Shop</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import React from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-20 w-full space-y-20">
        {/* Intro */}
        <div className="max-w-2xl space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">
            Our Heritage
          </span>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Sana Amnis Organic Precision
          </h1>
        </div>

        {/* Narrative Section */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              Organic Harmony & Botanical Purity
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              At Sana Amnis, we believe that luxury is born from vacancy—the deliberate rejection of synthetic additives in favor of raw, organic precision.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sourced from sustainable, mineral-dense coastal groves in Nigeria, our coconuts are cold-pressed in limited batches to guarantee premium quality and preserve native antioxidant values.
            </p>
          </div>

          <div className="relative aspect-[4/3] bg-[#F3EFE8] rounded-2xl overflow-hidden shadow-ambient-md border border-[#E2E6E3]">
            <Image
              src="/products/range-full-light.jpg"
              alt="The Sana Amnis range of coconut products"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Standards Grid */}
        <div className="grid md:grid-cols-3 gap-8 pt-12 border-t border-border/20">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              01. Eco Sourcing
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every coconut is handpicked from volcanic soils to ensure maximum mineral density.
            </p>
          </div>
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              02. Zero Heat
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our low-temperature mechanical presses guarantee zero degradation of delicate fatty chains.
            </p>
          </div>
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              03. Minimal Design
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We package in recyclable premium glassware, maintaining pure shelf-life stability.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

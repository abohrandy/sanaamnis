import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Sprout, Thermometer, PackageCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sana Amnis buys coconuts direct from smallholder farms in Lagos and Ogun State and presses them into oil, water, milk, flour and more.",
  alternates: { canonical: "/about" },
};

// Rewritten to drop claims the rest of the site does not support — coconuts were
// described as "handpicked from volcanic soils" (the Lagos coastal belt is not
// volcanic) and packaging as "recyclable premium glassware" (the client's own
// photography shows pouches and PET bottles). Kept to what /sustainability and
// the product pages already state.
const PRINCIPLES = [
  {
    icon: Sprout,
    title: "Bought direct",
    body: "We buy from smallholder farming families along the Lagos and Ogun coast, rather than through the layers of middlemen that usually sit between a Nigerian farm and a finished product.",
  },
  {
    icon: Thermometer,
    title: "Pressed without heat",
    body: "Our cold-pressed oil is extracted below 37°C on a temperature-controlled press — no solvents, no hexane, no bleaching.",
  },
  {
    icon: PackageCheck,
    title: "Little wasted",
    body: "Water, milk, oil, flour, flakes and poundo all come from the same coconut, processed in one place so very little of it is discarded.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-grow w-full">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-16 space-y-20">
          <Breadcrumbs items={[{ label: "About" }]} />

          <header className="max-w-2xl space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-bold">
              About us
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17] leading-[1.12]">
              One coconut, processed properly
            </h1>
          </header>

          <section className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-5">
              <h2 className="font-serif text-2xl font-medium text-[#1C3322]">
                Why we started
              </h2>
              <p className="text-sm md:text-base text-[#161A17]/75 leading-[1.85]">
                Most coconut products sold in Nigeria pass through several hands before
                they reach a shelf, and the coconut itself is usually pressed for one
                thing — oil, or water, or flour — with the rest discarded or sold on
                separately.
              </p>
              <p className="text-sm md:text-base text-[#161A17]/75 leading-[1.85]">
                We buy coconuts directly from farming families along the coastal belt
                of Lagos and Ogun State and process the whole fruit ourselves: water,
                milk, oil, flour, flakes and more, all from the same batch. It means
                more of what you pay reaches the farm, and less of the coconut goes
                to waste.
              </p>
              <Link href="/blog/buying-direct-from-farmers">
                <Button variant="outline" size="md" className="mt-1">
                  Read more about how we source
                </Button>
              </Link>
            </div>

            <div className="relative aspect-[4/3] bg-[#F3EFE8] rounded-[1.5rem] overflow-hidden shadow-ambient-md border border-[#E2E6E3]">
              <Image
                src="/products/range-full-light.jpg"
                alt="The full Sana Amnis range: coconut water, milk, oils, flour, flakes and lip balms"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-8 pt-14 border-t border-[#E2E6E3]">
            {PRINCIPLES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="space-y-3">
                <Icon className="w-5 h-5 text-[#C9A227]" aria-hidden="true" />
                <h3 className="font-serif text-lg font-medium text-[#1C3322]">{title}</h3>
                <p className="text-sm text-[#676E6A] leading-relaxed">{body}</p>
              </div>
            ))}
          </section>

          <section className="p-8 md:p-10 rounded-[1.5rem] bg-[#F3EFE8]/60 border border-[#E2E6E3] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-2">
              <h2 className="font-serif text-xl md:text-2xl font-medium text-[#1C3322]">
                Curious how we source, or considering stocking us?
              </h2>
              <p className="text-sm text-[#676E6A] leading-relaxed">
                We are open about what we know and what we are still working on —
                including where we do not yet hold formal certification.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link href="/sustainability">
                <Button variant="botanical" size="lg" className="flex items-center gap-2">
                  Our sourcing <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

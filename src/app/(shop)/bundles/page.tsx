import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ArrowRight } from "lucide-react";
import { getBundles } from "@/lib/bundles";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Bundles",
  description: "Curated coconut sets — everything you need for coconut rice, breakfast, an active lifestyle or a self-care routine, at one flat price.",
  alternates: { canonical: "/bundles" },
};

const naira = (value: number) => `₦${Math.round(value).toLocaleString("en-NG")}`;

export default async function BundlesPage() {
  const bundles = await getBundles();

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 py-12 md:py-16 space-y-12">
        <Breadcrumbs items={[{ label: "Bundles" }]} />

        <header className="max-w-2xl space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-bold">Bundles</span>
          <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17] leading-[1.12]">
            Curated coconut sets
          </h1>
          <p className="text-sm md:text-base text-[#676E6A] leading-relaxed">
            Everything you need for a coconut rice meal, a better breakfast, an active month or a self-care
            routine — put together at one flat price.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {bundles.map((bundle) => {
            const savings =
              bundle.regularValue && bundle.regularValue > bundle.price
                ? bundle.regularValue - bundle.price
                : null;

            return (
              <Link
                key={bundle.id}
                href={`/bundles/${bundle.slug}`}
                className="group relative flex gap-5 p-5 rounded-[1.25rem] border border-[#E2E6E3] overflow-hidden bg-[#FAF8F5] hover:shadow-ambient-md hover-lift-luxury transition-all duration-500"
              >
                <div className="relative w-32 md:w-40 aspect-[4/5] rounded-[0.875rem] bg-[#F3EFE8] overflow-hidden shrink-0">
                  <Image
                    src={bundle.heroImageUrl}
                    alt={bundle.title}
                    fill
                    sizes="160px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {bundle.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#1C3322] text-[#FAF8F5] text-[8px] font-bold uppercase tracking-[0.1em]">
                      {bundle.badge}
                    </span>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#C9A227] block mb-1">Bundle</span>
                  <h2 className="font-serif text-lg font-medium text-[#161A17] leading-snug mb-1.5">{bundle.title}</h2>
                  <p className="text-xs text-[#676E6A] leading-relaxed line-clamp-3 mb-3">{bundle.tagline}</p>

                  <div className="mt-auto flex items-baseline gap-2">
                    <span className="font-serif text-xl font-bold text-[#1C3322]">{naira(bundle.price)}</span>
                    {bundle.regularValue && (
                      <span className="text-xs text-[#676E6A] line-through">{naira(bundle.regularValue)}</span>
                    )}
                  </div>
                  {savings && (
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9A227] mt-1">
                      You save {naira(savings)}
                    </p>
                  )}

                  <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1C3322] group-hover:text-[#C9A227] transition-colors">
                    View bundle
                    <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

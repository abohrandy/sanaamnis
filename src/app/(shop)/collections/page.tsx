import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LifestyleCommerceModules } from "@/components/shop/LifestyleCommerceModules";
import { Badge } from "@/components/ui/badge";

export const revalidate = 60;

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full space-y-16">
        {/* Intro Banner */}
        <div className="max-w-3xl space-y-4">
          <Badge variant="gold">LIFESTYLE COMMERCE SANCTUARY</Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-[#161A17]">
            Shop By Intent & Lifestyle
          </h1>
          <p className="text-xs md:text-sm text-[#676E6A] font-sans leading-relaxed">
            Tailored botanical formulations curated for holistic wellness, fitness endurance, epidermal lipid repair, culinary excellence, and luxury gift assemblages.
          </p>
        </div>

        {/* 7 Lifestyle Modules Container & Automated Recommendation Engine */}
        <LifestyleCommerceModules />
      </main>

      <Footer />
    </div>
  );
}


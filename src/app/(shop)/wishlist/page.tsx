import React from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { WishlistGrid } from "@/components/shop/WishlistGrid";

export const metadata: Metadata = {
  title: "Saved items",
  robots: { index: false, follow: true },
};

/**
 * Reads the shared wishlist store.
 *
 * This page previously kept its own localStorage key ("sana_amnis_wishlist"),
 * separate from the two other wishlist implementations elsewhere in the app, and
 * seeded a fabricated product on first visit so it would not look empty.
 */
export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 py-12 md:py-16 space-y-10">
        <Breadcrumbs items={[{ label: "Saved items" }]} />

        <div className="max-w-2xl space-y-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-bold">
            Your list
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17] leading-[1.12]">
            Saved items
          </h1>
          <p className="text-sm text-[#676E6A] leading-relaxed">
            Products you have saved to come back to. They stay here on this device.
          </p>
        </div>

        <WishlistGrid columns={4} />
      </main>

      <Footer />
    </div>
  );
}

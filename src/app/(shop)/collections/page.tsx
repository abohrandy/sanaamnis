import React from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LifestyleCommerceModules } from "@/components/shop/LifestyleCommerceModules";
import { Badge } from "@/components/ui/badge";
import { getProducts } from "@/lib/products";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Find the right Sana Amnis products for hydration, cooking, fitness, skin and hair, or gifting.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full space-y-16">
        <div className="max-w-3xl space-y-4">
          <Badge variant="gold">Collections</Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-[#161A17]">
            Shop by what you need it for
          </h1>
          <p className="text-sm text-[#676E6A] font-sans leading-relaxed">
            The same coconuts, put to different uses — hydration and recovery, everyday
            cooking, skin and hair care, or something to give.
          </p>
        </div>

        <LifestyleCommerceModules products={products} />
      </main>

      <Footer />
    </div>
  );
}

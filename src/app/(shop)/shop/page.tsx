import React, { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ShopClient } from "@/components/shop/ShopClient";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { getProducts, categoriesInUse } from "@/lib/products";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Shop all products",
  description:
    "Coconut water, milk powder, oils, flour, flakes, poundo and body care — made in Nigeria from Nigerian, home-grown coconuts.",
  alternates: { canonical: "/shop" },
};

function ShopGridSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default async function ShopPage() {
  const products = await getProducts();
  const categories = categoriesInUse(products);

  return (
    <>
      <Header />
      <main className="flex-grow bg-[#FAF8F5]">
        {/* ShopClient reads the category from the URL, which needs a Suspense
            boundary for this page to stay statically rendered. */}
        <Suspense fallback={<ShopGridSkeleton />}>
          <ShopClient
            products={products}
            categories={categories}
            bannerTitle="Every product"
            bannerSubtitle="The full range"
            bannerDescription="Coconut water, milk powder, oils, flour, flakes, poundo and body care — made in Nigeria from Nigerian, home-grown coconuts."
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

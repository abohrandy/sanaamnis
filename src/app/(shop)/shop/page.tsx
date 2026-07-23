import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { db } from "@/db";

// Real high-quality individual product image fallbacks
const MOCK_PRODUCTS = [
  {
    id: "1",
    title: "Extra Virgin Coconut Oil",
    slug: "extra-virgin-coconut-oil",
    category: "Organic Wellness",
    price: "15000",
    imageUrl: "https://images.unsplash.com/photo-1548364538-60b952c308b9?q=80&w=600",
  },
  {
    id: "2",
    title: "Sana Amnis Coconut Water",
    slug: "sana-amnis-coconut-water",
    category: "Organic Wellness",
    price: "3000",
    imageUrl: "https://images.unsplash.com/photo-1525385133336-25484cd6c648?q=80&w=600",
  },
  {
    id: "3",
    title: "Nourishing Coconut Body Butter",
    slug: "coconut-body-butter",
    category: "Premium Skincare",
    price: "18000",
    imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600",
  },
];

export const revalidate = 60; // ISR validation time

export default async function ShopPage() {
  let displayProducts = MOCK_PRODUCTS;

  try {
    const productsInDb = await db.query.products.findMany({
      where: (products, { eq }) => eq(products.isActive, true),
      with: {
        category: true,
        variants: true,
      },
    });

    if (productsInDb && productsInDb.length > 0) {
      displayProducts = productsInDb.map((p) => {
        const firstVariantPrice = p.variants?.[0]?.price || "0";
        const firstVariantImage = p.variants?.[0]?.imageUrl || "";
        return {
          id: p.id,
          title: p.title,
          slug: p.slug,
          category: p.category?.name || "Organic Wellness",
          price: firstVariantPrice,
          imageUrl: firstVariantImage || "https://images.unsplash.com/photo-1525385133336-25484cd6c648?q=80&w=600",
        };
      });
    }
  } catch (err) {
    console.error("DB query failed in shop page, falling back to mock products:", err);
  }

  return (
    <>
      <Header />
      <main className="flex-grow bg-[#faf9f6] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-200/60 pb-8 mb-12">
            <div>
              <nav className="text-[10px] uppercase tracking-widest text-neutral-500 mb-3">
                <Link href="/" className="hover:text-foreground">Home</Link> &nbsp;/&nbsp; <span className="text-foreground">Shop</span>
              </nav>
              <h1 className="font-serif text-4xl font-semibold tracking-tight text-[#1d4626]">
                The Shop
              </h1>
            </div>
            <p className="text-xs text-neutral-500 font-medium tracking-wide mt-4 sm:mt-0">
              Showing {displayProducts.length} Premium Formulations
            </p>
          </div>

          {/* Full Width Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map((prod) => (
              <Link
                key={prod.id}
                href={`/products/${prod.slug}`}
                className="group flex flex-col border border-neutral-200/60 overflow-hidden bg-white transition-all duration-300 hover:shadow-[0_15px_50px_rgba(53,94,59,0.08)] rounded-2xl"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#C9A227] font-bold block mb-1">
                      {prod.category}
                    </span>
                    <h3 className="font-serif text-base font-semibold text-[#1d4626] group-hover:text-[#3b6845] transition-colors leading-tight">
                      {prod.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <span className="font-serif font-bold text-[#1d4626]">₦{Number(prod.price).toLocaleString()}</span>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#1d4626] group-hover:text-[#3b6845] transition-colors flex items-center gap-1.5">
                      Details <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

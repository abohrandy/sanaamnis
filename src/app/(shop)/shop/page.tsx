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
    imageUrl: "https://drive.google.com/thumbnail?id=1cRxBW7bAXR5Alft8iGGt5AVugXPRusMY&sz=w1000",
  },
  {
    id: "2",
    title: "Sana Amnis Coconut Water",
    slug: "sana-amnis-coconut-water",
    category: "Organic Wellness",
    price: "4500",
    imageUrl: "https://drive.google.com/thumbnail?id=1Z9Yf9iquA-YUp0eGmrcM7xr411520Qgp&sz=w1000",
  },
  {
    id: "3",
    title: "Pure Coconut Milk Powder",
    slug: "pure-coconut-milk-powder",
    category: "Organic Wellness",
    price: "8500",
    imageUrl: "https://drive.google.com/thumbnail?id=11VjXF_JnUyd9JX6FIqcfMSkF4D5POY4M&sz=w1000",
  },
  {
    id: "4",
    title: "Nourishing Coconut Body Butter",
    slug: "coconut-body-butter",
    category: "Premium Skincare",
    price: "18000",
    imageUrl: "https://drive.google.com/thumbnail?id=1Xcc9CmWFaAEvsU4ovWMHKYkEiEhzN0cr&sz=w1000",
  },
  {
    id: "5",
    title: "Restorative Coconut Hair Mask",
    slug: "restorative-coconut-hair-mask",
    category: "Hair & Body",
    price: "14000",
    imageUrl: "https://drive.google.com/thumbnail?id=1--CLF51noixdnvV8HhLmosvtP75RDlRE&sz=w1000",
  },
  {
    id: "6",
    title: "Exfoliating Coconut Sugar Scrub",
    slug: "coconut-sugar-scrub",
    category: "Premium Skincare",
    price: "12500",
    imageUrl: "https://drive.google.com/thumbnail?id=1kfVkQ-lqEpTKfvtl_WT-zwa28NeEOO1n&sz=w1000",
  },
  {
    id: "7",
    title: "Toasted Organic Coconut Chips",
    slug: "organic-coconut-chips",
    category: "Gourmet Snacks",
    price: "3500",
    imageUrl: "https://drive.google.com/thumbnail?id=16WhogTSxDzbjaVewUFprCCPbN_mfhPxg&sz=w1000",
  },
  {
    id: "8",
    title: "Raw Organic Coconut Flour",
    slug: "raw-coconut-flour",
    category: "Culinary Essentials",
    price: "6000",
    imageUrl: "https://drive.google.com/thumbnail?id=1hk33UKAflm0EIoFg_sGRzbQ3jSZsPLUp&sz=w1000",
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

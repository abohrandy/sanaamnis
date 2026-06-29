import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ShoppingBag, SlidersHorizontal } from "lucide-react";
import { db } from "@/db";

// Fallback high-end products list for demonstration
const MOCK_PRODUCTS = [
  {
    id: "1",
    title: "Amnis Cashmere Overcoat",
    slug: "amnis-cashmere-overcoat",
    category: "Coats",
    price: "185000",
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600",
  },
  {
    id: "2",
    title: "Linen Minimalist Kimono",
    slug: "linen-minimalist-kimono",
    category: "Outerwear",
    price: "95000",
    imageUrl: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=600",
  },
  {
    id: "3",
    title: "Silk Ribbed Turtleneck",
    slug: "silk-ribbed-turtleneck",
    category: "Knitwear",
    price: "68000",
    imageUrl: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=600",
  },
  {
    id: "4",
    title: "Eco-Wool Pleated Trouser",
    slug: "eco-wool-pleated-trouser",
    category: "Trousers",
    price: "82000",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600",
  },
];

export const revalidate = 60; // ISR validation time

export default async function CatalogPage() {
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
          category: p.category?.name || "Uncategorized",
          price: firstVariantPrice,
          imageUrl: firstVariantImage || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600",
        };
      });
    }
  } catch (err) {
    console.error("DB query failed in catalog page, falling back to mock products:", err);
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-background py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border/40 pb-8 mb-12">
            <div>
              <nav className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                <Link href="/" className="hover:text-foreground">Home</Link> &nbsp;/&nbsp; <span className="text-foreground">Catalog</span>
              </nav>
              <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground">
                The Catalog
              </h1>
            </div>
            <p className="text-xs text-muted-foreground font-medium tracking-wide mt-4 sm:mt-0">
              Showing {displayProducts.length} Premium Pieces
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Filter Sidebar (Static Shell for UX representation) */}
            <aside className="w-full lg:w-64 shrink-0 space-y-8">
              <div className="flex items-center gap-2 border-b border-border/20 pb-4">
                <SlidersHorizontal className="w-4 h-4 text-foreground" />
                <span className="text-xs uppercase tracking-widest font-bold">Filters</span>
              </div>

              {/* Categories Filter Group */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Categories</h4>
                <div className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wider">
                  <span className="text-primary cursor-pointer">All Collections</span>
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Outerwear</span>
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Knitwear</span>
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Trousers</span>
                </div>
              </div>

              {/* Sorting Filter Group */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Sort By</h4>
                <div className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span className="text-foreground cursor-pointer">Default Selection</span>
                  <span className="hover:text-foreground cursor-pointer transition-colors">Price: Low to High</span>
                  <span className="hover:text-foreground cursor-pointer transition-colors">Price: High to Low</span>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="group flex flex-col border border-border/40 overflow-hidden bg-card transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={prod.imageUrl}
                      alt={prod.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                      {prod.category}
                    </span>
                    <h3 className="font-sans font-medium text-foreground text-sm mb-2 group-hover:text-primary transition-colors">
                      {prod.title}
                    </h3>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/20">
                      <span className="font-serif font-semibold text-primary">₦{Number(prod.price).toLocaleString()}</span>
                      <Link
                        href={`/products/${prod.slug}`}
                        className="text-xs font-semibold uppercase tracking-wider text-foreground hover:text-primary transition-colors flex items-center gap-1"
                      >
                        Details <ShoppingBag className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

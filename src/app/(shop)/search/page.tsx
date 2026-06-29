"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: string;
  imageUrl: string;
}

const MOCK_CATALOG: Product[] = [
  {
    id: "p1",
    title: "Amnis Extra Virgin Coconut Oil",
    slug: "extra-virgin-coconut-oil",
    category: "Edibles",
    price: "12500.00",
    imageUrl: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=600",
  },
  {
    id: "p2",
    title: "Whipped Coconut Body Butter",
    slug: "whipped-coconut-body-butter",
    category: "Skincare",
    price: "18000.00",
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600",
  },
  {
    id: "p3",
    title: "Volcanic Hydration Coconut Water",
    slug: "volcanic-hydration-coconut-water",
    category: "Beverages",
    price: "4500.00",
    imageUrl: "https://images.unsplash.com/photo-1540340561271-9d29158bf3ee?q=80&w=600",
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const addToCart = useCartStore((state) => state.addItem);

  const filteredProducts = MOCK_CATALOG.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-20 w-full space-y-12">
        {/* Search Header */}
        <div className="max-w-2xl space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">
            Storefront Query
          </span>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Botanical Archive Search
          </h1>
        </div>

        {/* Input Bar */}
        <div className="relative max-w-2xl bg-card border border-border/40 rounded-2xl p-2 flex items-center shadow-[0_10px_40px_rgba(53,94,59,0.02)]">
          <Search className="w-5 h-5 text-muted-foreground ml-3" />
          <input
            type="text"
            className="w-full bg-transparent border-0 outline-none focus:ring-0 text-sm py-3 px-3 text-foreground placeholder:text-muted-foreground/60"
            placeholder="Type search terms (e.g. oil, skincare, butter)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Results */}
        <div className="space-y-6">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
            {filteredProducts.length} Formulations Found
          </p>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="group bg-card rounded-2xl overflow-hidden hover:shadow-[0_10px_40px_rgba(53,94,59,0.03)] transition-all duration-300"
                >
                  <Link href={`/products/${p.slug}`}>
                    <div className="relative aspect-square bg-muted overflow-hidden">
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                      />
                    </div>
                  </Link>

                  <div className="p-6 space-y-3">
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">
                      {p.category}
                    </span>
                    <h3 className="font-serif text-base font-medium text-foreground line-clamp-1">
                      <Link href={`/products/${p.slug}`} className="hover:text-primary transition-colors">
                        {p.title}
                      </Link>
                    </h3>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-semibold text-primary">
                        ₦{parseFloat(p.price).toLocaleString()}
                      </span>
                      <button
                        onClick={() =>
                          addToCart({
                            variantId: `${p.id}-v1`,
                            productId: p.id,
                            sku: `${p.slug.toUpperCase()}-SKU`,
                            name: "Regular Size",
                            title: p.title,
                            price: parseFloat(p.price),
                            stock: 10,
                            imageUrl: p.imageUrl,
                          }, 1)
                        }
                        className="p-2 border border-border/40 rounded-full hover:bg-primary hover:text-white transition-colors duration-300"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-card border border-border/20 rounded-2xl max-w-2xl space-y-3">
              <p className="text-sm text-muted-foreground">
                No organic formulations found for search keywords.
              </p>
              <button
                onClick={() => setQuery("")}
                className="text-xs uppercase tracking-widest text-primary font-bold hover:underline"
              >
                Clear Search Query
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

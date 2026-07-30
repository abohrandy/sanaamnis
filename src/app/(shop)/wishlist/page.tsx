"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface WishlistItem {
  id: string;
  title: string;
  slug: string;
  price: string;
  imageUrl: string;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    const stored = localStorage.getItem("sana_amnis_wishlist");
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Seed default mock wishlist items to make page look premium and populated
      const defaultItems: WishlistItem[] = [
        {
          id: "p1",
          title: "Amnis Extra Virgin Coconut Oil",
          slug: "extra-virgin-coconut-oil",
          price: "12500.00",
          imageUrl: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=600",
        },
      ];
      setWishlist(defaultItems);
      localStorage.setItem("sana_amnis_wishlist", JSON.stringify(defaultItems));
    }
  }, []);

  const handleRemove = (id: string) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("sana_amnis_wishlist", JSON.stringify(updated));
  };

  const handleMoveToCart = (item: WishlistItem) => {
    addToCart({
      variantId: `${item.id}-v1`,
      productId: item.id,
      sku: `${item.slug.toUpperCase()}-SKU`,
      name: "Regular Size",
      title: item.title,
      price: parseFloat(item.price),
      stock: 10,
      imageUrl: item.imageUrl,
    }, 1);
    handleRemove(item.id);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-20 w-full space-y-12">
        {/* Header */}
        <div className="max-w-2xl space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">
            Customer Curation
          </span>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            My Desired Formulations
          </h1>
          <p className="text-xs text-muted-foreground">
            A private catalog of your saved items.
          </p>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="group bg-card border border-border/40 rounded-2xl overflow-hidden hover:shadow-[0_10px_40px_rgba(53,94,59,0.02)] transition-all duration-300"
              >
                <Link href={`/products/${item.slug}`}>
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                    />
                  </div>
                </Link>

                <div className="p-6 space-y-4">
                  <h3 className="font-serif text-base font-medium text-foreground">
                    <Link href={`/products/${item.slug}`} className="hover:text-primary transition-colors">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-sm font-semibold text-primary">
                    ₦{parseFloat(item.price).toLocaleString()}
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="py-3 px-4 bg-primary text-white text-[10px] uppercase tracking-widest font-semibold flex items-center justify-center gap-2 hover:bg-secondary transition-colors rounded-xl"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="py-3 px-4 border border-border/40 text-muted-foreground hover:text-destructive hover:bg-destructive/5 text-[10px] uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors rounded-xl"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-card border border-border/20 rounded-2xl max-w-xl mx-auto space-y-6 p-8">
            <p className="text-sm text-muted-foreground">
              Your wishlist contains no saved organic items.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center py-4 px-6 bg-primary text-white text-[10px] uppercase tracking-widest font-bold gap-2 hover:bg-secondary transition-all rounded-xl"
            >
              Browse Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

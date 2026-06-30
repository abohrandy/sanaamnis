import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ShoppingBag, SlidersHorizontal } from "lucide-react";
import { db } from "@/db";

// Fallback coconut products list for demonstration
const MOCK_PRODUCTS = [
  {
    id: "1",
    title: "Extra Virgin Coconut Oil",
    slug: "extra-virgin-coconut-oil",
    category: "Organic Wellness",
    price: "15000",
    imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLtEqIT_GCpHNQ86QNj1d3bPOlvb9nkQc6svZvyYlyg1Hk3RZHwiIAPv9YCbyw1u0Rj0p73zt-Argu2A7GH5nvmHI045TzwWA2e9fL9omZXhv5idqLb76Wg3h89GyuMytVRKzJIsliofcN_BAcgsvJVHo8b5f8Q8aqeRAb1U7k9geoURsq168OaQUixCGl-WU2SRNk4SwilDr4UJkc83bAJamhtHfvfo0sh9qggUZS3nksvuQahllqEWWw",
  },
  {
    id: "2",
    title: "Organic Coconut Water",
    slug: "organic-coconut-water",
    category: "Organic Wellness",
    price: "4500",
    imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLsnISaHCg5o21SrvBbZRdt8Qcl_tsL5caCWPyHPzlvMiBR7WZ5ltl4b6x8SXY7JoINwVeevisCReRMYVksaOuivD86v9Gd3sLH87Lekwd8eOJzsns4QOI3WRu2gIlhERvVW2nHQJG1wukkobTBbIcUviw8Y4_RBF6RIrCBnLg5Cb51z18bBhth15u82kTqhtDwxAPS-YjkJzyE6mYDYrLm7NIVKXYSAsOFHuC2U5ckPbXgKZHiQfLTm6VQ",
  },
  {
    id: "3",
    title: "Nourishing Coconut Body Butter",
    slug: "coconut-body-butter",
    category: "Premium Skincare",
    price: "18000",
    imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLsnISaHCg5o21SrvBbZRdt8Qcl_tsL5caCWPyHPzlvMiBR7WZ5ltl4b6x8SXY7JoINwVeevisCReRMYVksaOuivD86v9Gd3sLH87Lekwd8eOJzsns4QOI3WRu2gIlhERvVW2nHQJG1wukkobTBbIcUviw8Y4_RBF6RIrCBnLg5Cb51z18bBhth15u82kTqhtDwxAPS-YjkJzyE6mYDYrLm7NIVKXYSAsOFHuC2U5ckPbXgKZHiQfLTm6VQ",
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
          imageUrl: firstVariantImage || "https://lh3.googleusercontent.com/aida/AP1WRLsnISaHCg5o21SrvBbZRdt8Qcl_tsL5caCWPyHPzlvMiBR7WZ5ltl4b6x8SXY7JoINwVeevisCReRMYVksaOuivD86v9Gd3sLH87Lekwd8eOJzsns4QOI3WRu2gIlhERvVW2nHQJG1wukkobTBbIcUviw8Y4_RBF6RIrCBnLg5Cb51z18bBhth15u82kTqhtDwxAPS-YjkJzyE6mYDYrLm7NIVKXYSAsOFHuC2U5ckPbXgKZHiQfLTm6VQ",
        };
      });
    }
  } catch (err) {
    console.error("DB query failed in shop page, falling back to mock products:", err);
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
                <Link href="/" className="hover:text-foreground">Home</Link> &nbsp;/&nbsp; <span className="text-foreground">Shop</span>
              </nav>
              <h1 className="font-serif text-4xl font-semibold tracking-tight text-[#1d4626]">
                The Shop
              </h1>
            </div>
            <p className="text-xs text-muted-foreground font-medium tracking-wide mt-4 sm:mt-0">
              Showing {displayProducts.length} Premium Formulations
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Filter Sidebar */}
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
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Organic Wellness</span>
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Premium Skincare</span>
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
                  className="group flex flex-col border border-border/40 overflow-hidden bg-card transition-all duration-300 hover:shadow-lg rounded-2xl"
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

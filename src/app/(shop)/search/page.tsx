"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Search as SearchIcon } from "lucide-react";
import { ProductCard } from "@/components/ds/cards/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchProducts, CATALOG } from "@/lib/catalog";

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  // Searches the real catalog. This page used to filter a hardcoded list of three
  // products whose slugs did not exist, so every result led to a 404.
  const results = useMemo(() => (query.trim() ? searchProducts(query) : []), [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.replace(params.toString() ? `/search?${params}` : "/search", { scroll: false });
  };

  return (
    <>
      <div className="max-w-2xl space-y-5">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-bold">
          Search
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17] leading-[1.12]">
          Find a product
        </h1>

        <form onSubmit={handleSubmit} className="flex gap-3" role="search">
          <label htmlFor="search-input" className="sr-only">
            Search products
          </label>
          <Input
            id="search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “coconut oil” or “flour”"
            className="flex-1"
          />
          <Button variant="botanical" size="lg" type="submit" className="shrink-0">
            <SearchIcon className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
      </div>

      {query.trim() === "" ? (
        <section className="space-y-6">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#676E6A] font-bold">
            Everything we sell
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {CATALOG.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            ))}
          </div>
        </section>
      ) : results.length === 0 ? (
        <div className="py-20 px-8 text-center rounded-[1.5rem] border border-dashed border-[#E2E6E3] bg-[#F3EFE8]/40 space-y-4">
          <h2 className="font-serif text-xl font-medium text-[#161A17]">
            Nothing matched “{query}”
          </h2>
          <p className="text-sm text-[#676E6A] max-w-sm mx-auto leading-relaxed">
            Try a shorter or more general word — “oil”, “water”, “flour”.
          </p>
          <Link href="/shop" className="inline-block pt-1">
            <Button variant="botanical" size="md">
              Browse all products
            </Button>
          </Link>
        </div>
      ) : (
        <section className="space-y-6">
          <h2
            className="text-[10px] uppercase tracking-[0.2em] text-[#676E6A] font-bold"
            aria-live="polite"
          >
            {results.length} {results.length === 1 ? "result" : "results"} for “{query}”
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {results.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 py-12 md:py-16 space-y-12">
        <Suspense fallback={null}>
          <SearchResults />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ProductCard } from "@/components/ds/cards/product-card";
import { CollectionBanner } from "./CollectionBanner";
import { FilterSidebar } from "./FilterSidebar";
import { EmptyState } from "@/components/ds/feedback/EmptyState";
import { useWishlistStore } from "@/store/wishlistStore";
import { useHydrated } from "@/hooks/useHydratedStore";
import { SlidersHorizontal, LayoutGrid, Grid3X3, ArrowDown } from "lucide-react";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import {
  CATEGORIES,
  startingPrice,
  type CatalogProduct,
  type CategorySlug,
} from "@/lib/catalog";

export interface ShopClientProps {
  products: CatalogProduct[];
  categories: Array<{ id: string; slug: string; name: string; count?: number }>;
  bannerTitle?: string;
  bannerSubtitle?: string;
  bannerDescription?: string;
}

const PAGE_SIZE = 8;

export function ShopClient({
  products,
  categories,
  bannerTitle,
  bannerSubtitle,
  bannerDescription,
}: ShopClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // The category lives in the URL so /shop?category=hydration is linkable from
  // the homepage tiles and survives a refresh or a shared link.
  const selectedCategory = searchParams.get("category") ?? "all";
  const sortBy = searchParams.get("sort") ?? "featured";

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [gridColumns, setGridColumns] = useState<3 | 4>(4);

  const hydrated = useHydrated();
  const wishlist = useWishlistStore((s) => s.items);
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || value === "all" || value === "featured") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      setVisibleCount(PAGE_SIZE);
    },
    [router, pathname, searchParams]
  );

  const filteredProducts = useMemo(() => {
    let list = products;

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.categorySlug === selectedCategory);
    }

    const sorted = [...list];
    if (sortBy === "price_asc") {
      sorted.sort((a, b) => startingPrice(a) - startingPrice(b));
    } else if (sortBy === "price_desc") {
      sorted.sort((a, b) => startingPrice(b) - startingPrice(a));
    } else if (sortBy === "name") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  }, [products, selectedCategory, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const selectedCategoryName =
    selectedCategory !== "all"
      ? CATEGORIES[selectedCategory as CategorySlug]?.name ?? selectedCategory
      : null;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 py-8 font-sans">
      <CollectionBanner
        title={bannerTitle}
        subtitle={bannerSubtitle}
        description={bannerDescription}
        itemCount={filteredProducts.length}
      />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E2E6E3]">
        <div className="flex items-center gap-3">
          <Button
            variant="alabaster"
            size="sm"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#C9A227]" /> Filter & sort
          </Button>

          <span
            className="text-[11px] font-sans uppercase font-bold tracking-[0.16em] text-[#676E6A]"
            aria-live="polite"
          >
            Showing {displayedProducts.length} of {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </span>
        </div>

        {selectedCategoryName && (
          <Tag active onRemove={() => setParam("category", null)}>
            {selectedCategoryName}
          </Tag>
        )}

        <div className="hidden lg:flex items-center gap-2">
          <button
            type="button"
            onClick={() => setGridColumns(3)}
            aria-pressed={gridColumns === 3}
            aria-label="Show three products per row"
            className={`p-2 rounded-[0.5rem] border transition-colors cursor-pointer ${
              gridColumns === 3
                ? "bg-[#1C3322] text-[#FAF8F5] border-transparent shadow-ambient-sm"
                : "bg-[#FAF8F5] text-[#161A17] border-[#E2E6E3] hover:bg-[#F3EFE8]"
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setGridColumns(4)}
            aria-pressed={gridColumns === 4}
            aria-label="Show four products per row"
            className={`p-2 rounded-[0.5rem] border transition-colors cursor-pointer ${
              gridColumns === 4
                ? "bg-[#1C3322] text-[#FAF8F5] border-transparent shadow-ambient-sm"
                : "bg-[#FAF8F5] text-[#161A17] border-[#E2E6E3] hover:bg-[#F3EFE8]"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-12">
        <FilterSidebar
          categories={categories.map((c) => ({ id: c.slug, name: c.name, count: c.count }))}
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => setParam("category", id)}
          sortBy={sortBy}
          onSelectSort={(sort) => setParam("sort", sort)}
          priceRange={[0, 500000]}
          onPriceChange={() => {}}
          onResetFilters={() => {
            setParam("category", null);
            setParam("sort", null);
          }}
          isMobileOpen={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        <div className="flex-1">
          {displayedProducts.length === 0 ? (
            <EmptyState
              title="Nothing here yet"
              description="No products match this filter. Try another category, or browse everything."
              actionText="Show all products"
              onAction={() => setParam("category", null)}
            />
          ) : (
            <div
              className={`grid grid-cols-2 gap-4 md:gap-6 ${
                gridColumns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
              }`}
            >
              {displayedProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={i < 4}
                  sizes={
                    gridColumns === 3
                      ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 380px"
                      : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                  }
                  // Only trust the store after hydration, otherwise the server HTML
                  // and the first client render disagree.
                  isWishlisted={
                    hydrated && wishlist.some((w) => w.productId === product.id)
                  }
                  onToggleWishlist={(p) =>
                    toggleWishlist({
                      productId: p.id,
                      slug: p.slug,
                      title: p.title,
                      price: startingPrice(p),
                      imageUrl: p.images[0],
                      categoryName: CATEGORIES[p.categorySlug].name,
                    })
                  }
                />
              ))}
            </div>
          )}

          {hasMore && (
            <div className="mt-14 text-center">
              <Button
                variant="alabaster"
                size="lg"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="flex items-center gap-2 mx-auto"
              >
                Load more <ArrowDown className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

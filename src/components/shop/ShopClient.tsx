"use client";

import React, { useState, useMemo } from "react";
import { ProductCard } from "@/components/ds/cards/product-card";
import { CollectionBanner } from "./CollectionBanner";
import { FilterSidebar } from "./FilterSidebar";
import { QuickViewModal } from "./QuickViewModal";
import { EmptyState } from "@/components/ds/feedback/EmptyState";
import { useCartStore } from "@/store/cartStore";
import { SlidersHorizontal, LayoutGrid, Grid3X3, ArrowDown } from "lucide-react";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";

export interface ProductItem {
  id: string;
  title: string;
  slug: string;
  category: { id: string; name: string } | string;
  price: number;
  imageUrl: string;
  description?: string;
  variants?: Array<{
    id: string;
    name: string;
    price: number;
    stock: number;
  }>;
}

export interface ShopClientProps {
  initialProducts: ProductItem[];
  categories: Array<{ id: string; name: string; count?: number }>;
  bannerTitle?: string;
  bannerSubtitle?: string;
  bannerDescription?: string;
}

export function ShopClient({
  initialProducts,
  categories,
  bannerTitle,
  bannerSubtitle,
  bannerDescription,
}: ShopClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [gridColumns, setGridColumns] = useState<3 | 4>(4);

  const addItem = useCartStore((state) => state.addItem);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Category Filter
    if (selectedCategory !== "all") {
      list = list.filter((p) => {
        const catId = typeof p.category === "object" ? p.category.id : p.category;
        const catName = typeof p.category === "object" ? p.category.name : p.category;
        return catId === selectedCategory || catName === selectedCategory;
      });
    }

    // Sort Logic
    if (sortBy === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      list.sort((b, a) => a.price - b.price);
    } else if (sortBy === "newest") {
      list.reverse();
    }

    return list;
  }, [initialProducts, selectedCategory, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (product: ProductItem) => {
    const variantId = product.variants?.[0]?.id || product.id;
    const variantName = product.variants?.[0]?.name || "250ml Glass Bottle";
    const stock = product.variants?.[0]?.stock || 50;
    addItem({
      variantId,
      productId: product.id,
      sku: product.slug,
      name: variantName,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      stock,
    }, 1);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 py-8 font-sans">
      {/* Editorial Collection Hero Banner */}
      <CollectionBanner
        title={bannerTitle}
        subtitle={bannerSubtitle}
        description={bannerDescription}
        itemCount={filteredProducts.length}
      />

      {/* Control Bar (Mobile Filter Toggle, Grid Switcher & Count) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E2E6E3]">
        <div className="flex items-center gap-3">
          <Button
            variant="alabaster"
            size="sm"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#C9A227]" /> Filters & Sort
          </Button>

          <span className="text-xs font-sans uppercase font-bold tracking-[0.18em] text-[#676E6A]">
            Showing {displayedProducts.length} of {filteredProducts.length} Formulations
          </span>
        </div>

        {/* Active Filter Chips */}
        {selectedCategory !== "all" && (
          <div className="flex items-center gap-2">
            <Tag active onRemove={() => setSelectedCategory("all")}>
              Category: {categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}
            </Tag>
          </div>
        )}

        {/* Desktop Grid Switcher */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setGridColumns(3)}
            className={`p-2 rounded-[0.5rem] border transition-colors cursor-pointer ${
              gridColumns === 3 ? "bg-[#1C3322] text-[#FAF8F5] border-transparent shadow-ambient-sm" : "bg-[#FAF8F5] text-[#161A17] border-[#E2E6E3] hover:bg-[#F3EFE8]"
            }`}
            title="3 Column Grid"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setGridColumns(4)}
            className={`p-2 rounded-[0.5rem] border transition-colors cursor-pointer ${
              gridColumns === 4 ? "bg-[#1C3322] text-[#FAF8F5] border-transparent shadow-ambient-sm" : "bg-[#FAF8F5] text-[#161A17] border-[#E2E6E3] hover:bg-[#F3EFE8]"
            }`}
            title="4 Column Grid"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Catalog Section */}
      <div className="flex gap-12">
        {/* Sticky Filter Sidebar Component */}
        <FilterSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sortBy={sortBy}
          onSelectSort={setSortBy}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          onResetFilters={() => {
            setSelectedCategory("all");
            setSortBy("featured");
          }}
          isMobileOpen={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        {/* Product Grid Area */}
        <div className="flex-1">
          {displayedProducts.length === 0 ? (
            <EmptyState
              title="No Formulations Match Your Selection"
              description="Try broadening your category filter or resetting sort parameters to discover available organic elixirs."
              actionText="Reset All Filters"
              onAction={() => setSelectedCategory("all")}
            />
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-8 ${
                gridColumns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
              }`}
            >
              {displayedProducts.map((p) => {
                const categoryName = typeof p.category === "object" ? p.category.name : p.category;

                return (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    title={p.title}
                    slug={p.slug}
                    category={categoryName || "Cold-Pressed"}
                    price={p.price}
                    imageUrl={p.imageUrl}
                    isWishlisted={wishlistIds.includes(p.id)}
                    onAddToCart={() => handleAddToCart(p)}
                    onToggleWishlist={() => toggleWishlist(p.id)}
                  />
                );
              })}
            </div>
          )}

          {/* Load More / Infinite Scroll Action Trigger */}
          {hasMore && (
            <div className="mt-16 text-center">
              <Button
                variant="alabaster"
                size="lg"
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="py-4 text-xs font-bold uppercase tracking-[0.2em]"
              >
                Load More Formulations <ArrowDown className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal Overlay */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onToggleWishlist={(id) => toggleWishlist(id)}
      />
    </div>
  );
}


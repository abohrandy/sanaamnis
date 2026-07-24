"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, Check, RotateCcw } from "lucide-react";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";

export interface FilterSidebarProps {
  categories: Array<{ id: string; name: string; count?: number }>;
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  sortBy: string;
  onSelectSort: (sort: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  onResetFilters: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const SORT_OPTIONS = [
  { id: "featured", label: "Featured Sanctuary" },
  { id: "newest", label: "Newest Harvest" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
];

export function FilterSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSelectSort,
  priceRange,
  onPriceChange,
  onResetFilters,
  isMobileOpen,
  onCloseMobile,
}: FilterSidebarProps) {
  const filterContent = (
    <div className="space-y-8 font-sans">
      {/* Sorting Section */}
      <div>
        <h4 className="text-[10px] uppercase font-bold tracking-[0.22em] text-[#C9A227] mb-3">
          Sort Sanctuary
        </h4>
        <div className="space-y-1.5">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelectSort(option.id)}
              className={`w-full text-left px-3 py-2 rounded-[0.5rem] text-xs font-semibold uppercase tracking-[0.18em] transition-colors flex items-center justify-between cursor-pointer ${
                sortBy === option.id
                  ? "bg-[#1C3322] text-[#FAF8F5] shadow-ambient-sm"
                  : "text-[#161A17] hover:bg-[#F3EFE8]"
              }`}
            >
              <span>{option.label}</span>
              {sortBy === option.id && <Check className="w-3.5 h-3.5 text-[#C9A227]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="pt-6 border-t border-[#E2E6E3]">
        <h4 className="text-[10px] uppercase font-bold tracking-[0.22em] text-[#C9A227] mb-3">
          Categories
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory("all")}
            className={`w-full text-left px-3 py-2 rounded-[0.5rem] text-xs font-semibold uppercase tracking-[0.18em] transition-colors flex items-center justify-between cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#1C3322] text-[#FAF8F5] shadow-ambient-sm"
                : "text-[#161A17] hover:bg-[#F3EFE8]"
            }`}
          >
            <span>All Formulations</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-[0.5rem] text-xs font-semibold uppercase tracking-[0.18em] transition-colors flex items-center justify-between cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#1C3322] text-[#FAF8F5] shadow-ambient-sm"
                  : "text-[#161A17] hover:bg-[#F3EFE8]"
              }`}
            >
              <span>{cat.name}</span>
              {cat.count !== undefined && (
                <span className="text-[9px] opacity-70">({cat.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Filter Trigger */}
      <div className="pt-6 border-t border-[#E2E6E3]">
        <button
          onClick={onResetFilters}
          className="w-full py-2.5 px-3 rounded-[0.5rem] border border-[#E2E6E3] bg-[#FAF8F5] text-[10px] uppercase font-bold tracking-[0.2em] text-[#676E6A] hover:text-[#1C3322] hover:bg-[#F3EFE8] transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-28 h-fit p-6 rounded-[1.25rem] border border-[#E2E6E3] bg-[#FAF8F5] glass-alabaster shadow-ambient-sm">
        {filterContent}
      </aside>

      {/* Mobile Slide-Over Filter Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-[#161A17]/60 backdrop-blur-sm z-50 lg:hidden cursor-pointer"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xs bg-[#FAF8F5] border-l border-[#E2E6E3] z-50 p-6 overflow-y-auto lg:hidden shadow-ambient-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E2E6E3]">
                  <div className="flex items-center gap-2 text-[#161A17]">
                    <SlidersHorizontal className="w-5 h-5 text-[#C9A227]" />
                    <h3 className="font-serif text-lg font-medium">Filter Selection</h3>
                  </div>
                  <button onClick={onCloseMobile} className="p-2 text-[#161A17]" aria-label="Close filters">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {filterContent}
              </div>

              <div className="pt-6 border-t border-[#E2E6E3] mt-8">
                <Button variant="botanical" size="lg" className="w-full py-4 text-xs" onClick={onCloseMobile}>
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

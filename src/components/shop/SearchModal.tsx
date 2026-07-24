"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Tag } from "@/components/ui/tag";

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "Raw Virgin Oil",
  "Cold-Pressed Nectar",
  "Coconut Water Elixir",
  "Artisanal Butter",
  "Organic Hair Nourisher",
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#161A17]/70 backdrop-blur-md z-50 cursor-pointer"
          />

          {/* Modal Overlay Content */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50"
          >
            <div className="rounded-[1.25rem] border border-[#E2E6E3] bg-[#FAF8F5] glass-alabaster shadow-ambient-lg p-8 flex flex-col">
              {/* Search Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C9A227]" />
                  <span className="font-serif text-lg font-medium text-[#161A17]">Botanical Search</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-[#F3EFE8] text-[#161A17] transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar Input */}
              <div className="mb-6">
                <Input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search organic elixirs, ingredients, or recipes..."
                  icon={<Search className="w-5 h-5 text-[#1C3322]" />}
                  className="text-base"
                />
              </div>

              {/* Popular Searches */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-[#676E6A] mb-3">
                  Trending Elixirs & Formulas
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {POPULAR_SEARCHES.map((term) => (
                    <Tag
                      key={term}
                      onClick={() => setQuery(term)}
                      className={query === term ? "bg-[#1C3322] text-[#FAF8F5]" : ""}
                    >
                      {term}
                    </Tag>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              {query.trim() && (
                <div className="pt-4 border-t border-[#E2E6E3] flex justify-end">
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] font-bold text-[#1C3322] hover:text-[#C9A227] transition-colors"
                  >
                    View All Results for "{query}" <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

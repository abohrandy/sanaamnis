"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchProducts, formatNaira, startingPrice, categoryOrFallback } from "@/lib/catalog";

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTIONS = ["Coconut oil", "Coconut water", "Milk powder", "Flour", "Flakes"];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Actually searches now. The modal previously offered suggestion chips that led
  // nowhere and never returned a single result.
  const results = useMemo(() => (query.trim() ? searchProducts(query, 5) : []), [query]);

  useEffect(() => {
    if (!isOpen) return;
    setQuery("");
    // Focus once the entrance animation has started, otherwise the caret jumps.
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#161A17]/70 backdrop-blur-md z-50 cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.985 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            className="fixed top-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50"
          >
            <div className="rounded-[1.25rem] border border-[#E2E6E3] bg-[#FAF8F5] glass-alabaster shadow-ambient-lg p-6 md:p-7 flex flex-col max-h-[80vh]">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-lg font-medium text-[#161A17]">
                  Search products
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="p-2 rounded-full hover:bg-[#F3EFE8] text-[#161A17] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={submit} role="search" className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#676E6A] pointer-events-none z-10"
                  aria-hidden="true"
                />
                <label htmlFor="modal-search" className="sr-only">
                  Search products
                </label>
                <Input
                  id="modal-search"
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try “coconut oil” or “flour”"
                  className="pl-11 w-full"
                />
              </form>

              {query.trim() === "" ? (
                <div className="mt-6 space-y-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#676E6A] font-bold">
                    Popular searches
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {/* Buttons rather than the Tag span, so these are reachable by
                        keyboard like every other control in the dialog. */}
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setQuery(s)}
                        className="px-3.5 py-1.5 rounded-full border border-[#E2E6E3] bg-[#FAF8F5] text-[11px] font-semibold text-[#161A17] hover:border-[#1C3322] hover:text-[#1C3322] transition-colors cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <p className="mt-6 text-sm text-[#676E6A] text-center py-8">
                  Nothing matched “{query}”. Try a more general word.
                </p>
              ) : (
                <ul className="mt-5 overflow-y-auto divide-y divide-[#E2E6E3]/70">
                  {results.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-4 p-3 rounded-[0.75rem] hover:bg-[#F3EFE8] transition-colors"
                      >
                        <div className="relative w-12 h-14 rounded-[0.5rem] overflow-hidden bg-[#F3EFE8] border border-[#E2E6E3] shrink-0">
                          <Image
                            src={product.images[0]}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] uppercase tracking-[0.16em] text-[#676E6A] font-semibold block">
                            {categoryOrFallback(product.categorySlug).name}
                          </span>
                          <span className="font-serif text-sm font-medium text-[#161A17] block truncate">
                            {product.title}
                          </span>
                        </div>
                        <span className="font-serif text-sm font-semibold text-[#1C3322] shrink-0">
                          {formatNaira(startingPrice(product))}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {query.trim() !== "" && results.length > 0 && (
                <Link
                  href={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={onClose}
                  className="mt-4 pt-4 border-t border-[#E2E6E3] inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1C3322] hover:text-[#C9A227] transition-colors"
                >
                  See all results <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

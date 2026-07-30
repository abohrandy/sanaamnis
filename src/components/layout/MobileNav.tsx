"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ShoppingBag, Heart, User, ChevronDown, Sparkles, BookOpen, ChefHat, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount: number;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  session: any;
}

export function MobileNav({
  isOpen,
  onClose,
  cartCount,
  onOpenSearch,
  onOpenCart,
  onOpenWishlist,
  session,
}: MobileNavProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

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
            className="fixed inset-0 bg-[#161A17]/60 backdrop-blur-sm z-50 md:hidden cursor-pointer"
          />

          {/* Slide Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 w-full max-w-sm bg-[#FAF8F5] border-r border-[#E2E6E3] z-50 flex flex-col shadow-ambient-lg md:hidden overflow-hidden"
          >
            {/* Top Drawer Header */}
            <div className="p-6 border-b border-[#E2E6E3] flex items-center justify-between">
              <Link href="/" onClick={onClose} className="flex items-center gap-2">
                <Image
                  src="/logo_long.png"
                  alt="Sana Amnis"
                  width={200}
                  height={40}
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-2.5 rounded-full hover:bg-[#F3EFE8] text-[#161A17] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Pills */}
            <div className="px-6 py-4 border-b border-[#E2E6E3] bg-[#F3EFE8]/50 flex items-center justify-between">
              <button
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
                className="flex-1 py-2.5 px-3 rounded-[0.5rem] bg-[#FAF8F5] border border-[#E2E6E3] text-xs font-sans font-semibold uppercase tracking-[0.18em] text-[#161A17] flex items-center justify-center gap-2 shadow-ambient-sm mr-2"
              >
                <Search className="w-4 h-4 text-[#C9A227]" /> Search
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenWishlist();
                }}
                className="p-2.5 rounded-[0.5rem] bg-[#FAF8F5] border border-[#E2E6E3] text-[#161A17] hover:text-[#C9A227] transition-colors shadow-ambient-sm mr-2"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenCart();
                }}
                className="p-2.5 rounded-[0.5rem] bg-[#1C3322] text-[#FAF8F5] relative shadow-ambient-sm"
                aria-label="Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A227] text-[#FAF8F5] text-[8px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Navigation Menu Links */}
            <div className="flex-1 overflow-y-auto p-6 space-y-2 text-sm font-sans font-semibold uppercase tracking-[0.2em] text-[#161A17]">
              {/* Home Link */}
              <Link
                href="/"
                onClick={onClose}
                className="block py-3 border-b border-[#E2E6E3]/60 hover:text-[#1C3322] transition-colors"
              >
                Home
              </Link>

              {/* Selection Accordion */}
              <div className="border-b border-[#E2E6E3]/60 py-3">
                <button
                  onClick={() => toggleSection("selection")}
                  className="w-full flex items-center justify-between text-left hover:text-[#1C3322] transition-colors"
                >
                  <span>Selection</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      expandedSection === "selection" ? "rotate-180 text-[#C9A227]" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedSection === "selection" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-4 pt-3 space-y-2 text-xs text-[#676E6A] font-normal lowercase"
                    >
                      <Link href="/shop" onClick={onClose} className="block py-1 capitalize hover:text-[#1C3322]">
                        All Organic Oils
                      </Link>
                      <Link href="/collections" onClick={onClose} className="block py-1 capitalize hover:text-[#1C3322]">
                        Cold-Pressed Nectars
                      </Link>
                      <Link href="/collections" onClick={onClose} className="block py-1 capitalize hover:text-[#1C3322]">
                        Artisanal Butters
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Botanical Recipes */}
              <Link
                href="/recipes"
                onClick={onClose}
                className="flex items-center justify-between py-3 border-b border-[#E2E6E3]/60 hover:text-[#1C3322] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-[#1C3322]" /> Recipes
                </span>
              </Link>

              {/* Gazette Journal */}
              <Link
                href="/blog"
                onClick={onClose}
                className="flex items-center justify-between py-3 border-b border-[#E2E6E3]/60 hover:text-[#1C3322] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#1C3322]" /> Gazette Journal
                </span>
              </Link>

              {/* Ethos */}
              <Link
                href="/about"
                onClick={onClose}
                className="flex items-center justify-between py-3 border-b border-[#E2E6E3]/60 hover:text-[#1C3322] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-[#1C3322]" /> Our Ethos
                </span>
              </Link>
            </div>

            {/* Bottom Account & Footer */}
            <div className="p-6 border-t border-[#E2E6E3] bg-[#F3EFE8]/50">
              {session ? (
                <div className="space-y-3">
                  <p className="text-xs font-sans text-[#161A17] font-semibold">
                    Signed in as <span className="text-[#1C3322]">{session.user.name}</span>
                  </p>
                  <Link href="/account" onClick={onClose} className="block w-full">
                    <Button variant="alabaster" size="sm" className="w-full">
                      Account Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link href="/login" onClick={onClose} className="block w-full">
                  <Button variant="botanical" size="md" className="w-full">
                    Client Sign In
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

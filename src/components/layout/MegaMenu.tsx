"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ChefHat, BookOpen, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface MegaMenuProps {
  type: "selection" | "collections" | "recipes" | "journal";
  onClose: () => void;
}

export function MegaMenu({ type, onClose }: MegaMenuProps) {
  if (type === "selection" || type === "collections") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.99 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-full left-0 right-0 w-full glass-alabaster dark:glass-obsidian border-b border-[#E2E6E3] shadow-ambient-lg p-10 z-40"
        onMouseLeave={onClose}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
          {/* Categories List */}
          <div className="col-span-3 space-y-4 border-r border-[#E2E6E3]/60 pr-8">
            <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-bold text-[#C9A227] block">
              Curated Formulations
            </span>
            <ul className="space-y-3 font-sans text-xs uppercase tracking-[0.18em] font-semibold text-[#161A17] dark:text-[#FAF8F5]">
              <li>
                <Link href="/shop" onClick={onClose} className="hover:text-[#1C3322] dark:hover:text-[#C9A227] transition-colors flex items-center justify-between">
                  All Organic Oils <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/collections" onClick={onClose} className="hover:text-[#1C3322] dark:hover:text-[#C9A227] transition-colors flex items-center justify-between">
                  Cold-Pressed Nectars <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/collections" onClick={onClose} className="hover:text-[#1C3322] dark:hover:text-[#C9A227] transition-colors flex items-center justify-between">
                  Artisanal Butters <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/collections" onClick={onClose} className="hover:text-[#1C3322] dark:hover:text-[#C9A227] transition-colors flex items-center justify-between">
                  Hair & Skin Elixirs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured Product Card */}
          <div className="col-span-5 grid grid-cols-2 gap-4">
            <div className="rounded-[1rem] bg-[#F3EFE8] dark:bg-[#1C1C1E] p-4 flex flex-col justify-between border border-[#E2E6E3]/60">
              <div>
                <Badge variant="gold" className="mb-2">POPULAR</Badge>
                <h4 className="font-serif text-base font-medium text-[#161A17] dark:text-[#FAF8F5] mb-1">
                  Raw Virgin Coconut Oil
                </h4>
                <p className="text-xs text-[#676E6A] font-sans line-clamp-2">
                  First cold-pressing from unheated organic coconuts.
                </p>
              </div>
              <Link href="/shop" onClick={onClose} className="mt-4 text-[10px] uppercase font-bold tracking-[0.2em] text-[#1C3322] dark:text-[#C9A227] inline-flex items-center gap-1">
                Explore Formula <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="rounded-[1rem] bg-[#F3EFE8] dark:bg-[#1C1C1E] p-4 flex flex-col justify-between border border-[#E2E6E3]/60">
              <div>
                <Badge variant="botanical" className="mb-2">NEW HARVEST</Badge>
                <h4 className="font-serif text-base font-medium text-[#161A17] dark:text-[#FAF8F5] mb-1">
                  Organic Coconut Water Elixir
                </h4>
                <p className="text-xs text-[#676E6A] font-sans line-clamp-2">
                  Pure bio-active hydration packed with natural electrolytes.
                </p>
              </div>
              <Link href="/shop" onClick={onClose} className="mt-4 text-[10px] uppercase font-bold tracking-[0.2em] text-[#1C3322] dark:text-[#C9A227] inline-flex items-center gap-1">
                Explore Formula <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Editorial Banner */}
          <div className="col-span-4 rounded-[1rem] bg-[#1C3322] text-[#FAF8F5] p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="z-10">
              <Sparkles className="w-5 h-5 text-[#C9A227] mb-3" />
              <span className="text-[9px] uppercase tracking-[0.25em] font-sans font-bold text-[#C9A227] block mb-1">
                Sana Guarantee
              </span>
              <h4 className="font-serif text-xl font-medium mb-2">100% Unrefined & Zero Additives</h4>
              <p className="text-xs text-[#FAF8F5]/80 font-sans leading-relaxed">
                Directly harvested from smallholder organic farms in Badagry & Epe.
              </p>
            </div>
            <Link href="/about" onClick={onClose} className="mt-4 text-[10px] uppercase font-bold tracking-[0.2em] text-[#C9A227] z-10 inline-flex items-center gap-1">
              Read Sourcing Ethos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === "recipes") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.99 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-full left-0 right-0 w-full glass-alabaster dark:glass-obsidian border-b border-[#E2E6E3] shadow-ambient-lg p-10 z-40"
        onMouseLeave={onClose}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
          <div className="col-span-4 space-y-4 border-r border-[#E2E6E3]/60 pr-8">
            <div className="flex items-center gap-2 text-[#1C3322] dark:text-[#C9A227]">
              <ChefHat className="w-5 h-5" />
              <span className="font-serif text-lg font-medium text-[#161A17] dark:text-[#FAF8F5]">
                Botanical Culinary Guides
              </span>
            </div>
            <p className="text-xs text-[#676E6A] font-sans leading-relaxed">
              Explore artisanal recipes designed by master nutritionists to elevate daily vitality and organic cooking.
            </p>
            <Link href="/recipes" onClick={onClose} className="inline-flex items-center gap-2 text-xs font-sans uppercase font-bold tracking-[0.2em] text-[#1C3322] dark:text-[#C9A227]">
              View All Recipes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="col-span-8 grid grid-cols-3 gap-4">
            <div className="rounded-[1rem] bg-[#F3EFE8] dark:bg-[#1C1C1E] p-4 flex flex-col justify-between border border-[#E2E6E3]/60">
              <Badge variant="botanical" className="w-fit mb-2">EASY</Badge>
              <h4 className="font-serif text-sm font-medium text-[#161A17] dark:text-[#FAF8F5] mb-1">
                Golden Turmeric Coconut Tonic
              </h4>
              <span className="text-[10px] uppercase font-sans text-[#676E6A]">10 Mins Prep</span>
            </div>

            <div className="rounded-[1rem] bg-[#F3EFE8] dark:bg-[#1C1C1E] p-4 flex flex-col justify-between border border-[#E2E6E3]/60">
              <Badge variant="gold" className="w-fit mb-2">ARTISANAL</Badge>
              <h4 className="font-serif text-sm font-medium text-[#161A17] dark:text-[#FAF8F5] mb-1">
                Raw Coconut Hair Mask Ritual
              </h4>
              <span className="text-[10px] uppercase font-sans text-[#676E6A]">15 Mins Prep</span>
            </div>

            <div className="rounded-[1rem] bg-[#F3EFE8] dark:bg-[#1C1C1E] p-4 flex flex-col justify-between border border-[#E2E6E3]/60">
              <Badge variant="botanical" className="w-fit mb-2">MASTER</Badge>
              <h4 className="font-serif text-sm font-medium text-[#161A17] dark:text-[#FAF8F5] mb-1">
                Cold-Pressed Coconut Butter Spread
              </h4>
              <span className="text-[10px] uppercase font-sans text-[#676E6A]">25 Mins Prep</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === "journal") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.99 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-full left-0 right-0 w-full glass-alabaster dark:glass-obsidian border-b border-[#E2E6E3] shadow-ambient-lg p-10 z-40"
        onMouseLeave={onClose}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
          <div className="col-span-4 space-y-4 border-r border-[#E2E6E3]/60 pr-8">
            <div className="flex items-center gap-2 text-[#1C3322] dark:text-[#C9A227]">
              <BookOpen className="w-5 h-5" />
              <span className="font-serif text-lg font-medium text-[#161A17] dark:text-[#FAF8F5]">
                Sanctuary Journal
              </span>
            </div>
            <p className="text-xs text-[#676E6A] font-sans leading-relaxed">
              Stories on organic agriculture, sustainable wellness, and cold-pressed extraction science.
            </p>
            <Link href="/blog" onClick={onClose} className="inline-flex items-center gap-2 text-xs font-sans uppercase font-bold tracking-[0.2em] text-[#1C3322] dark:text-[#C9A227]">
              Read Gazette <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="col-span-8 grid grid-cols-2 gap-6">
            <div className="rounded-[1rem] bg-[#F3EFE8] dark:bg-[#1C1C1E] p-6 border border-[#E2E6E3]/60 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-[#C9A227] font-bold block mb-1">
                  SUSTAINABILITY ESSAY
                </span>
                <h4 className="font-serif text-base font-medium text-[#161A17] dark:text-[#FAF8F5] mb-2">
                  The Ethics of Smallholder Coconut Harvesting in Epe
                </h4>
                <p className="text-xs text-[#676E6A] font-sans leading-relaxed line-clamp-2">
                  How zero-heat extraction preserves 100% of fatty acids and antioxidant polyphenols.
                </p>
              </div>
              <Link href="/blog" onClick={onClose} className="mt-4 text-[10px] uppercase font-bold tracking-[0.2em] text-[#1C3322] dark:text-[#C9A227]">
                Read Article →
              </Link>
            </div>

            <div className="rounded-[1rem] bg-[#F3EFE8] dark:bg-[#1C1C1E] p-6 border border-[#E2E6E3]/60 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-[#C9A227] font-bold block mb-1">
                  WELLNESS DISCOVERY
                </span>
                <h4 className="font-serif text-base font-medium text-[#161A17] dark:text-[#FAF8F5] mb-2">
                  Medium-Chain Triglycerides: Nature's Bio-Energy Source
                </h4>
                <p className="text-xs text-[#676E6A] font-sans leading-relaxed line-clamp-2">
                  Unpacking the cellular health benefits of raw lauric and caprylic organic acids.
                </p>
              </div>
              <Link href="/blog" onClick={onClose} className="mt-4 text-[10px] uppercase font-bold tracking-[0.2em] text-[#1C3322] dark:text-[#C9A227]">
                Read Article →
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}

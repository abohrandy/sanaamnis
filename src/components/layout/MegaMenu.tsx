"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ChefHat, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, CATALOG, formatNaira, startingPrice } from "@/lib/catalog";
import { RECIPES, ARTICLES } from "@/lib/content";

export interface MegaMenuProps {
  type: "selection" | "collections" | "recipes" | "journal";
  onClose: () => void;
}

const panelClass =
  "absolute top-full left-0 right-0 w-full glass-alabaster dark:glass-obsidian border-b border-[#E2E6E3] shadow-ambient-lg p-10 z-40";

const panelMotion = {
  initial: { opacity: 0, y: 10, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 10, scale: 0.99 },
  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
};

// Two real bestsellers rather than invented "Raw Virgin Coconut Oil" and "Organic
// Coconut Water Elixir" cards that did not match anything actually sold.
const SPOTLIGHT_SLUGS = ["coconut-oil", "sana-amnis-coconut-water"];

export function MegaMenu({ type, onClose }: MegaMenuProps) {
  if (type === "selection" || type === "collections") {
    const spotlight = SPOTLIGHT_SLUGS.map((slug) =>
      CATALOG.find((p) => p.slug === slug)
    ).filter(Boolean) as typeof CATALOG;

    return (
      <motion.div {...panelMotion} className={panelClass} onMouseLeave={onClose}>
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
          <div className="col-span-3 space-y-4 border-r border-[#E2E6E3]/60 pr-8">
            <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-bold text-[#C9A227] block">
              Shop by category
            </span>
            <ul className="space-y-3 font-sans text-xs uppercase tracking-[0.18em] font-semibold text-[#1C3322]">
              <li>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="hover:text-[#1C3322] dark:hover:text-[#C9A227] transition-colors flex items-center justify-between"
                >
                  All products <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              {Object.values(CATEGORIES).map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/shop?category=${category.slug}`}
                    onClick={onClose}
                    className="hover:text-[#1C3322] dark:hover:text-[#C9A227] transition-colors flex items-center justify-between"
                  >
                    {category.name} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-5 grid grid-cols-2 gap-4">
            {spotlight.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="rounded-[1rem] bg-[#F3EFE8] dark:bg-[#1C1C1E] p-4 flex flex-col justify-between border border-[#E2E6E3]/60 hover:border-[#1C3322] transition-colors"
              >
                <div className="flex gap-3">
                  <div className="relative w-14 h-16 rounded-[0.6rem] overflow-hidden bg-[#E2E6E3] shrink-0">
                    <Image src={product.images[0]} alt="" fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    {product.badge && (
                      <Badge variant="gold" size="sm" className="mb-1.5">
                        {product.badge}
                      </Badge>
                    )}
                    <h4 className="font-serif text-sm font-medium text-[#161A17] dark:text-[#FAF8F5] leading-snug">
                      {product.title}
                    </h4>
                  </div>
                </div>
                <span className="mt-3 text-[10px] uppercase font-bold tracking-[0.18em] text-[#1C3322] dark:text-[#C9A227] inline-flex items-center gap-1">
                  {formatNaira(startingPrice(product))} <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>

          <div className="col-span-4 rounded-[1rem] bg-[#1C3322] text-[#FAF8F5] p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="z-10">
              <Sparkles className="w-5 h-5 text-[#C9A227] mb-3" aria-hidden="true" />
              <span className="text-[9px] uppercase tracking-[0.25em] font-sans font-bold text-[#C9A227] block mb-1">
                How we source
              </span>
              <h4 className="font-serif text-xl font-medium mb-2">
                Bought direct from the farm
              </h4>
              <p className="text-xs text-[#FAF8F5]/80 font-sans leading-relaxed">
                We buy coconuts from local farming families growing trees across
                Nigeria, and process the whole fruit ourselves.
              </p>
            </div>
            <Link
              href="/sustainability"
              onClick={onClose}
              className="mt-4 text-[10px] uppercase font-bold tracking-[0.2em] text-[#C9A227] z-10 inline-flex items-center gap-1"
            >
              Read our sourcing <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === "recipes") {
    const featured = RECIPES.slice(0, 3);

    return (
      <motion.div {...panelMotion} className={panelClass} onMouseLeave={onClose}>
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
          <div className="col-span-4 space-y-4 border-r border-[#E2E6E3]/60 pr-8">
            <div className="flex items-center gap-2 text-[#1C3322] dark:text-[#C9A227]">
              <ChefHat className="w-5 h-5" aria-hidden="true" />
              <span className="font-serif text-lg font-medium text-[#161A17] dark:text-[#FAF8F5]">
                Recipes
              </span>
            </div>
            <p className="text-xs text-[#676E6A] font-sans leading-relaxed">
              Practical recipes that use what we sell — with the ratios that matter and
              the mistakes worth avoiding.
            </p>
            <Link
              href="/recipes"
              onClick={onClose}
              className="inline-flex items-center gap-2 text-xs font-sans uppercase font-bold tracking-[0.2em] text-[#1C3322] dark:text-[#C9A227]"
            >
              View all recipes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="col-span-8 grid grid-cols-3 gap-4">
            {featured.map((recipe) => (
              <Link
                key={recipe.slug}
                href={`/recipes/${recipe.slug}`}
                onClick={onClose}
                className="rounded-[1rem] bg-[#F3EFE8] dark:bg-[#1C1C1E] p-4 flex flex-col justify-between border border-[#E2E6E3]/60 hover:border-[#1C3322] transition-colors"
              >
                <Badge variant="botanical" className="w-fit mb-2">
                  {recipe.difficulty}
                </Badge>
                <h4 className="font-serif text-sm font-medium text-[#161A17] dark:text-[#FAF8F5] mb-1 leading-snug">
                  {recipe.title}
                </h4>
                <span className="text-[10px] uppercase font-sans text-[#676E6A]">
                  {recipe.duration}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === "journal") {
    const featured = ARTICLES.slice(0, 2);

    return (
      <motion.div {...panelMotion} className={panelClass} onMouseLeave={onClose}>
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
          <div className="col-span-4 space-y-4 border-r border-[#E2E6E3]/60 pr-8">
            <div className="flex items-center gap-2 text-[#1C3322] dark:text-[#C9A227]">
              <BookOpen className="w-5 h-5" aria-hidden="true" />
              <span className="font-serif text-lg font-medium text-[#161A17] dark:text-[#FAF8F5]">
                Blog
              </span>
            </div>
            <p className="text-xs text-[#676E6A] font-sans leading-relaxed">
              Practical guides to storing, cooking with and choosing between what we
              sell, plus how we source.
            </p>
            <Link
              href="/blog"
              onClick={onClose}
              className="inline-flex items-center gap-2 text-xs font-sans uppercase font-bold tracking-[0.2em] text-[#1C3322] dark:text-[#C9A227]"
            >
              Read the blog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="col-span-8 grid grid-cols-2 gap-6">
            {featured.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                onClick={onClose}
                className="rounded-[1rem] bg-[#F3EFE8] dark:bg-[#1C1C1E] p-6 border border-[#E2E6E3]/60 hover:border-[#1C3322] transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-[#C9A227] font-bold block mb-1">
                    {article.category}
                  </span>
                  <h4 className="font-serif text-base font-medium text-[#161A17] dark:text-[#FAF8F5] mb-2 leading-snug">
                    {article.title}
                  </h4>
                  <p className="text-xs text-[#676E6A] font-sans leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
                <span className="mt-4 text-[10px] uppercase font-bold tracking-[0.2em] text-[#1C3322] dark:text-[#C9A227]">
                  Read article →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}

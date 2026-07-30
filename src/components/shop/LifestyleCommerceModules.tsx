"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, ChefHat, Sparkles, Package, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ds/cards/product-card";
import { CATEGORIES, type CatalogProduct, type CategorySlug } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";

interface UseCase {
  categorySlug: CategorySlug;
  subtitle: string;
  description: string;
  heroImage: string;
  icon: React.ElementType;
}

/**
 * Rewritten from scratch. The previous version invented a "Shop by Recipes" tab
 * that promised "Golden Turmeric Lattes" and "Overnight Scalp Masks" — dishes
 * that do not exist anywhere on this site — used stock Unsplash photography
 * instead of the client's own product shots, and linked to "Explore Category"
 * on `/shop?lifestyle=…`, a query parameter the shop page has never read.
 *
 * This groups the real four catalog categories under how customers actually use
 * them, using the client's own photography and linking to the real
 * `/shop?category=…` filter.
 */
const USE_CASES: UseCase[] = [
  {
    categorySlug: "hydration",
    subtitle: "Drink it straight or cook with it",
    description:
      "Coconut water and coconut milk, bottled and dried with no added sugar. For hydration after exercise, or as the base of a curry.",
    heroImage: "/products/coconut-water-range.jpg",
    icon: Droplets,
  },
  {
    categorySlug: "oils",
    subtitle: "For cooking, skin and hair",
    description:
      "Cold-pressed and hot-pressed coconut oil. Cold-pressed suits skin, hair and baking; hot-pressed has the higher smoke point for everyday frying.",
    heroImage: "/products/coconut-oil-cold-pressed.jpg",
    icon: ChefHat,
  },
  {
    categorySlug: "body",
    subtitle: "For skin and hair care",
    description:
      "Balms, butters, scrubs and infused oils built on coconut lipids, for moisturising and conditioning.",
    heroImage: "/products/coconut-milk-powder-sizes.jpg",
    icon: Sparkles,
  },
  {
    categorySlug: "culinary",
    subtitle: "Flour, flakes, powder and poundo",
    description:
      "Baking and cooking staples milled and dried from the same coconuts — for gluten-free baking, snacking, or a lower-carb swallow.",
    heroImage: "/products/coconut-flakes.jpg",
    icon: Package,
  },
];

export function LifestyleCommerceModules({ products }: { products: CatalogProduct[] }) {
  const [selected, setSelected] = useState<CategorySlug>("hydration");

  const active = useMemo(
    () => USE_CASES.find((u) => u.categorySlug === selected) ?? USE_CASES[0],
    [selected]
  );

  const inCategory = useMemo(
    () => products.filter((p) => p.categorySlug === active.categorySlug).slice(0, 4),
    [active, products]
  );

  return (
    <div className="space-y-10 font-sans">
      <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 border-b border-[#E2E6E3]">
        {USE_CASES.map((useCase) => {
          const category = CATEGORIES[useCase.categorySlug];
          const Icon = useCase.icon;
          const isSelected = selected === useCase.categorySlug;

          return (
            <button
              key={useCase.categorySlug}
              type="button"
              onClick={() => setSelected(useCase.categorySlug)}
              aria-pressed={isSelected}
              className={`px-4 py-3 rounded-[0.75rem] text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 flex items-center gap-2.5 shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-[#1C3322] text-[#FAF8F5] shadow-ambient-sm ring-1 ring-[#1C3322]"
                  : "bg-[#FAF8F5] text-[#161A17] hover:bg-[#F3EFE8] border border-[#E2E6E3]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? "text-[#C9A227]" : "text-[#1C3322]"}`} aria-hidden="true" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.categorySlug}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-[1.75rem] overflow-hidden bg-[#161A17] text-[#FAF8F5] border border-gold-hairline shadow-ambient-lg grid grid-cols-1 lg:grid-cols-12 min-h-[300px]"
        >
          <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <Badge variant="gold">{CATEGORIES[active.categorySlug].name}</Badge>
              <h2 className="font-serif text-2xl md:text-3xl font-medium leading-tight text-[#FAF8F5]">
                {active.subtitle}
              </h2>
              <p className="text-sm text-[#FAF8F5]/80 leading-relaxed max-w-xl">
                {active.description}
              </p>
            </div>

            <Link
              href={`/shop?category=${active.categorySlug}`}
              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#C9A227] hover:text-[#FAF8F5] transition-colors"
            >
              Shop {CATEGORIES[active.categorySlug].name} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="lg:col-span-5 relative aspect-square lg:aspect-auto overflow-hidden bg-[#242A26]">
            <Image
              src={active.heroImage}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161A17] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#161A17] lg:via-transparent lg:to-transparent" />
          </div>
        </motion.div>
      </AnimatePresence>

      {inCategory.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-medium text-[#161A17]">
              {CATEGORIES[active.categorySlug].name}
            </h3>
            <Link
              href={`/shop?category=${active.categorySlug}`}
              className="text-xs font-bold uppercase tracking-[0.18em] text-[#1C3322] hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
            >
              Shop all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {inCategory.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

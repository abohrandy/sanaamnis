"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  Dumbbell,
  Sparkles,
  Baby,
  ChefHat,
  Gift,
  BookOpen,
  ArrowRight,
  ShoppingBag,
  Check,
} from "lucide-react";
import { ProductCard } from "@/components/ds/cards/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface LifestyleCategory {
  id: "wellness" | "fitness" | "beauty" | "family" | "cooking" | "gifts" | "recipes";
  title: string;
  subtitle: string;
  icon: React.ElementType;
  description: string;
  heroImage: string;
  badge: string;
  keywords: string[];
}

export const LIFESTYLE_MODULES: LifestyleCategory[] = [
  {
    id: "wellness",
    title: "Shop by Wellness",
    subtitle: "Bio-Active MCT & Lauric Cell Hydration",
    icon: HeartPulse,
    description: "Cold-pressed extra virgin oils and electrolyte-rich waters formulated to support gut immunity, cognitive clarity, and natural cellular vitality.",
    heroImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800",
    badge: "MCT CELL VITALITY",
    keywords: ["oil", "water", "powder", "wellness"],
  },
  {
    id: "fitness",
    title: "Shop by Fitness",
    subtitle: "Clean Energy & Muscle Recovery",
    icon: Dumbbell,
    description: "Rapidly absorbed medium-chain triglycerides for pre-workout endurance and potassium-rich coconut water for instant post-exercise electrolyte replenishment.",
    heroImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800",
    badge: "HYDRATION & ENDURANCE",
    keywords: ["water", "oil", "scrub", "chips"],
  },
  {
    id: "beauty",
    title: "Shop by Beauty",
    subtitle: "Epidermal Lipid Barrier Repair",
    icon: Sparkles,
    description: "Whipped coconut body butter, sugar crystal polishes, and deep hair follicle masks crafted to lock in velvety moisture and restore natural skin glow.",
    heroImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800",
    badge: "SKIN & HAIR LIPIDS",
    keywords: ["butter", "mask", "scrub", "oil"],
  },
  {
    id: "family",
    title: "Shop by Family",
    subtitle: "Gentle Pure Care for Every Generation",
    icon: Baby,
    description: "100% organic, additive-free coconut care safe for delicate baby skin, wholesome family baking, and clean gluten-free school snacking.",
    heroImage: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800",
    badge: "100% PURE & SAFE",
    keywords: ["oil", "chips", "milk", "water"],
  },
  {
    id: "cooking",
    title: "Shop by Cooking",
    subtitle: "Artisanal Culinary Fats & Baking Essentials",
    icon: ChefHat,
    description: "Unrefined extra virgin cooking fats with high smoke stability, gluten-free keto coconut flour, and instant creamy milk powders for gourmet dishes.",
    heroImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800",
    badge: "GOURMET KITCHEN",
    keywords: ["flour", "milk", "oil", "chips"],
  },
  {
    id: "gifts",
    title: "Shop by Gifts",
    subtitle: "Curated Botanical Sanctuary Collections",
    icon: Gift,
    description: "Elegantly boxed wellness gift sets, spa ritual trios, and gourmet culinary bundles wrapped in luxury sustainable amber packaging.",
    heroImage: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800",
    badge: "LUXURY BOXED SETS",
    keywords: ["oil", "butter", "mask", "water"],
  },
  {
    id: "recipes",
    title: "Shop by Recipes",
    subtitle: "Ingredients Matched to Signature Dishes",
    icon: BookOpen,
    description: "Instantly shop exact organic ingredients required for our Golden Turmeric Lattes, Grain-Free Keto Pancakes, and Overnight Scalp Masks.",
    heroImage: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800",
    badge: "RECIPE INGREDIENTS",
    keywords: ["flour", "milk", "oil", "water"],
  },
];

export const ALL_PRODUCTS = [
  {
    id: "1",
    title: "Extra Virgin Coconut Oil",
    slug: "extra-virgin-coconut-oil",
    category: "Organic Wellness",
    price: 15000,
    imageUrl: "https://drive.google.com/thumbnail?id=1cRxBW7bAXR5Alft8iGGt5AVugXPRusMY&sz=w1000",
    keywords: ["oil", "wellness", "fitness", "beauty", "family", "cooking", "gifts", "recipes"],
  },
  {
    id: "2",
    title: "Sana Amnis Coconut Water",
    slug: "sana-amnis-coconut-water",
    category: "Organic Wellness",
    price: 4500,
    imageUrl: "https://drive.google.com/thumbnail?id=1Z9Yf9iquA-YUp0eGmrcM7xr411520Qgp&sz=w1000",
    keywords: ["water", "wellness", "fitness", "family", "gifts", "recipes"],
  },
  {
    id: "3",
    title: "Pure Coconut Milk Powder",
    slug: "pure-coconut-milk-powder",
    category: "Organic Wellness",
    price: 8500,
    imageUrl: "https://drive.google.com/thumbnail?id=11VjXF_JnUyd9JX6FIqcfMSkF4D5POY4M&sz=w1000",
    keywords: ["milk", "powder", "cooking", "family", "recipes"],
  },
  {
    id: "4",
    title: "Nourishing Coconut Body Butter",
    slug: "coconut-body-butter",
    category: "Premium Skincare",
    price: 18000,
    imageUrl: "https://drive.google.com/thumbnail?id=1Xcc9CmWFaAEvsU4ovWMHKYkEiEhzN0cr&sz=w1000",
    keywords: ["butter", "beauty", "family", "gifts"],
  },
  {
    id: "5",
    title: "Restorative Coconut Hair Mask",
    slug: "restorative-coconut-hair-mask",
    category: "Hair & Body",
    price: 14000,
    imageUrl: "https://drive.google.com/thumbnail?id=1--CLF51noixdnvV8HhLmosvtP75RDlRE&sz=w1000",
    keywords: ["mask", "beauty", "gifts", "recipes"],
  },
  {
    id: "6",
    title: "Exfoliating Coconut Sugar Scrub",
    slug: "coconut-sugar-scrub",
    category: "Premium Skincare",
    price: 12500,
    imageUrl: "https://drive.google.com/thumbnail?id=1kfVkQ-lqEpTKfvtl_WT-zwa28NeEOO1n&sz=w1000",
    keywords: ["scrub", "beauty", "fitness", "gifts"],
  },
  {
    id: "7",
    title: "Toasted Organic Coconut Chips",
    slug: "organic-coconut-chips",
    category: "Gourmet Snacks",
    price: 3500,
    imageUrl: "https://drive.google.com/thumbnail?id=16WhogTSxDzbjaVewUFprCCPbN_mfhPxg&sz=w1000",
    keywords: ["chips", "family", "cooking", "fitness"],
  },
  {
    id: "8",
    title: "Raw Organic Coconut Flour",
    slug: "raw-coconut-flour",
    category: "Culinary Essentials",
    price: 6000,
    imageUrl: "https://drive.google.com/thumbnail?id=1hk33UKAflm0EIoFg_sGRzbQ3jSZsPLUp&sz=w1000",
    keywords: ["flour", "cooking", "wellness", "recipes"],
  },
];

export function LifestyleCommerceModules() {
  const [selectedModuleId, setSelectedModuleId] = useState<LifestyleCategory["id"]>("wellness");

  const activeModule = useMemo(
    () => LIFESTYLE_MODULES.find((m) => m.id === selectedModuleId) || LIFESTYLE_MODULES[0],
    [selectedModuleId]
  );

  // Automated recommendation matching engine
  const recommendedProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((prod) =>
      prod.keywords.some((kw) => activeModule.keywords.includes(kw) || kw === activeModule.id)
    ).slice(0, 4);
  }, [activeModule]);

  return (
    <div className="space-y-12 font-sans">
      {/* Module Selector Pill Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2 border-b border-[#E2E6E3]">
        {LIFESTYLE_MODULES.map((module) => {
          const Icon = module.icon;
          const isSelected = selectedModuleId === module.id;

          return (
            <button
              key={module.id}
              onClick={() => setSelectedModuleId(module.id)}
              className={`px-4 py-3 rounded-[0.75rem] text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 flex items-center gap-2.5 shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-[#1C3322] text-[#FAF8F5] shadow-ambient-sm ring-1 ring-[#1C3322]"
                  : "bg-[#FAF8F5] text-[#161A17] hover:bg-[#F3EFE8] border border-[#E2E6E3]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? "text-[#C9A227]" : "text-[#1C3322]"}`} />
              <span>{module.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Lifestyle Hero Spotlight Banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeModule.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-[1.75rem] overflow-hidden bg-[#161A17] text-[#FAF8F5] border border-gold-hairline shadow-ambient-lg grid grid-cols-1 lg:grid-cols-12 min-h-[320px]"
        >
          {/* Text Content Area */}
          <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <Badge variant="gold">{activeModule.badge}</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-[#FAF8F5]">
                {activeModule.title}
              </h2>
              <p className="text-xs uppercase font-sans tracking-[0.2em] text-[#C9A227] font-bold">
                {activeModule.subtitle}
              </p>
              <p className="text-xs md:text-sm font-sans text-[#FAF8F5]/80 leading-relaxed max-w-xl">
                {activeModule.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center gap-6">
              <span className="text-[10px] uppercase font-sans tracking-[0.18em] text-[#FAF8F5]/60">
                Recommended: <strong className="text-[#FAF8F5]">{recommendedProducts.length} Formulations</strong>
              </span>
            </div>
          </div>

          {/* Hero Photography Frame */}
          <div className="lg:col-span-5 relative aspect-square lg:aspect-auto overflow-hidden bg-[#242A26]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeModule.heroImage}
              alt={activeModule.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161A17] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#161A17] lg:via-transparent lg:to-transparent" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Recommended Products Grid Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="gold">AUTOMATED SELECTION</Badge>
            <h3 className="font-serif text-2xl font-medium text-[#161A17] mt-1">
              Recommended for {activeModule.title.replace("Shop by ", "")}
            </h3>
          </div>

          <a
            href={`/shop?lifestyle=${activeModule.id}`}
            className="text-xs font-bold uppercase tracking-[0.18em] text-[#1C3322] hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
          >
            Explore Category <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              slug={product.slug}
              category={product.category}
              price={product.price}
              imageUrl={product.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

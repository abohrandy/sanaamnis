"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Droplet, Truck, ChevronDown, Star, Leaf } from "lucide-react";
import ProductInteractiveForm from "./ProductInteractiveForm";
import { ProductHeroGallery } from "./ProductHeroGallery";
import { StickyPurchaseBar } from "./StickyPurchaseBar";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ds/cards/product-card";
import { formatNaira, type CatalogProduct, type CatalogVariant } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ProductDetailClientProps {
  product: CatalogProduct;
  categoryName: string;
  related: CatalogProduct[];
  reviews?: ProductReview[];
}

const FAQS = [
  {
    q: "How is Sana Amnis coconut oil different from what I find in the supermarket?",
    a: "Most commercial coconut oil is refined, bleached and deodorised at temperatures above 200°C, which strips the natural polyphenols and aroma. Our cold-pressed bottle is extracted through a natural fermentation process, with no added heat, and is never refined or bleached. Our hot-pressed bottle is traditionally extracted for a fuller flavour and a higher smoke point.",
  },
  {
    q: "How should I store it, and how long does it keep?",
    a: "Store in a cool, dry cupboard away from direct sunlight. Unopened, our oils keep for 24 months. Below roughly 24°C coconut oil turns solid and white — that is normal and is a sign the oil is unrefined, not a fault. It liquefies again in warm hands.",
  },
  {
    q: "Is the coconut water from concentrate?",
    a: "No. It is drawn from young green coconuts and bottled as-is, with no added sugar, no concentrate and no preservatives. Keep it refrigerated once opened and drink within 48 hours.",
  },
  {
    q: "Where do you deliver, and how long does it take?",
    a: "We offer 24 to 48 hours delivery of orders in cities where our distributors are domicile. Orders outside these cities take 3 to 5 working days. [Check the distributor list](/distributors) to see the distributors closest to you.",
  },
];

const TABS = [
  { id: "ingredients", label: "Ingredients" },
  { id: "usage", label: "How to use" },
  { id: "shipping", label: "Shipping & returns" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ProductDetailClient({
  product,
  categoryName,
  related,
  reviews = [],
}: ProductDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("ingredients");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [activeVariant, setActiveVariant] = useState<CatalogVariant | undefined>(
    product.variants.find((v) => v.stock > 0) ?? product.variants[0]
  );

  const galleryImages = activeVariant?.imageUrl
    ? [activeVariant.imageUrl, ...product.images.filter((image) => image !== activeVariant.imageUrl)]
    : product.images;

  const buyPanelRef = useRef<HTMLDivElement>(null);

  // Reveal the sticky bar once the real buy panel has scrolled out of view.
  useEffect(() => {
    const node = buyPanelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 py-10 md:py-14 font-sans space-y-24">
      {/* ---------------------------------------------------------------- Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-7 lg:sticky lg:top-28">
          <ProductHeroGallery
            images={galleryImages}
            title={product.title}
            badgeText={product.badge}
          />
          {product.photographyPending && (
            <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[#676E6A] font-semibold text-center">
              Studio photography in progress
            </p>
          )}
        </div>

        <div className="lg:col-span-5" ref={buyPanelRef}>
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <Badge variant="gold">{categoryName}</Badge>

              {averageRating !== null && (
                <a
                  href="#reviews"
                  className="flex items-center gap-1.5 text-xs text-[#676E6A] hover:text-[#1C3322] transition-colors"
                >
                  <Star className="w-3.5 h-3.5 fill-current text-[#C9A227]" />
                  <span className="font-bold text-[#161A17]">
                    {averageRating.toFixed(1)}
                  </span>
                  <span>
                    ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </a>
              )}
            </div>

            <h1 className="font-serif text-3xl md:text-5xl font-medium text-[#161A17] leading-[1.12] tracking-tight">
              {product.title}
            </h1>

            <p className="text-sm md:text-base text-[#676E6A] font-sans leading-relaxed">
              {product.tagline}
            </p>

            <div className="py-5 border-y border-[#E2E6E3] grid grid-cols-3 gap-3 text-[10px] uppercase font-sans font-bold tracking-[0.14em] text-[#1C3322]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227] shrink-0" /> 100% Natural
              </span>
              <span className="flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-[#C9A227] shrink-0" /> No Additives
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#C9A227] shrink-0" /> Fast Dispatch
              </span>
            </div>

            <ProductInteractiveForm product={product} onVariantChange={setActiveVariant} />

            <p className="text-[11px] text-[#676E6A] leading-relaxed">
              We offer 24 to 48 hours delivery of orders in cities where our distributors
              are domicile. Orders outside these cities take 3 to 5 working days.{" "}
              <Link href="/distributors" className="underline underline-offset-4 hover:text-[#1C3322]">
                Check the distributor list to see the distributors closest to you.
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------- Editorial copy */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-5">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A227] block mb-3">
            About this product
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-[#1C3322] leading-snug">
            Made from coconuts, and nothing you would not recognise.
          </h2>
        </div>
        <div className="lg:col-span-7">
          <div className="space-y-4 text-sm md:text-base text-[#161A17]/80 leading-[1.85] font-sans">
            {product.description.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- Spec tabs */}
      <section className="space-y-8">
        <div
          role="tablist"
          aria-label="Product details"
          className="flex border-b border-[#E2E6E3] overflow-x-auto gap-8 text-[11px] uppercase tracking-[0.18em] font-sans font-bold"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-4 border-b-2 transition-colors shrink-0 cursor-pointer",
                activeTab === tab.id
                  ? "border-[#1C3322] text-[#1C3322]"
                  : "border-transparent text-[#676E6A] hover:text-[#161A17]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className="p-6 md:p-8 rounded-[1.5rem] glass-alabaster border border-[#E2E6E3] min-h-[200px]"
        >
          {activeTab === "ingredients" && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="font-serif text-xl font-medium text-[#161A17]">
                What is inside
              </h3>
              <p className="text-sm text-[#676E6A] leading-relaxed">
                {product.slug === "coconut-poundo" && (
                  <>Coconut poundo contains psyllium husk, a high fibre, gluten-free, plant based binder. </>
                )}
                {product.title} contains coconut and nothing else beyond what the label
                states. {product.categorySlug !== "culinary" && "Free from synthetic fragrance, parabens, sulphates and hexane. "}
                Never bleached, never deodorised.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant="botanical">Single-Origin Nigeria</Badge>
                <Badge variant="gold">No Hexane</Badge>
                <Badge variant="alabaster">Non-GMO</Badge>
              </div>
            </div>
          )}

          {activeTab === "usage" && product.usageSteps.length === 0 && (
            <p className="text-sm text-[#676E6A] leading-relaxed max-w-3xl">
              Use {product.title.toLowerCase()} as you would any {categoryName.toLowerCase()} product from our range.
            </p>
          )}

          {activeTab === "usage" && product.usageSteps.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {product.usageSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="p-5 rounded-[1rem] bg-[#F3EFE8] border border-[#E2E6E3]"
                >
                  <span className="font-serif text-lg text-[#C9A227] font-bold block mb-1.5">
                    {String(index + 1).padStart(2, "0")}. {step.title}
                  </span>
                  <p className="text-xs text-[#676E6A] leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-5 max-w-3xl">
              <h3 className="font-serif text-xl font-medium text-[#161A17]">
                Shipping and returns
              </h3>
              <p className="text-sm text-[#676E6A] leading-relaxed">
                Orders are dispatched in protective, recyclable packaging.
                We offer 24 to 48 hours delivery of orders in cities where our distributors
                are domicile. Orders outside these cities take 3 to 5 working days.{" "}
                <Link href="/distributors" className="underline underline-offset-4 hover:text-[#1C3322]">
                  Check the distributor list to see the distributors closest to you.
                </Link>
              </p>
              <p className="text-sm text-[#676E6A] leading-relaxed">
                Unopened items can be returned within 14 days of delivery for a full refund.
                For food-safety reasons we cannot accept returns of opened consumables unless
                the product is faulty — see our{" "}
                <Link href="/returns" className="underline underline-offset-4 hover:text-[#1C3322]">
                  returns policy
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </section>

      {/* -------------------------------------------------------------- Related */}
      {related.length > 0 && (
        <section className="space-y-8 pt-4 border-t border-[#E2E6E3]">
          <div className="flex justify-between items-end gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A227] block mb-1">
                Goes well with
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-medium text-[#1C3322]">
                More from {categoryName}
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-[11px] font-sans font-bold uppercase tracking-[0.18em] text-[#1C3322] hover:text-[#C9A227] transition-colors shrink-0"
            >
              Shop all →
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ FAQ */}
      <section className="space-y-8 pt-4 border-t border-[#E2E6E3]">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A227]">
            Good to know
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-[#1C3322]">
            Frequently asked questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, idx) => {
            const open = openFaq === idx;
            return (
              <div
                key={faq.q}
                className="rounded-[1rem] border border-[#E2E6E3] bg-[#FAF8F5] overflow-hidden"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : idx)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${idx}`}
                    className="w-full p-5 text-left font-serif text-base font-medium text-[#161A17] flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F3EFE8]/60 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-[#C9A227] transition-transform duration-300 shrink-0",
                        open && "rotate-180"
                      )}
                    />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={`faq-panel-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-[#676E6A] leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------------------------- Reviews */}
      <section id="reviews" className="space-y-8 pt-4 border-t border-[#E2E6E3] scroll-mt-28">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A227]">
            Verified reviews
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-[#1C3322]">
            What customers say
          </h2>
        </div>

        {reviews.length === 0 ? (
          <div className="max-w-lg mx-auto text-center p-10 rounded-[1.5rem] border border-dashed border-[#E2E6E3] bg-[#F3EFE8]/40">
            <Leaf className="w-6 h-6 text-[#C9A227] mx-auto mb-4" />
            <p className="text-sm text-[#676E6A] leading-relaxed">
              No reviews for {product.title} yet. Reviews appear here once verified
              customers have received their order.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {reviews.map((review) => (
              <figure
                key={review.id}
                className="p-6 rounded-[1.25rem] bg-[#FAF8F5] border border-[#E2E6E3] shadow-ambient-sm space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <figcaption className="font-serif font-medium text-sm text-[#161A17]">
                    {review.author}
                  </figcaption>
                  <time className="text-[10px] font-sans uppercase tracking-[0.14em] text-[#676E6A]">
                    {review.date}
                  </time>
                </div>
                <div
                  className="flex gap-1 text-[#C9A227]"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      aria-hidden="true"
                      className={cn("w-3.5 h-3.5", i < review.rating ? "fill-current" : "opacity-25")}
                    />
                  ))}
                </div>
                <blockquote className="text-sm text-[#676E6A] leading-relaxed">
                  {review.comment}
                </blockquote>
              </figure>
            ))}
          </div>
        )}
      </section>

      <StickyPurchaseBar
        product={product}
        variant={activeVariant}
        isVisible={showStickyBar}
      />
    </div>
  );
}

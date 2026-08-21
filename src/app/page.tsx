import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ProductCard } from "@/components/ds/cards/product-card";
import { Button } from "@/components/ui/button";
import { Newsletter } from "@/components/layout/Newsletter";
import { HeroSlider } from "@/components/ds/storytelling/HeroSlider";
import { ScrollReveal } from "@/components/ds/motion/ScrollReveal";
import { CATEGORIES, type CategorySlug } from "@/lib/catalog";
import { getFeaturedProducts, getFeaturedSlugs } from "@/lib/products";
import { getBundles } from "@/lib/bundles";
import { BundleCarousel } from "@/components/shop/BundleCarousel";
import {
  ArrowRight,
  Leaf,
  Droplets,
  Truck,
  Ban,
  Thermometer,
  Sprout,
  PackageCheck,
} from "lucide-react";

export const revalidate = 300;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const TRUST_POINTS = [
  { icon: Ban, label: "No added sugar" },
  { icon: Leaf, label: "No preservatives" },
  { icon: Sprout, label: "Grown in Nigeria" },
  { icon: Truck, label: "Nationwide delivery" },
];

const CATEGORY_TILES: Array<{
  slug: CategorySlug;
  image: string;
  blurb: string;
}> = [
  {
    slug: "hydration",
    image: "/products/coconut-water-range.jpg",
    blurb: "Coconut water made in Nigeria in two verified sizes.",
  },
  {
    slug: "culinary",
    image: "/products/coconut-oil-cold-pressed.jpg",
    blurb: "Coconut oil, flour, flakes, powder and poundo for the kitchen.",
  },
  {
    slug: "body",
    image: "/products/avococo-oil.jpg",
    blurb: "Avocado oil, carrot oil, lip balm and coconut oil.",
  },
];

const PROCESS_STEPS = [
  {
    icon: Sprout,
    title: "Harvested locally",
    body: "We source Nigerian, home-grown coconuts through local farming families across the country.",
  },
  {
    icon: Thermometer,
    title: "Made in Nigeria",
    body: "Our coconut range is made in Nigeria from home-grown coconuts.",
  },
  {
    icon: PackageCheck,
    title: "Bottled and sealed",
    body: "Products are filled, sealed and labelled before dispatch, with the available size shown on each product page.",
  },
];

export default async function Home() {
  const [featuredSlugs, bundles] = await Promise.all([getFeaturedSlugs(), getBundles()]);
  const featured = await getFeaturedProducts(featuredSlugs);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#161A17] selection:bg-[#C9A227] selection:text-[#FAF8F5]">
      <Header />

      <main className="flex-1 w-full">
        {/* ------------------------------------------------------------- Hero */}
        <div className="w-full max-w-[1600px] mx-auto px-3 md:px-6 lg:px-8 pt-3">
          <HeroSlider />
        </div>

        {/* ------------------------------------------------------ Trust strip */}
        <section aria-label="Why Sana Amnis" className="border-y border-[#E2E6E3] bg-[#F3EFE8]/50 mt-14">
          <ul className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E2E6E3]/70">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center justify-center gap-2.5 py-5 px-3 text-center"
              >
                <Icon className="w-4 h-4 text-[#C9A227] shrink-0" aria-hidden="true" />
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.16em] text-[#1C3322]">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 space-y-24 md:space-y-32 py-20 md:py-24">
          {/* -------------------------------------------------------- Featured */}
          <ScrollReveal>
            <section className="space-y-10">
              <div className="flex flex-wrap justify-between items-end gap-4 border-b border-[#E2E6E3] pb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A227] block mb-1.5">
                    Best sellers
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#1C3322] tracking-tight">
                    Start here
                  </h2>
                </div>

                <Link href="/shop">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
                    Shop all products <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {featured.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    // First row is above the fold on desktop; do not lazy-load it.
                    priority={i < 3}
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 320px"
                  />
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* --------------------------------------------------------- Bundles */}
          {bundles.length > 0 && (
            <ScrollReveal>
              <section className="space-y-10">
                <div className="flex flex-wrap justify-between items-end gap-4 border-b border-[#E2E6E3] pb-5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A227] block mb-1.5">
                      Bundles
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#1C3322] tracking-tight">
                      Curated coconut sets
                    </h2>
                  </div>

                  <Link href="/bundles">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
                      Shop all bundles <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>

                <BundleCarousel bundles={bundles} />
              </section>
            </ScrollReveal>
          )}

          {/* ------------------------------------------------------ Categories */}
          <ScrollReveal>
            <section className="space-y-10">
              <div className="max-w-xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A227]">
                  Browse
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#1C3322] tracking-tight">
                  Shop by category
                </h2>
              </div>

              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {CATEGORY_TILES.map(({ slug, image, blurb }) => {
                  const category = CATEGORIES[slug];
                  return (
                    <Link
                      key={slug}
                      href={`/shop?category=${slug}`}
                      className="group relative aspect-[3/4] rounded-[1.25rem] overflow-hidden border border-[#E2E6E3] bg-[#F3EFE8] hover-lift-luxury"
                    >
                      <Image
                        src={image}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F14]/88 via-[#0F1F14]/25 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 p-5 space-y-1.5">
                        <h3 className="font-serif text-lg md:text-xl font-medium text-[#FAF8F5]">
                          {category.name}
                        </h3>
                        <p className="text-[11px] text-[#FAF8F5]/75 leading-snug line-clamp-2">
                          {blurb}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#C9A227] pt-1">
                          Shop
                          <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </ScrollReveal>

          {/* ------------------------------------------------- Editorial band */}
          <ScrollReveal>
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              <div className="lg:col-span-6 relative aspect-[4/3] rounded-[1.5rem] overflow-hidden border border-[#E2E6E3] shadow-ambient-md">
                <Image
                  src="/products/range-full-light.jpg"
                  alt="The full Sana Amnis range: coconut water, milk, oils, flour, flakes and lip balms"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div className="lg:col-span-6 space-y-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A227] block">
                  Nothing wasted
                </span>
                <h2 className="font-serif text-3xl md:text-[2.6rem] font-semibold text-[#1C3322] leading-[1.15] tracking-tight">
                  We use the whole coconut
                </h2>
                <p className="text-sm md:text-base text-[#161A17]/75 leading-[1.85]">
                  The water is bottled first. The meat becomes milk powder, flakes,
                  flour, poundo and coconut oil. Sana Amnis brings this Nigerian coconut
                  range to the consumer market.
                </p>
                <p className="text-sm md:text-base text-[#161A17]/75 leading-[1.85]">
                  We make our products in Nigeria using home-grown coconuts and
                  work with local farming families across the country.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <Link href="/shop">
                    <Button variant="botanical" size="lg" className="flex items-center gap-2">
                      Shop the range <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline" size="lg">
                      Read our story
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* --------------------------------------------------------- Process */}
          <ScrollReveal>
            <section className="space-y-12">
              <div className="max-w-2xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A227]">
                  How it is made
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#1C3322] tracking-tight">
                  From grove to bottle
                </h2>
              </div>

              <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {PROCESS_STEPS.map(({ icon: Icon, title, body }, i) => (
                  <li
                    key={title}
                    className="relative p-7 md:p-8 rounded-[1.25rem] bg-[#F3EFE8]/60 border border-[#E2E6E3] space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-11 h-11 rounded-full bg-[#1C3322] text-[#C9A227] flex items-center justify-center">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </span>
                      <span className="font-serif text-3xl text-[#E2E6E3] font-semibold tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-medium text-[#1C3322]">{title}</h3>
                    <p className="text-sm text-[#676E6A] leading-relaxed">{body}</p>
                  </li>
                ))}
              </ol>
            </section>
          </ScrollReveal>

          {/* ------------------------------------------------------ Newsletter */}
          <Newsletter />

          {/* -------------------------------------------------------- Reassure */}
          <ScrollReveal>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {[
                {
                  icon: Truck,
                  title: "Nationwide delivery",
                  body: "We offer 24 to 48 hours delivery of orders in cities where our distributors are domicile. Orders outside these cities take 3 to 5 working days.",
                  href: "/shipping",
                  cta: "Delivery details",
                },
                {
                  icon: Droplets,
                  title: "Made to be opened",
                  body: "If something arrives damaged or is not right, tell us within 14 days and we will replace or refund it.",
                  href: "/returns",
                  cta: "Returns policy",
                },
                {
                  icon: Leaf,
                  title: "Questions welcome",
                  body: "Not sure which oil to cook with, or which size suits you? Ask us — we answer every message.",
                  href: "/contact",
                  cta: "Get in touch",
                },
              ].map(({ icon: Icon, title, body, href, cta }) => (
                <div
                  key={title}
                  className="p-7 rounded-[1.25rem] border border-[#E2E6E3] bg-[#FAF8F5] space-y-3 shadow-ambient-sm"
                >
                  <Icon className="w-5 h-5 text-[#C9A227]" aria-hidden="true" />
                  <h3 className="font-serif text-lg font-medium text-[#1C3322]">{title}</h3>
                  <p className="text-xs text-[#676E6A] leading-relaxed">{body}</p>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1C3322] hover:text-[#C9A227] transition-colors pt-1"
                  >
                    {cta} <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </section>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}

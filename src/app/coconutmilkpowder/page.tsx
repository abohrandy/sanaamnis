import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ds/motion/ScrollReveal";
import { getProduct } from "@/lib/products";
import { CATALOG } from "@/lib/catalog";
import { Check, ArrowRight, Sparkles, Coffee, ChefHat, Cake } from "lucide-react";

export const revalidate = 300;

const SLUG = "pure-coconut-milk-powder";
const naira = (value: number) => `₦${Math.round(value).toLocaleString("en-NG")}`;

export async function generateStaticParams() {
  return [{}];
}

export async function generateMetadata(): Promise<Metadata> {
  const title = "Coconut Milk Powder — Coconut Milk, Whenever You Need It";
  const description =
    "Spray-dried coconut milk that keeps in the cupboard and mixes in seconds. No fridge, no spoilage, no breaking a coconut for two tablespoons.";

  return {
    title,
    description,
    alternates: { canonical: "/coconutmilkpowder" },
    openGraph: { title, description, type: "website" },
  };
}

const WHAT_YOU_GET = [
  "Keeps in the cupboard — no fridge required until you mix it",
  "Measures exactly to the spoon, so nothing goes to waste",
  "No added sugar — just coconut, gently spray-dried",
  "Mixes in seconds with warm water, or goes straight into the pot",
];

const WHO_ITS_FOR = [
  {
    line: "The cook who's mid-recipe and just realised the coconut milk finished.",
    detail: "No trip to the market. Scoop, mix, keep cooking.",
  },
  {
    line: "The traveller or student who wants coconut milk without a fridge.",
    detail: "It sits in your bag or cupboard until the day you need it.",
  },
  {
    line: "The baker who wants exact, measured coconut flavour.",
    detail: "Dry ingredients don't lie — the same spoon gives the same result every time.",
  },
];

const USES = [
  { icon: ChefHat, title: "Coconut Rice & Stews", detail: "Mix with water and pour into the pot, or add the powder directly and adjust as you cook." },
  { icon: Coffee, title: "Tea, Coffee & Smoothies", detail: "A spoonful straight into your cup or blender — no prep needed." },
  { icon: Cake, title: "Baking & Desserts", detail: "Cakes, pancakes, puddings — mix into the dry ingredients or prepare as milk first." },
  { icon: Sparkles, title: "Breakfast", detail: "Stir into pap, oatmeal or custard for an easy, creamy coconut taste." },
];

export default async function CoconutMilkPowderLandingPage() {
  const product = await getProduct(SLUG);
  const fromCatalog = CATALOG.find((p) => p.slug === SLUG);
  if (!product && !fromCatalog) notFound();

  const variants = product?.variants ?? fromCatalog!.variants;
  const minPrice = Math.min(...variants.map((v) => v.price));
  const buyHref = `/products/${SLUG}`;

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans">
      <div className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-sm border-b border-[#E2E6E3]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" aria-label="Sana Amnis home" className="shrink-0">
            <Image src="/logo3.png" alt="Sana Amnis" width={132} height={87} className="h-9 w-auto object-contain" priority />
          </Link>
          <Link href={buyHref}>
            <Button variant="botanical" size="sm" className="whitespace-nowrap">
              Get Yours
            </Button>
          </Link>
        </div>
      </div>

      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-16 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-7">
              <h1 className="font-serif text-[2.75rem] leading-[1.05] md:text-6xl md:leading-[1.04] font-medium tracking-tight text-[#161A17]">
                Coconut Milk, Whenever You Need It <span className="whitespace-nowrap">🥥</span>
              </h1>
              <p className="text-lg md:text-xl text-[#1C3322] font-medium leading-snug max-w-md">
                No fridge. No spoilage. No breaking a coconut for two tablespoons.
              </p>
              <p className="text-sm md:text-base text-[#676E6A] leading-relaxed max-w-md">
                {fromCatalog?.description ?? product?.description}
              </p>

              <div className="flex items-center gap-3 pt-1">
                <span className="font-serif text-3xl md:text-4xl font-bold text-[#1C3322]">From {naira(minPrice)}</span>
              </div>

              <Link href={buyHref} className="inline-block pt-2">
                <Button variant="botanical" size="lg" className="flex items-center gap-2">
                  Get Your Coconut Milk Powder <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <ScrollReveal direction="left" className="lg:col-span-6">
              <div className="rounded-[1.75rem] overflow-hidden border border-[#E2E6E3] shadow-ambient-lg bg-white">
                <Image
                  src="/products/coconut-milk-powder-supplied.jpg"
                  alt="Sana Amnis Coconut Milk Powder pouches"
                  width={1280}
                  height={960}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* The memory — emotional beat, full-bleed dark section */}
        <section className="bg-[#1C3322] text-[#FAF8F5]">
          <div className="max-w-3xl mx-auto px-5 md:px-8 py-20 md:py-28 text-center space-y-10">
            <ScrollReveal>
              <p className="font-serif text-2xl md:text-[2.15rem] leading-[1.5]">
                You know that moment mid-recipe when you realise the coconut milk finished, the shop is
                far, and grating a whole coconut for two tablespoons feels like overkill?
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-base md:text-lg text-[#FAF8F5]/70 leading-relaxed">
                That&apos;s the coconut milk problem. Fresh is great — until it goes off in three days,
                takes up fridge space, and can&apos;t travel with you without leaking or spoiling.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="font-serif text-3xl md:text-4xl font-medium text-[#C9A227] pt-2">
                We kept the coconut milk. We removed the shelf life.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Who this is for */}
        <section className="max-w-4xl mx-auto px-5 md:px-8 py-20 md:py-28">
          <ScrollReveal className="mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-[#161A17]">
              This could be you!
            </h2>
          </ScrollReveal>
          <div className="space-y-14">
            {WHO_ITS_FOR.map((item, i) => (
              <ScrollReveal key={item.line} delay={i * 0.08}>
                <div className={`space-y-2 ${i % 2 === 1 ? "md:pl-16" : ""}`}>
                  <p className="font-serif text-xl md:text-2xl font-medium text-[#161A17] leading-snug">
                    {item.line}
                  </p>
                  <p className="text-sm md:text-base text-[#676E6A] leading-relaxed max-w-lg">
                    {item.detail}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* What's actually in the pack */}
        <section className="bg-[#F3EFE8] py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-5 md:px-8 space-y-12">
            <ScrollReveal className="max-w-xl">
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-[#161A17]">
                What&apos;s actually in the pack.
              </h2>
            </ScrollReveal>

            <ScrollReveal className="space-y-6">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                {WHAT_YOU_GET.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-medium text-[#1C3322] bg-[#FAF8F5] border border-[#E2E6E3] rounded-[0.75rem] p-4">
                    <Check className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" /> {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4 pt-2">
                {variants.map((v) => (
                  <div key={v.sku} className="rounded-[1rem] bg-[#FAF8F5] border border-[#E2E6E3] px-5 py-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#676E6A]">{v.name}</p>
                    <p className="font-serif text-xl font-bold text-[#1C3322]">{naira(v.price)}</p>
                  </div>
                ))}
              </div>
              <Link href={buyHref} className="inline-block pt-2">
                <Button variant="botanical" size="lg" className="flex items-center gap-2">
                  Get Your Coconut Milk Powder <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* Uses grid */}
        <section className="max-w-6xl mx-auto px-5 md:px-8 py-20 md:py-24">
          <ScrollReveal className="max-w-xl mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-[#161A17]">
              One pouch, so many pots.
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {USES.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.06}>
                <div className="h-full rounded-[1.5rem] bg-[#F3EFE8] border border-[#E2E6E3] p-6 space-y-2">
                  <item.icon className="w-5 h-5 text-[#C9A227]" />
                  <p className="font-sans text-sm font-bold text-[#161A17]">{item.title}</p>
                  <p className="text-xs text-[#676E6A] leading-relaxed">{item.detail}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Objection handling */}
        <section className="max-w-3xl mx-auto px-5 md:px-8 py-20 md:py-24">
          <ScrollReveal className="rounded-[1.75rem] bg-[#FAF8F5] border border-[#E2E6E3] shadow-ambient-md p-8 md:p-12 space-y-5">
            <p className="font-serif text-xl md:text-2xl text-[#161A17] italic">
              &ldquo;But fresh coconut milk tastes better&hellip;&rdquo;
            </p>
            <p className="text-sm md:text-base text-[#676E6A] leading-relaxed">
              It's a fair point — and our Full-Cream Coconut Milk is right there when you want ready-to-pour.
              But the powder isn't trying to be fresh milk in a bag. It's the jar of coconut you keep on
              standby — for the recipe you didn't plan, the trip you're packing for, or the two tablespoons
              you actually need instead of a whole bottle.
            </p>
          </ScrollReveal>
        </section>

        {/* Testimonials — placeholders until real reviews are added */}
        <section className="bg-[#F3EFE8] py-20 md:py-24">
          <div className="max-w-4xl mx-auto px-5 md:px-8 space-y-10">
            <ScrollReveal>
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-[#161A17] max-w-xl">
                From the kitchens that have tried it
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[0, 1].map((i) => (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <div className="h-full rounded-[1.5rem] border border-dashed border-[#C9A227]/50 bg-[#FAF8F5] p-6 space-y-3">
                    <Sparkles className="w-4 h-4 text-[#C9A227]" />
                    <p className="text-sm text-[#676E6A] italic leading-relaxed">
                      A real customer quote will go here once we have one &mdash; how it mixed, what they
                      cooked with it, or whether they came back for the bigger pack.
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8C531B]">
                      Customer name / handle
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-[#1C3322] text-[#FAF8F5] py-20 md:py-28">
          <ScrollReveal className="max-w-2xl mx-auto px-5 md:px-8 text-center space-y-8">
            <p className="font-serif text-3xl md:text-5xl font-medium">
              Coconut milk, on standby. <span className="whitespace-nowrap">🥥❤️</span>
            </p>
            <Link href={buyHref} className="inline-block">
              <Button variant="gold" size="lg" className="flex items-center gap-2">
                Get Your Coconut Milk Powder <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}

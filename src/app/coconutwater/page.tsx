import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ds/motion/ScrollReveal";
import { getProduct } from "@/lib/products";
import { getBundles } from "@/lib/bundles";
import { CATALOG, formatNaira } from "@/lib/catalog";
import { Check, ArrowRight, Droplets, Leaf, Ban } from "lucide-react";

export const revalidate = 300;

const SLUG = "sana-amnis-coconut-water";
const naira = (value: number) => `₦${Math.round(value).toLocaleString("en-NG")}`;

export async function generateStaticParams() {
  return [{}];
}

export async function generateMetadata(): Promise<Metadata> {
  const title = "Coconut Water — No Wahala, Just Coconut";
  const description =
    "No added sugar, no concentrate, no preservatives — just coconut water the way it comes from the nut. Made in Nigeria from home-grown coconuts.";

  return {
    title,
    description,
    alternates: { canonical: "/coconutwater" },
    openGraph: { title, description, type: "website" },
  };
}

const WHAT_YOU_GET = [
  "No added sugar — the sweetness is just the coconut",
  "No concentrate, no reconstituting — straight from the nut",
  "No preservatives — refrigerate and drink within 48 hours of opening",
  "Naturally rich in potassium, magnesium and electrolytes",
];

const WHO_ITS_FOR = [
  {
    line: "The person stuck in traffic, hot as anything, who just wants something cold and real.",
    detail: "Not another fizzy drink loaded with sugar you'll regret by evening.",
  },
  {
    line: "The gym-goer who wants their electrolytes back without the syrupy sports drink.",
    detail: "Coconut water does the job nature's way — no dye, no artificial flavour.",
  },
  {
    line: "The parent who wants to hand their kids something natural.",
    detail: "Not a juice box of concentrate, sugar and a cartoon on the front.",
  },
];

const LEFTOVERS = [
  { title: "Post-Workout", uses: "Replace what you sweated out instead of reaching for a sports drink." },
  { title: "Everyday Hydration", uses: "Chilled, straight from the fridge, any hot Lagos afternoon." },
];

export default async function CoconutWaterLandingPage() {
  const product = await getProduct(SLUG);
  const fromCatalog = CATALOG.find((p) => p.slug === SLUG);
  if (!product && !fromCatalog) notFound();

  const variants = product?.variants ?? fromCatalog!.variants;
  const minPrice = Math.min(...variants.map((v) => v.price));
  const buyHref = `/products/${SLUG}`;

  const bundles = (await getBundles()).slice(0, 5);

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
                Coconut Water, The Easy Way <span className="whitespace-nowrap">🥥💧</span>
              </h1>
              <p className="text-lg md:text-xl text-[#1C3322] font-medium leading-snug max-w-md">
                No cutlass. No hawker. No hoping the one you bought this morning didn&apos;t turn.
              </p>
              <p className="text-sm md:text-base text-[#676E6A] leading-relaxed max-w-md">
                {fromCatalog?.description ?? product?.description}
              </p>

              <div className="flex items-center gap-3 pt-1">
                <span className="font-serif text-3xl md:text-4xl font-bold text-[#1C3322]">From {naira(minPrice)}</span>
              </div>

              <Link href={buyHref} className="inline-block pt-2">
                <Button variant="botanical" size="lg" className="flex items-center gap-2">
                  Get Your Coconut Water <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <ScrollReveal direction="left" className="lg:col-span-6">
              <div className="rounded-[1.75rem] overflow-hidden border border-[#E2E6E3] shadow-ambient-lg bg-white">
                <Image
                  src="/products/coconut-water-range.jpg"
                  alt="Sana Amnis Coconut Water — 250ml pouch and 500ml bottle"
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
                You know that thing where you&apos;re stuck in traffic, hot as anything, and you see a
                coconut seller by the road with a machete and a bucket &mdash; but you don&apos;t have time
                to stop, and even if you did, you don&apos;t know if today&apos;s batch is sweet.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-base md:text-lg text-[#FAF8F5]/70 leading-relaxed">
                That&apos;s the coconut water gamble. Not the drink &mdash; the drink is always good.
                It&apos;s getting to it that&apos;s the wahala: finding a seller, waiting for them to hack
                one open, hoping it&apos;s not sour, hoping it&apos;s cold.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="font-serif text-3xl md:text-4xl font-medium text-[#C9A227] pt-2">
                We kept the water. We removed the gamble.
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

        {/* What's actually in it */}
        <section className="bg-[#F3EFE8] py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-5 md:px-8 space-y-12">
            <ScrollReveal className="max-w-xl">
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-[#161A17]">
                What&apos;s actually in the bottle.
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
                  Get Your Coconut Water <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* Objection handling */}
        <section className="max-w-3xl mx-auto px-5 md:px-8 py-20 md:py-24">
          <ScrollReveal className="rounded-[1.75rem] bg-[#FAF8F5] border border-[#E2E6E3] shadow-ambient-md p-8 md:p-12 space-y-5">
            <p className="font-serif text-xl md:text-2xl text-[#161A17] italic">
              &ldquo;But I could just buy from the roadside seller&hellip;&rdquo;
            </p>
            <p className="text-sm md:text-base text-[#676E6A] leading-relaxed">
              You could. And some days that&apos;s exactly the vibe. But you can&apos;t always tell what
              you&apos;re getting until it&apos;s open — sweet or sour, cold or warm, clean or not. Every
              bottle of ours is the same coconut water every time: no added sugar, no concentrate, no
              guessing.
            </p>
          </ScrollReveal>
        </section>

        {/* Testimonials — real customer messages */}
        <section className="bg-[#F3EFE8] py-20 md:py-24">
          <div className="max-w-4xl mx-auto px-5 md:px-8 space-y-10">
            <ScrollReveal>
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-[#161A17] max-w-xl">
                What people say when it lands
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["/reviews/coconut-water-review-1.jpeg", "/reviews/coconut-water-review-3.jpeg"].map((src, i) => (
                <ScrollReveal key={src} delay={i * 0.08}>
                  <div className="rounded-[1.5rem] overflow-hidden border border-[#E2E6E3] shadow-ambient-md bg-white">
                    <Image src={src} alt="Real customer WhatsApp message about Sana Amnis Coconut Water" width={576} height={1024} className="w-full h-auto object-cover" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Bundles cross-sell */}
        <section className="max-w-6xl mx-auto px-5 md:px-8 py-20 md:py-28">
          <ScrollReveal className="max-w-xl mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-[#161A17]">
              Already stocking up? Go further with a bundle.
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map((bundle, i) => {
              const savings = bundle.regularValue && bundle.regularValue > bundle.price ? bundle.regularValue - bundle.price : null;
              return (
                <ScrollReveal key={bundle.id} delay={i * 0.06}>
                  <Link
                    href={`/bundles/${bundle.slug}`}
                    className="block h-full rounded-[1.5rem] bg-[#F3EFE8] border border-[#E2E6E3] shadow-ambient-sm overflow-hidden hover:border-[#1C3322]/40 transition-colors"
                  >
                    <div className="relative w-full aspect-[4/3] bg-white">
                      <Image src={bundle.heroImageUrl} alt={bundle.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    </div>
                    <div className="p-5 space-y-1.5">
                      <p className="font-sans text-sm font-bold text-[#161A17] leading-snug">{bundle.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-base font-bold text-[#1C3322]">{naira(bundle.price)}</span>
                        {savings && (
                          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#8C531B] bg-[#C9A227]/15 border border-[#C9A227]/40 px-2 py-0.5 rounded-full">
                            Save {naira(savings)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* Leftovers / occasions */}
        <section className="bg-[#F3EFE8] py-20 md:py-24">
          <div className="max-w-4xl mx-auto px-5 md:px-8">
            <ScrollReveal className="max-w-xl mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-[#161A17]">
                One drink, every reason to reach for it.
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {LEFTOVERS.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.08} className="space-y-2">
                  <div className="flex items-center gap-2 text-[#1C3322]">
                    <Droplets className="w-4 h-4 text-[#C9A227]" />
                    <p className="font-sans text-sm font-bold uppercase tracking-[0.1em]">{item.title}</p>
                  </div>
                  <p className="text-sm md:text-base text-[#676E6A] leading-relaxed">{item.uses}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-[#1C3322] text-[#FAF8F5] py-20 md:py-28">
          <ScrollReveal className="max-w-2xl mx-auto px-5 md:px-8 text-center space-y-8">
            <div className="flex items-center justify-center gap-6 text-[#C9A227]">
              <Leaf className="w-5 h-5" />
              <Ban className="w-5 h-5" />
              <Droplets className="w-5 h-5" />
            </div>
            <p className="font-serif text-3xl md:text-5xl font-medium">
              Reach for real, tonight. <span className="whitespace-nowrap">🥥💧</span>
            </p>
            <Link href={buyHref} className="inline-block">
              <Button variant="gold" size="lg" className="flex items-center gap-2">
                Get Your Coconut Water <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}

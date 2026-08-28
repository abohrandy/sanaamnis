import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ds/motion/ScrollReveal";
import { getBundle, getBundles, BUNDLES } from "@/lib/bundles";
import { Check, ArrowRight, Droplets, Sparkles } from "lucide-react";

export const revalidate = 300;

const SLUG = "rice-don-set";
const naira = (value: number) => `₦${Math.round(value).toLocaleString("en-NG")}`;

export async function generateStaticParams() {
  try {
    const bundles = await getBundles();
    return bundles.some((b) => b.slug === SLUG) ? [{}] : [];
  } catch {
    return [{}];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const bundle = await getBundle(SLUG);
  const title = "Rice Don Set — The Coconut Rice Bundle";
  const description =
    "The coconut rice you crave, without the coconut wahala. Coconut milk, coconut milk powder and cold-pressed coconut oil — everything you need for one seriously coconutty pot, for 4–6 people.";

  return {
    title,
    description,
    alternates: { canonical: "/coconutrice" },
    openGraph: {
      title,
      description,
      images: bundle ? [{ url: bundle.heroImageUrl }] : undefined,
      type: "website",
    },
  };
}

const WHO_ITS_FOR = [
  {
    line: "The mother who still wants to cook real food for her family.",
    detail: "She just doesn't have three hours to give a coconut before she even touches the rice.",
  },
  {
    line: "The host who wants Sunday lunch to feel like an event.",
    detail: "Not a chore that starts a day before anyone sits down to eat.",
  },
  {
    line: "The person tired of jollof and fried rice on repeat.",
    detail: "Who wants “what's that in the pot? it smells amazing” energy at the table.",
  },
];

const BUNDLE_ITEMS = [
  {
    label: "2 × 500ml Full-Cream Coconut Milk",
    detail: "The creamy, unmistakable base.",
    image: "/products/full-cream-coconut-milk.jpg",
  },
  {
    label: "100g Coconut Milk Powder",
    detail: "For when you want the coconut flavour LOUDER.",
    image: "/products/coconut-milk-powder.jpg",
  },
  {
    label: "200ml Cold-Pressed Coconut Oil",
    detail: "Flavour from the very first sauté.",
    image: "/products/coconut-oil-cold-pressed-200ml.jpg",
  },
];

const NO_LIST = ["No breaking.", "No grating.", "No squeezing.", "No straining."];

const LEFTOVERS = [
  {
    title: "Leftover Coconut Milk Powder",
    uses: "Your pap, oats, smoothies, tea, coffee, baking.",
  },
  {
    title: "Leftover Coconut Oil",
    uses: "Sautéing, pancakes, baking, everyday cooking.",
  },
];

export default async function CoconutRiceLandingPage() {
  const bundle = await getBundle(SLUG);
  const fromCatalog = BUNDLES.find((b) => b.slug === SLUG);
  if (!bundle && !fromCatalog) notFound();

  const price = bundle?.price ?? fromCatalog!.price;
  const regularValue = bundle?.regularValue ?? fromCatalog!.regularValue;
  const heroImageUrl = bundle?.heroImageUrl ?? fromCatalog!.heroImageUrl;
  const savings = regularValue && regularValue > price ? regularValue - price : null;
  const buyHref = `/bundles/${SLUG}`;

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans">
      {/* Slim brand bar — no site nav, so the only path forward is the bundle. */}
      <div className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-sm border-b border-[#E2E6E3]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" aria-label="Sana Amnis home" className="shrink-0">
            <Image src="/logo3.png" alt="Sana Amnis" width={132} height={87} className="h-9 w-auto object-contain" priority />
          </Link>
          <Link href={buyHref}>
            <Button variant="botanical" size="sm" className="whitespace-nowrap">
              Get Your Bundle
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
                Rice Don Set <span className="whitespace-nowrap">🥥🍚</span>
              </h1>
              <p className="text-lg md:text-xl text-[#1C3322] font-medium leading-snug max-w-md">
                The coconut rice you crave, without the coconut wahala.
              </p>
              <p className="text-sm md:text-base text-[#676E6A] leading-relaxed max-w-md">
                Just open, cook, and let the coconut do the talking — everything coconut you need for one
                seriously coconutty pot, for 4&ndash;6 people.
              </p>

              <div className="flex items-center gap-3 pt-1">
                <span className="font-serif text-3xl md:text-4xl font-bold text-[#1C3322]">{naira(price)}</span>
                {regularValue && (
                  <span className="text-sm text-[#676E6A] line-through">{naira(regularValue)}</span>
                )}
                {savings && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8C531B] bg-[#C9A227]/15 border border-[#C9A227]/40 px-2.5 py-1 rounded-full">
                    Save {naira(savings)}
                  </span>
                )}
              </div>

              <Link href={buyHref} className="inline-block pt-2">
                <Button variant="botanical" size="lg" className="flex items-center gap-2">
                  Get Your Bundle <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <ScrollReveal direction="left" className="lg:col-span-6">
              <div className="rounded-[1.75rem] overflow-hidden border border-[#E2E6E3] shadow-ambient-lg bg-white">
                <Image
                  src={heroImageUrl}
                  alt="Rice Don Set Coconut Rice Bundle — 2 bottles of full-cream coconut milk, coconut oil and coconut milk powder"
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
              <div className="rounded-[1.75rem] overflow-hidden border border-[#FAF8F5]/10 shadow-ambient-lg">
                <Image
                  src="/coconutrice/hero-pot.png"
                  alt="A steaming pot of coconut rice with fried plantain, being served at the table"
                  width={1402}
                  height={1122}
                  className="w-full h-auto object-cover"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <p className="font-serif text-2xl md:text-[2.15rem] leading-[1.5] md:leading-[1.5]">
                You know that Sunday afternoon feeling &mdash; pot bubbling, that coconut smell filling the
                whole house, everybody already hovering near the kitchen asking &ldquo;is it ready?&rdquo;
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-base md:text-lg text-[#FAF8F5]/70 leading-relaxed">
                That&apos;s the coconut rice memory. Not the three hours before it &mdash; the breaking,
                grating, squeezing, straining, and still wondering if you got enough milk out of that
                coconut.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="font-serif text-3xl md:text-4xl font-medium text-[#C9A227] pt-2">
                We kept the memory. We removed the wahala.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.28}>
              <div className="rounded-[1.75rem] overflow-hidden border border-[#FAF8F5]/10 shadow-ambient-lg">
                <Image
                  src="/coconutrice/before-after.png"
                  alt="Before: a grater, cracked coconuts and a straining cloth, messy and time-consuming. After: Sana Amnis coconut milk, oil and powder, pure and convenient."
                  width={1536}
                  height={1024}
                  className="w-full h-auto object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Who this is for */}
        <section className="max-w-4xl mx-auto px-5 md:px-8 py-20 md:py-28">
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

        {/* Everything you need. Nothing you don't. */}
        <section className="bg-[#F3EFE8] py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-5 md:px-8 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <ScrollReveal className="lg:col-span-5 order-2 lg:order-1">
                <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-[#161A17]">
                  Everything you need. Nothing you don&apos;t.
                </h2>
              </ScrollReveal>
              <ScrollReveal direction="left" className="lg:col-span-7 order-1 lg:order-2">
                <div className="rounded-[1.75rem] overflow-hidden border border-[#E2E6E3] shadow-ambient-lg">
                  <Image
                    src="/coconutrice/bundle-flatlay.png"
                    alt="Rice Don Set contents laid flat — coconut milk, coconut oil and coconut milk powder"
                    width={1402}
                    height={1122}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {BUNDLE_ITEMS.map((item, i) => (
                <ScrollReveal key={item.label} delay={i * 0.08}>
                  <div className="h-full rounded-[1.5rem] bg-[#FAF8F5] border border-[#E2E6E3] shadow-ambient-sm overflow-hidden flex flex-col">
                    <div className="relative w-full aspect-[4/3] bg-white">
                      <Image
                        src={item.image}
                        alt={item.label}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain p-6"
                      />
                    </div>
                    <div className="p-6 space-y-1.5">
                      <p className="font-sans text-sm font-bold text-[#161A17]">{item.label}</p>
                      <p className="text-xs text-[#676E6A] leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal className="pt-4 space-y-6">
              <p className="font-serif text-2xl md:text-3xl text-[#1C3322] max-w-xl">
                {naira(price)}. One bundle. One seriously coconutty pot, for 4&ndash;6 people.
              </p>
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
                {NO_LIST.map((item) => (
                  <li key={item} className="flex items-center gap-1.5 text-xs font-semibold text-[#1C3322]">
                    <Check className="w-3.5 h-3.5 text-[#C9A227] shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-[#676E6A]">Just open, cook, and let the coconut do the talking.</p>
              <Link href={buyHref} className="inline-block">
                <Button variant="botanical" size="lg" className="flex items-center gap-2">
                  Get Your Bundle <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* How it comes together */}
        <section className="max-w-6xl mx-auto px-5 md:px-8 py-20 md:py-24">
          <ScrollReveal className="max-w-xl mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-[#161A17]">
              From pot to plate, four steps.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <div className="rounded-[1.75rem] overflow-hidden border border-[#E2E6E3] shadow-ambient-lg">
              <Image
                src="/coconutrice/recipe-steps.png"
                alt="Four steps: sauté onions and peppers, pour in coconut milk, sprinkle coconut milk powder, stir the finished coconut rice"
                width={1536}
                height={1024}
                className="w-full h-auto object-cover"
              />
            </div>
          </ScrollReveal>
        </section>

        {/* Objection handling */}
        <section className="max-w-3xl mx-auto px-5 md:px-8 py-20 md:py-24 space-y-8">
          <ScrollReveal className="rounded-[1.75rem] overflow-hidden border border-[#E2E6E3] shadow-ambient-lg">
            <Image
              src="/coconutrice/richness-comparison.png"
              alt="Side by side: plain coconut milk, thin and watery; other brands, average; Sana Amnis coconut milk, thick, creamy and naturally golden"
              width={1536}
              height={1024}
              className="w-full h-auto object-cover"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.08} className="rounded-[1.75rem] bg-[#FAF8F5] border border-[#E2E6E3] shadow-ambient-md p-8 md:p-12 space-y-5">
            <p className="font-serif text-xl md:text-2xl text-[#161A17] italic">
              &ldquo;But I could just buy plain coconut milk&hellip;&rdquo;
            </p>
            <p className="text-sm md:text-base text-[#676E6A] leading-relaxed">
              You could. But that&apos;s one note. This is three &mdash; oil to start the flavour, milk for
              the creamy base, powder to push it as rich as you want it. Most people don&apos;t realize how
              much richer their rice can taste until they layer coconut through the whole cooking process,
              not just one step of it.
            </p>
          </ScrollReveal>
        </section>

        {/* Testimonials — one real, one placeholder until more reviews come in */}
        <section className="bg-[#F3EFE8] py-20 md:py-24">
          <div className="max-w-4xl mx-auto px-5 md:px-8 space-y-10">
            <ScrollReveal>
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-[#161A17] max-w-xl">
                From the kitchens that have tried it
              </h2>
            </ScrollReveal>

            <ScrollReveal>
              <div className="rounded-[1.75rem] overflow-hidden border border-[#E2E6E3] shadow-ambient-lg">
                <Image
                  src="/coconutrice/testimonial-family.png"
                  alt="A family sharing a meal of coconut rice together"
                  width={1536}
                  height={1024}
                  className="w-full h-auto object-cover"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <div className="rounded-[1.5rem] border border-dashed border-[#C9A227]/50 bg-[#FAF8F5] p-6 space-y-3 max-w-md">
                <Sparkles className="w-4 h-4 text-[#C9A227]" />
                <p className="text-sm text-[#676E6A] italic leading-relaxed">
                  A real customer quote will go here once we have one &mdash; how the rice turned out, what
                  their family said, or whether they came back for more.
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8C531B]">
                  Customer name / handle
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Leftovers */}
        <section className="max-w-4xl mx-auto px-5 md:px-8 py-20 md:py-28">
          <ScrollReveal className="max-w-xl mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-[#161A17]">
              And it doesn&apos;t stop at rice.
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

          <ScrollReveal delay={0.16}>
            <p className="pt-10 text-base md:text-lg text-[#161A17] max-w-xl">
              You&apos;re not just buying dinner. You&apos;re stocking your kitchen with coconut, done
              properly.
            </p>
          </ScrollReveal>
        </section>

        {/* Final CTA */}
        <section className="bg-[#1C3322] text-[#FAF8F5] py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-5 md:px-8 space-y-10 text-center">
            <ScrollReveal>
              <div className="rounded-[1.75rem] overflow-hidden border border-[#FAF8F5]/10 shadow-ambient-lg">
                <Image
                  src="/coconutrice/shop-now-banner.png"
                  alt="Rice Don Set — coconut milk, oil and powder, ready to shop"
                  width={1536}
                  height={1024}
                  className="w-full h-auto object-cover"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <Link href={buyHref} className="inline-block">
                <Button variant="gold" size="lg" className="flex items-center gap-2">
                  Get Your Bundle <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

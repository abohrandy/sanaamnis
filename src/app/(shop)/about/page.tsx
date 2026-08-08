import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Sprout, ShieldCheck, Lightbulb, Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Sana Amnis",
  description:
    "Sana Amnis is a proudly Nigerian health and wellness brand created by Community Mart Limited, transforming coconut into wholesome products for healthier everyday living.",
  alternates: { canonical: "/about" },
};

const COMMITMENTS = [
  { icon: Sprout, title: "Health & Wellness", body: "We develop products with the wellbeing of our customers at the centre of our decisions." },
  { icon: ShieldCheck, title: "Quality & Food Safety", body: "From sourcing to processing and packaging, we are committed to high standards of hygiene, quality control and responsible production." },
  { icon: Lightbulb, title: "Innovation", body: "We explore better ways to transform natural ingredients into convenient products for modern lifestyles." },
  { icon: Users, title: "Community & Sustainability", body: "By sourcing locally and expanding coconut processing within Nigeria, we aim to support farmers and create wider economic opportunities." },
];

const PRODUCTS = [
  ["Sana Amnis Coconut Water", "Naturally refreshing coconut water made from fresh green coconuts."],
  ["Coconut Milk & Coconut Milk Powder", "Rich, versatile coconut goodness for beverages, cooking and baking."],
  ["Cold-Pressed Coconut Oil", "A naturally versatile oil for culinary and everyday use."],
  ["Coconut Flour", "A fibre-rich alternative for pancakes, breads, cookies and other recipes."],
  ["Coconut Flakes & Desiccated Coconut", "Coconut additions for snacking, baking, smoothies, cereals and meal toppings."],
  ["Coconut Poundo", "An innovative coconut-based swallow for people looking for new ways to incorporate more fibre into their meals."],
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-grow w-full">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-16 space-y-20">
          <Breadcrumbs items={[{ label: "About" }]} />

          <header className="max-w-3xl space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-bold">About Sana Amnis</span>
            <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17] leading-[1.12]">
              Naturally Nourishing. Purposefully Made.
            </h1>
            <p className="text-sm md:text-base text-[#676E6A] leading-[1.85]">
              Sana Amnis is a proudly Nigerian health and wellness brand created by
              Community Mart Limited, a coconut processing company committed to
              transforming one of nature&apos;s most versatile foods into wholesome
              products for healthier everyday living.
            </p>
          </header>

          <section className="space-y-8">
            <div className="max-w-3xl space-y-5">
              <h2 className="font-serif text-2xl md:text-3xl font-medium text-[#1C3322]">Our philosophy</h2>
              <p className="text-sm md:text-base text-[#161A17]/75 leading-[1.85]">
                At Sana Amnis, we believe that what we consume every day plays an
                important role in how well we live. That is why our products are created
                with a simple philosophy: <strong>keep it natural, preserve the goodness,
                and make healthy living easier.</strong>
              </p>
              <p className="text-sm md:text-base text-[#161A17]/75 leading-[1.85]">
                From refreshing coconut water to coconut milk, coconut oil, coconut flour,
                coconut flakes and other innovative coconut-based foods, Sana Amnis brings
                the natural goodness of coconut closer to individuals and families in
                convenient, delicious and practical forms.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="relative aspect-[4/3] bg-[#F3EFE8] rounded-[1.5rem] overflow-hidden shadow-ambient-md border border-[#E2E6E3]">
                <Image
                  src="/products/range-full-light.jpg"
                  alt="The Sana Amnis coconut product range"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-5">
                <h2 className="font-serif text-2xl font-medium text-[#1C3322]">Our Story</h2>
                <p className="text-sm md:text-base text-[#161A17]/75 leading-[1.85]">
                  Sana Amnis was founded by Dr. Chikaodinaka Ezeokeke, a medical
                  practitioner and entrepreneur with a passion for preventive health and
                  nutrition.
                </p>
                <p className="text-sm md:text-base text-[#161A17]/75 leading-[1.85]">
                  Through years of medical practice, she saw first-hand how everyday
                  lifestyle choices, particularly what we eat and drink, can influence our
                  long-term health and wellbeing. This inspired a bigger question: what if
                  healthier choices could also be natural, enjoyable and easy to incorporate
                  into everyday life?
                </p>
                <p className="text-sm md:text-base text-[#161A17]/75 leading-[1.85]">
                  By combining healthcare knowledge with food processing and innovation, we
                  are building coconut products designed to help people make healthier
                  choices without giving up great taste or convenience.
                </p>
              </div>
            </div>
          </section>

          <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 pt-14 border-t border-[#E2E6E3]">
            {COMMITMENTS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="space-y-3">
                <Icon className="w-5 h-5 text-[#C9A227]" aria-hidden="true" />
                <h3 className="font-serif text-lg font-medium text-[#1C3322]">{title}</h3>
                <p className="text-sm text-[#676E6A] leading-relaxed">{body}</p>
              </div>
            ))}
          </section>

          <section className="grid md:grid-cols-2 gap-12 md:gap-16">
            <div className="space-y-5">
              <h2 className="font-serif text-2xl md:text-3xl font-medium text-[#1C3322]">From the Coconut to Your Home</h2>
              <p className="text-sm md:text-base text-[#161A17]/75 leading-[1.85]">
                We source our coconuts locally, supporting farmers and coconut-producing
                communities while allowing us to work closer to the source of our most
                important ingredient.
              </p>
              <p className="text-sm md:text-base text-[#161A17]/75 leading-[1.85]">
                We carefully process our products to preserve as much of their natural
                character, flavour and nutritional value as possible while maintaining
                high standards of hygiene, quality and food safety. Because the coconut
                is incredibly versatile, we believe very little should go to waste.
              </p>
            </div>
            <div className="space-y-5">
              <h2 className="font-serif text-2xl md:text-3xl font-medium text-[#1C3322]">Our Products</h2>
              <div className="space-y-4">
                {PRODUCTS.map(([name, description]) => (
                  <div key={name}>
                    <h3 className="font-semibold text-sm text-[#161A17]">{name}</h3>
                    <p className="text-sm text-[#676E6A] leading-relaxed">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-[1.5rem] bg-[#1C3322] text-[#FAF8F5] space-y-4">
              <h2 className="font-serif text-2xl font-medium">Our Vision</h2>
              <p className="text-sm text-[#FAF8F5]/80 leading-relaxed">
                To build Sana Amnis into one of Africa&apos;s most trusted coconut-based
                health and wellness brands, recognised for quality, innovation and our
                commitment to helping people live healthier lives naturally.
              </p>
            </div>
            <div className="p-8 rounded-[1.5rem] bg-[#F3EFE8] border border-[#E2E6E3] space-y-4">
              <h2 className="font-serif text-2xl font-medium text-[#1C3322]">Our Mission</h2>
              <p className="text-sm text-[#676E6A] leading-relaxed">
                To combine health knowledge, nature and innovative food processing to
                create high-quality coconut products that make healthier choices easier,
                more enjoyable and more accessible.
              </p>
            </div>
          </section>

          <section className="p-8 md:p-10 rounded-[1.5rem] bg-[#F3EFE8]/60 border border-[#E2E6E3] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-2">
              <h2 className="font-serif text-xl md:text-2xl font-medium text-[#1C3322]">The Sana Amnis Promise</h2>
              <p className="text-sm text-[#676E6A] leading-relaxed">
                We are not simply processing coconuts. We are building a brand around the
                belief that some of the best solutions for healthier living already exist
                in nature. Our responsibility is to preserve that goodness, package it
                responsibly and bring it closer to you.
              </p>
            </div>
            <Link href="/shop" className="shrink-0">
              <Button variant="botanical" size="lg" className="flex items-center gap-2">
                Shop the range <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

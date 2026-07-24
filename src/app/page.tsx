import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { db } from "@/db";
import { ProductCard } from "@/components/ds/cards/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Newsletter } from "@/components/layout/Newsletter";
import { NigerianHeritageStory } from "@/components/ds/storytelling/NigerianHeritageStory";
import { ColdPressProcess } from "@/components/ds/storytelling/ColdPressProcess";
import { ChevronRight, CheckCircle2, ShieldCheck, MapPin, Dumbbell, Briefcase, Users, RefreshCw, Sparkles, ArrowRight } from "lucide-react";

export const revalidate = 60; // ISR validation time

const FALLBACK_COCONUT_PRODUCTS = [
  {
    id: "1",
    title: "Sana Amnis Coconut Water (500ml)",
    slug: "sana-amnis-coconut-water",
    category: "Organic Wellness",
    price: 3000,
    imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLsnISaHCg5o21SrvBbZRdt8Qcl_tsL5caCWPyHPzlvMiBR7WZ5ltl4b6x8SXY7JoINwVeevisCReRMYVksaOuivD86v9Gd3sLH87Lekwd8eOJzsns4QOI3WRu2gIlhERvVW2nHQJG1wukkobTBbIcUviw8Y4_RBF6RIrCBnLg5Cb51z18bBhth15u82kTqhtDwxAPS-YjkJzyE6mYDYrLm7NIVKXYSAsOFHuC2U5ckPbXgKZHiQfLTm6VQ",
    tagline: "100% natural, refreshing coconut water packed with electrolytes, sustainably bottled at source.",
  },
  {
    id: "2",
    title: "Sana Amnis Coconut Water (250ml)",
    slug: "sana-amnis-coconut-water",
    category: "Organic Wellness",
    price: 1500,
    imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLsnISaHCg5o21SrvBbZRdt8Qcl_tsL5caCWPyHPzlvMiBR7WZ5ltl4b6x8SXY7JoINwVeevisCReRMYVksaOuivD86v9Gd3sLH87Lekwd8eOJzsns4QOI3WRu2gIlhERvVW2nHQJG1wukkobTBbIcUviw8Y4_RBF6RIrCBnLg5Cb51z18bBhth15u82kTqhtDwxAPS-YjkJzyE6mYDYrLm7NIVKXYSAsOFHuC2U5ckPbXgKZHiQfLTm6VQ",
    tagline: "Naturally sweet and refreshing coconut water in a convenient, eco-friendly 250ml pouch format.",
  },
  {
    id: "3",
    title: "Nourishing Coconut Body Butter",
    slug: "coconut-body-butter",
    category: "Premium Skincare",
    price: 18000,
    imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLsnISaHCg5o21SrvBbZRdt8Qcl_tsL5caCWPyHPzlvMiBR7WZ5ltl4b6x8SXY7JoINwVeevisCReRMYVksaOuivD86v9Gd3sLH87Lekwd8eOJzsns4QOI3WRu2gIlhERvVW2nHQJG1wukkobTBbIcUviw8Y4_RBF6RIrCBnLg5Cb51z18bBhth15u82kTqhtDwxAPS-YjkJzyE6mYDYrLm7NIVKXYSAsOFHuC2U5ckPbXgKZHiQfLTm6VQ",
    tagline: "Ultra-hydrating body moisturizer made with cold-pressed coconut butter and whipped natural oils.",
  },
];

export default async function Home() {
  let products: any[] = FALLBACK_COCONUT_PRODUCTS;

  try {
    const productsInDb = await db.query.products.findMany({
      where: (p, { eq }) => eq(p.isActive, true),
      with: {
        category: true,
        variants: true,
      },
    });

    if (productsInDb && productsInDb.length > 0) {
      products = productsInDb.map((p) => {
        const numericPrice = p.variants?.[0]?.price ? parseFloat(p.variants[0].price) : 3000;
        return {
          id: p.id,
          title: p.title,
          slug: p.slug,
          category: p.category?.name || "Organic Wellness",
          price: numericPrice,
          imageUrl: p.variants?.[0]?.imageUrl || "https://lh3.googleusercontent.com/aida/AP1WRLsnISaHCg5o21SrvBbZRdt8Qcl_tsL5caCWPyHPzlvMiBR7WZ5ltl4b6x8SXY7JoINwVeevisCReRMYVksaOuivD86v9Gd3sLH87Lekwd8eOJzsns4QOI3WRu2gIlhERvVW2nHQJG1wukkobTBbIcUviw8Y4_RBF6RIrCBnLg5Cb51z18bBhth15u82kTqhtDwxAPS-YjkJzyE6mYDYrLm7NIVKXYSAsOFHuC2U5ckPbXgKZHiQfLTm6VQ",
          tagline: p.description,
        };
      });
    }
  } catch (err) {
    console.error("DB query failed in homepage, falling back to mock products:", err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#161A17] selection:bg-[#C9A227] selection:text-[#FAF8F5]">
      <Header />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 py-6 space-y-24">
        
        {/* Editorial Hero Layout Block */}
        <section className="relative h-[75vh] md:h-[85vh] w-full flex items-center justify-center rounded-[2rem] overflow-hidden shadow-ambient-lg border border-[#E2E6E3]/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Sana Amnis Premium Coconut Wellness Sanctuary"
            className="absolute inset-0 w-full h-full object-cover rounded-[2rem] brightness-90 scale-100 transition-transform duration-1000 hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC07WXtYVjd0cZ9GcvZZNyzIPOmSCd0hhyaAN-9MubRN4TsLY7XXhWir0ekH142Oz3vkrBiUu4feTlSttsylndaVvNfTEnSGqMYHrdwgs0ou6YLOYY0yPPoqqixY_--KWZZupzbKmKGXPr29VfWW_MqJ4Sexb666SbUw2B9MrqbAKT9m0zWefDFTSlb0u2raljI1un8yXbmxuB9GWepc21NMP4Uw_EkYElqw1rjiKZACv-ZT3j4ge1Z1ZQ_FrTo6o9dJTRP-JdT4Q0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C3322]/80 via-[#1C3322]/30 to-transparent"></div>
          
          <div className="relative z-10 text-center text-[#FAF8F5] px-6 max-w-4xl space-y-6">
            <Badge variant="gold" size="md" className="mx-auto shadow-ambient-sm">
              Single-Origin Coastal Harvest
            </Badge>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] text-[#FAF8F5] drop-shadow-md">
              The Purest Essence<br />of Nigeria
            </h1>

            <p className="font-sans text-sm md:text-lg max-w-xl mx-auto text-[#FAF8F5]/90 font-light leading-relaxed drop-shadow-sm">
              Sustainably harvested cold-pressed extra virgin coconut oil and bioactive hydration formulated for mindful luxury.
            </p>

            <div className="pt-4 flex items-center justify-center gap-4">
              <Link href="/shop">
                <Button variant="gold" size="lg" className="flex items-center gap-2">
                  Explore Catalog <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/about" className="hidden sm:inline-block">
                <Button variant="alabaster" size="lg">
                  Read Ethos
                </Button>
              </Link>
            </div>

          </div>
        </section>

        {/* Floating Organic Stats Panel */}
        <section className="-mt-14 relative z-20 max-w-5xl mx-auto">
          <div className="glass-alabaster rounded-[1.5rem] p-6 md:p-8 flex flex-wrap justify-around items-center shadow-ambient-md border border-[#E2E6E3]/80">
            <div className="flex items-center gap-3 py-2">
              <CheckCircle2 className="w-5 h-5 text-[#1C3322]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#161A17]">100% Cold Pressed</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-[#E2E6E3]" />
            <div className="flex items-center gap-3 py-2">
              <ShieldCheck className="w-5 h-5 text-[#1C3322]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#161A17]">Zero Preservatives</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-[#E2E6E3]" />
            <div className="flex items-center gap-3 py-2">
              <MapPin className="w-5 h-5 text-[#C9A227]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#161A17]">Badagry Single-Origin</span>
            </div>
          </div>
        </section>

        {/* Storytelling Heritage Section */}
        <NigerianHeritageStory />

        {/* Dynamic Products Grid Section */}
        <section className="space-y-10">
          <div className="flex justify-between items-end border-b border-[#E2E6E3] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A227] block mb-1">
                Bio-Active Formulations
              </span>
              <h2 className="font-serif text-2xl md:text-4xl font-semibold text-[#1C3322]">
                Featured Essentials
              </h2>
            </div>
            <Link href="/shop">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                Browse Full Shop <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                title={item.title}
                slug={item.slug}
                category={item.category}
                price={item.price}
                imageUrl={item.imageUrl}
                tagline={item.tagline}
              />
            ))}
          </div>
        </section>

        {/* Cold Press Craft Process Module */}
        <ColdPressProcess />

        {/* Occasions & Wellness Rituals */}
        <section className="space-y-10 py-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A227]">
              Daily Rituals & Use Cases
            </span>
            <h2 className="font-serif text-2xl md:text-4xl font-semibold text-[#1C3322]">
              Elevate Every Moment
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FAF8F5] p-8 rounded-[1.5rem] border border-[#E2E6E3] text-center space-y-4 shadow-ambient-sm hover-lift-luxury">
              <div className="w-12 h-12 bg-[#F3EFE8] rounded-full flex items-center justify-center mx-auto text-[#1C3322]">
                <Dumbbell className="w-6 h-6 text-[#1C3322]" />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#1C3322]">Fitness & Recovery</h3>
              <p className="text-xs text-[#676E6A] leading-relaxed font-sans">
                Replenish active minerals, potassium, and trace electrolytes naturally following high-intensity athletic sessions.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-8 rounded-[1.5rem] border border-[#E2E6E3] text-center space-y-4 shadow-ambient-sm hover-lift-luxury">
              <div className="w-12 h-12 bg-[#F3EFE8] rounded-full flex items-center justify-center mx-auto text-[#1C3322]">
                <Briefcase className="w-6 h-6 text-[#1C3322]" />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#1C3322]">Executive Focus</h3>
              <p className="text-xs text-[#676E6A] leading-relaxed font-sans">
                Sustain cellular hydration and cognitive focus during demanding working days without synthetic sugars or energy crashes.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-8 rounded-[1.5rem] border border-[#E2E6E3] text-center space-y-4 shadow-ambient-sm hover-lift-luxury">
              <div className="w-12 h-12 bg-[#F3EFE8] rounded-full flex items-center justify-center mx-auto text-[#1C3322]">
                <Users className="w-6 h-6 text-[#1C3322]" />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#1C3322]">Family Gatherings</h3>
              <p className="text-xs text-[#676E6A] leading-relaxed font-sans">
                A pure, delicious organic beverage alternative for family celebrations, picnics, and mindful hospitality.
              </p>
            </div>
          </div>
        </section>

        {/* Newsletter Gazette Component */}
        <Newsletter />

        {/* Satisfaction Guarantee Section */}
        <section className="glass-alabaster rounded-[2rem] p-8 md:p-12 text-center border border-[#E2E6E3] max-w-4xl mx-auto space-y-6 shadow-ambient-md my-8">
          <div className="w-16 h-16 bg-[#F3EFE8] rounded-full flex items-center justify-center mx-auto text-[#C9A227] border border-gold-hairline">
            <RefreshCw className="w-8 h-8 animate-spin-slow" />
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-[#1C3322]">
            100% Satisfaction Guarantee
          </h3>
          <p className="text-sm text-[#676E6A] leading-relaxed font-sans max-w-2xl mx-auto">
            Not completely delighted by the pure taste and bio-active benefits of your Sana Amnis formulation? We offer a complimentary refund or replacement guarantee on all orders.
          </p>
        </section>

      </main>

      <Footer />
    </div>
  );
}


import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ArrowRight, Clock, Users } from "lucide-react";
import { RECIPES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Recipes",
  description:
    "Simple things to cook with coconut milk powder, coconut flour and cold-pressed coconut oil — plus a hair treatment that actually works.",
  alternates: { canonical: "/recipes" },
};

export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 py-12 md:py-16 space-y-12">
        <Breadcrumbs items={[{ label: "Recipes" }]} />

        <header className="max-w-2xl space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-bold">
            Recipes
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17] leading-[1.12]">
            Things worth making
          </h1>
          <p className="text-sm md:text-base text-[#676E6A] leading-relaxed">
            A handful of recipes that use what we sell, written properly — with the
            ratios that matter and the mistakes worth avoiding.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {RECIPES.map((recipe, i) => (
            <article
              key={recipe.slug}
              className="group relative flex flex-col rounded-[1.25rem] border border-[#E2E6E3] overflow-hidden bg-[#FAF8F5] hover:shadow-ambient-md hover-lift-luxury transition-all duration-500"
            >
              <div className="relative aspect-[4/3] bg-[#F3EFE8] overflow-hidden">
                <Image
                  src={recipe.image}
                  alt=""
                  fill
                  priority={i < 2}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-5 md:p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.14em] text-[#676E6A] font-semibold mb-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" aria-hidden="true" /> {recipe.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3 h-3" aria-hidden="true" /> {recipe.serves}
                  </span>
                </div>

                <h2 className="font-serif text-lg font-medium text-[#161A17] leading-snug mb-1.5">
                  <Link
                    href={`/recipes/${recipe.slug}`}
                    className="transition-colors hover:text-[#1C3322]"
                  >
                    <span className="absolute inset-0 z-10" aria-hidden="true" />
                    {recipe.title}
                  </Link>
                </h2>

                <p className="text-xs text-[#676E6A] leading-relaxed line-clamp-3 mb-4">
                  {recipe.excerpt}
                </p>

                <span className="mt-auto pt-4 border-t border-[#E2E6E3]/70 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1C3322] group-hover:text-[#C9A227] transition-colors">
                  Read recipe
                  <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

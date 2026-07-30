import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ds/cards/product-card";
import { Clock, Users, Lightbulb } from "lucide-react";
import { RECIPES, getRecipe } from "@/lib/content";
import { CATALOG } from "@/lib/catalog";

export function generateStaticParams() {
  return RECIPES.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return { title: "Recipe not found" };

  return {
    title: recipe.title,
    description: recipe.excerpt,
    alternates: { canonical: `/recipes/${recipe.slug}` },
    openGraph: {
      title: `${recipe.title} | Sana Amnis`,
      description: recipe.excerpt,
      images: [{ url: recipe.image }],
      type: "article",
    },
  };
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipe(slug);

  if (!recipe) notFound();

  const used = recipe.usesProducts
    .map((s) => CATALOG.find((p) => p.slug === s))
    .filter(Boolean) as typeof CATALOG;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.excerpt,
    image: recipe.image,
    totalTime: recipe.duration,
    recipeYield: recipe.serves,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.steps.map((text) => ({ "@type": "HowToStep", text })),
    author: { "@type": "Organization", name: "Sana Amnis" },
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-grow w-full max-w-[1100px] mx-auto px-4 md:px-8 py-12 md:py-16 space-y-12">
        <Breadcrumbs
          items={[{ label: "Recipes", href: "/recipes" }, { label: recipe.title }]}
        />

        <header className="space-y-5 max-w-3xl">
          <Badge variant="gold">{recipe.difficulty}</Badge>
          <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17] leading-[1.12]">
            {recipe.title}
          </h1>
          <p className="text-base md:text-lg text-[#676E6A] leading-relaxed">
            {recipe.excerpt}
          </p>

          <dl className="flex flex-wrap gap-x-8 gap-y-3 pt-2 text-[11px] uppercase tracking-[0.14em] font-bold text-[#1C3322]">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#C9A227]" aria-hidden="true" />
              <dt className="sr-only">Time</dt>
              <dd>{recipe.duration}</dd>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[#C9A227]" aria-hidden="true" />
              <dt className="sr-only">Yield</dt>
              <dd>{recipe.serves}</dd>
            </div>
          </dl>
        </header>

        <div className="relative aspect-[16/9] rounded-[1.5rem] overflow-hidden bg-[#F3EFE8] border border-[#E2E6E3] shadow-ambient-md">
          <Image
            src={recipe.image}
            alt=""
            fill
            priority
            sizes="(max-width: 1100px) 100vw, 1100px"
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <section className="lg:col-span-5" aria-labelledby="ingredients">
            <h2
              id="ingredients"
              className="font-serif text-xl md:text-2xl font-medium text-[#1C3322] mb-5"
            >
              What you need
            </h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-[#161A17]/80 leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C9A227] shrink-0"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="lg:col-span-7" aria-labelledby="method">
            <h2
              id="method"
              className="font-serif text-xl md:text-2xl font-medium text-[#1C3322] mb-5"
            >
              Method
            </h2>
            <ol className="space-y-5">
              {recipe.steps.map((step, i) => (
                <li key={step.slice(0, 30)} className="flex gap-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[#1C3322] text-[#C9A227] flex items-center justify-center font-serif text-sm font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-[#161A17]/80 leading-[1.8] pt-1">{step}</p>
                </li>
              ))}
            </ol>

            {recipe.tip && (
              <aside className="mt-8 p-5 rounded-[1rem] bg-[#F3EFE8]/70 border border-[#E2E6E3] flex gap-3">
                <Lightbulb className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-[#676E6A] leading-relaxed">
                  <strong className="text-[#161A17] font-semibold">Tip. </strong>
                  {recipe.tip}
                </p>
              </aside>
            )}
          </section>
        </div>

        {used.length > 0 && (
          <section className="pt-10 border-t border-[#E2E6E3] space-y-6">
            <h2 className="font-serif text-2xl font-medium text-[#1C3322]">
              What this uses
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {used.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ))}
            </div>
          </section>
        )}

        <div className="pt-6">
          <Link
            href="/recipes"
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1C3322] hover:text-[#C9A227] transition-colors"
          >
            ← All recipes
          </Link>
        </div>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

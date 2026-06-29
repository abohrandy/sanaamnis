import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Collection {
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  itemCount: number;
}

const MOCK_COLLECTIONS: Collection[] = [
  {
    title: "The Coconut Body Ritual",
    slug: "body-ritual",
    description: "Cold-pressed elixirs and whipped soufflés designed to restore natural epidermal elasticity.",
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600",
    itemCount: 4,
  },
  {
    title: "Active Wellness Hydration",
    slug: "wellness-hydration",
    description: "Electrolyte-rich organic coconut water extracts sourced directly from volcanic soil groves.",
    imageUrl: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=600",
    itemCount: 3,
  },
  {
    title: "Culinary Precision Infusions",
    slug: "culinary-infusions",
    description: "Pure extra virgin coconut fats pressed under organic standards for botanical cooking.",
    imageUrl: "https://images.unsplash.com/photo-1540340561271-9d29158bf3ee?q=80&w=600",
    itemCount: 5,
  },
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-20 w-full space-y-16">
        {/* Intro */}
        <div className="max-w-2xl space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">
            Curated Collections
          </span>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Botanical Assemblages
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Discover specialized groups of premium coconut formulations crafted for systemic skin vitality, dietary balance, and deep hydration.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {MOCK_COLLECTIONS.map((c) => (
            <div
              key={c.slug}
              className="group bg-card rounded-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-500 shadow-[0_10px_40px_rgba(53,94,59,0.03)]"
            >
              {/* Photo */}
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                <img
                  src={c.imageUrl}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 right-4 px-3 py-1 bg-background/80 backdrop-blur-md rounded-full text-[9px] uppercase tracking-widest text-primary font-bold">
                  {c.itemCount} Formulations
                </span>
              </div>

              {/* Detail */}
              <div className="p-8 space-y-4">
                <h3 className="font-serif text-xl font-medium text-foreground">
                  {c.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {c.description}
                </p>
                <Link
                  href={`/catalog?collection=${c.slug}`}
                  className="inline-flex items-center text-[10px] uppercase tracking-widest text-primary font-bold gap-2 group-hover:text-accent transition-colors duration-300 pt-2"
                >
                  Explore Collection
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

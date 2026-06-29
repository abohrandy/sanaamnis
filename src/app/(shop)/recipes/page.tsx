import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, Clock, Heart } from "lucide-react";

interface Recipe {
  title: string;
  slug: string;
  excerpt: string;
  duration: string;
  difficulty: string;
  imageUrl: string;
}

const MOCK_RECIPES: Recipe[] = [
  {
    title: "The Botanical Hair Moisture Wrap",
    slug: "botanical-hair-wrap",
    excerpt: "Infuse dry scalp locks with raw virgin coconut fats combined with fresh lavender blossoms.",
    duration: "45 Mins",
    difficulty: "Easy",
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600",
  },
  {
    title: "Organic Coconut and Ginger Tonic",
    slug: "coconut-ginger-tonic",
    excerpt: "Sip raw volcanic coconut juices cold-pressed with immunity boosting ginger extracts.",
    duration: "10 Mins",
    difficulty: "Simple",
    imageUrl: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=600",
  },
];

export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-20 w-full space-y-16">
        {/* Header */}
        <div className="max-w-2xl space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">
            Botanical Rituals
          </span>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Sana Amnis Recipes
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Curated wellness instructions blending extra virgin coconut ingredients for glowing hair health, diet enhancement, and body repair.
          </p>
        </div>

        {/* Recipes Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {MOCK_RECIPES.map((r) => (
            <div
              key={r.slug}
              className="group bg-card rounded-2xl overflow-hidden hover:shadow-[0_10px_40px_rgba(53,94,59,0.03)] transition-all duration-300"
            >
              <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                <img
                  src={r.imageUrl}
                  alt={r.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-background/80 backdrop-blur-md rounded-full text-[9px] uppercase tracking-widest text-primary font-bold">
                  {r.difficulty}
                </span>
              </div>

              <div className="p-8 space-y-4">
                <div className="flex gap-4 text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {r.duration}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-medium text-foreground">
                  {r.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {r.excerpt}
                </p>
                <Link
                  href={`/recipes/${r.slug}`}
                  className="inline-flex items-center text-[10px] uppercase tracking-widest text-primary font-bold gap-2 group-hover:text-accent transition-colors duration-300 pt-2"
                >
                  View Steps
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

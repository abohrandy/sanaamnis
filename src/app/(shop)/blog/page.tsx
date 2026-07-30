import React from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

interface Post {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl: string;
}

const MOCK_POSTS: Post[] = [
  {
    title: "The Art of Slow Botanical Extraction",
    slug: "slow-botanical-extraction",
    excerpt: "Why cold processing preserves essential coconut fatty chains better than quick heat treatments.",
    date: "June 24, 2026",
    category: "Craftsmanship",
    imageUrl: "https://images.unsplash.com/photo-1540340561271-9d29158bf3ee?q=80&w=600",
  },
  {
    title: "Organic Coconut Water: Volcanic Soil Hydration",
    slug: "volcanic-soil-hydration",
    excerpt: "Sourcing electrolyte liquids from organic palm trees rooted in mineral-dense soils.",
    date: "May 18, 2026",
    category: "Heritage",
    imageUrl: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=600",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-20 w-full space-y-16">
        {/* Header */}
        <div className="max-w-2xl space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">
            Amnis Journal
          </span>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Botanical Chronicles
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Read expert research on organic skincare formulations, dietary wellness, and heritage sourcing strategies.
          </p>
        </div>

        {/* Blog grid */}
        <div className="grid md:grid-cols-2 gap-12">
          {MOCK_POSTS.map((p) => (
            <article
              key={p.slug}
              className="group space-y-6"
            >
              <div className="relative aspect-[16/10] bg-[#F3EFE8] rounded-2xl overflow-hidden border border-[#E2E6E3]">
                <Image
                  src={p.imageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="space-y-3">
                <div className="flex gap-4 items-center text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                  <span className="text-primary">{p.category}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {p.date}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {p.excerpt}
                </p>

                <Link
                  href={`/blog/${p.slug}`}
                  className="inline-flex items-center text-[10px] uppercase tracking-widest text-primary font-bold gap-2 group-hover:text-accent transition-colors duration-300 pt-2"
                >
                  Read Editorial
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

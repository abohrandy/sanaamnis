import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ArrowRight, Calendar } from "lucide-react";
import { formatDate } from "@/lib/content";
import { getArticles } from "@/lib/blog";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Practical guides to coconut oil, flour and water — how they behave, how to store them, and where our coconuts come from.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const articles = await getArticles();
  const [lead, ...rest] = articles;

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 py-12 md:py-16 space-y-14">
        <Breadcrumbs items={[{ label: "Journal" }]} />

        <header className="max-w-2xl space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-bold">
            Journal
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17] leading-[1.12]">
            Notes on what we make
          </h1>
          <p className="text-sm md:text-base text-[#676E6A] leading-relaxed">
            Straightforward guides — how our oils differ, why coconut flour needs more
            liquid than you expect, and how we source.
          </p>
        </header>

        {lead && (
          <article className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pb-14 border-b border-[#E2E6E3]">
            <Link
              href={`/blog/${lead.slug}`}
              className="lg:col-span-7 relative aspect-[16/10] rounded-[1.5rem] overflow-hidden bg-[#F3EFE8] border border-[#E2E6E3]"
              tabIndex={-1}
              aria-hidden="true"
            >
              <Image
                src={lead.image}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </Link>

            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.16em] text-[#676E6A] font-bold">
                <span className="text-[#C9A227]">{lead.category}</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" aria-hidden="true" />
                  {formatDate(lead.date)}
                </span>
              </div>

              <h2 className="font-serif text-2xl md:text-3xl font-medium text-[#161A17] leading-snug">
                <Link
                  href={`/blog/${lead.slug}`}
                  className="transition-colors hover:text-[#1C3322]"
                >
                  {lead.title}
                </Link>
              </h2>

              <p className="text-sm text-[#676E6A] leading-relaxed">{lead.excerpt}</p>

              <Link
                href={`/blog/${lead.slug}`}
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1C3322] hover:text-[#C9A227] transition-colors pt-1"
              >
                Read article
                <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </article>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {rest.map((post) => (
            <article key={post.slug} className="group relative space-y-4">
              <div className="relative aspect-[16/10] rounded-[1.25rem] overflow-hidden bg-[#F3EFE8] border border-[#E2E6E3]">
                <Image
                  src={post.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.16em] text-[#676E6A] font-bold">
                <span className="text-[#C9A227]">{post.category}</span>
                <span>{post.readingMinutes} min read</span>
              </div>

              <h2 className="font-serif text-xl font-medium text-[#161A17] leading-snug">
                <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-[#1C3322]">
                  <span className="absolute inset-0 z-10" aria-hidden="true" />
                  {post.title}
                </Link>
              </h2>

              <p className="text-xs text-[#676E6A] leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

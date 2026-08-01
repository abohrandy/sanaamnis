import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { ARTICLES, formatDate } from "@/lib/content";
import { getArticle, getArticles } from "@/lib/blog";

export const revalidate = 300;

// Pre-renders the articles known at build time (the content.ts fallback list);
// anything created afterward in the admin still renders correctly on first
// request via Next's on-demand dynamicParams (default true), it just isn't
// pre-built. Falls back to the static list if the database is unreachable at
// build time, same as every other DB-first module in this codebase.
export async function generateStaticParams() {
  try {
    const articles = await getArticles();
    return articles.map((article) => ({ slug: article.slug }));
  } catch {
    return ARTICLES.map((article) => ({ slug: article.slug }));
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article not found" };

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      title: `${article.title} | Sana Amnis`,
      description: article.excerpt,
      images: [{ url: article.image }],
      type: "article",
      publishedTime: article.date,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article, allArticles] = await Promise.all([getArticle(slug), getArticles()]);

  if (!article) notFound();

  const more = allArticles.filter((a) => a.slug !== article.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.date,
    author: { "@type": "Organization", name: "Sana Amnis" },
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-grow w-full">
        <div className="max-w-[840px] mx-auto px-4 md:px-8 py-12 md:py-16 space-y-10">
          <Breadcrumbs
            items={[{ label: "Journal", href: "/blog" }, { label: article.title }]}
          />

          <header className="space-y-5">
            <Badge variant="gold">{article.category}</Badge>
            <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17] leading-[1.15]">
              {article.title}
            </h1>
            <div className="flex items-center gap-5 text-[11px] uppercase tracking-[0.14em] text-[#676E6A] font-semibold">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                {formatDate(article.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                {article.readingMinutes} min read
              </span>
            </div>
          </header>

          <div className="relative aspect-[16/9] rounded-[1.5rem] overflow-hidden bg-[#F3EFE8] border border-[#E2E6E3] shadow-ambient-md">
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              sizes="840px"
              className="object-cover"
            />
          </div>

          <div className="prose-content space-y-8 max-w-[680px]">
            {article.body.map((section, i) => (
              <section key={section.heading ?? i} className="space-y-4">
                {section.heading && (
                  <h2 className="font-serif text-xl md:text-2xl font-medium text-[#1C3322] pt-2">
                    {section.heading}
                  </h2>
                )}
                {section.paragraphs.map((paragraph, j) => (
                  <p
                    key={j}
                    className="text-[15px] md:text-base text-[#161A17]/80 leading-[1.85]"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <div className="pt-6 border-t border-[#E2E6E3]">
            <Link
              href="/blog"
              className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1C3322] hover:text-[#C9A227] transition-colors"
            >
              ← All articles
            </Link>
          </div>
        </div>

        {more.length > 0 && (
          <section className="bg-[#F3EFE8]/50 border-t border-[#E2E6E3] py-14">
            <div className="max-w-[1100px] mx-auto px-4 md:px-8 space-y-8">
              <h2 className="font-serif text-2xl font-medium text-[#1C3322]">
                More from the journal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {more.map((post) => (
                  <article key={post.slug} className="group relative space-y-3">
                    <div className="relative aspect-[16/10] rounded-[1.25rem] overflow-hidden bg-[#F3EFE8] border border-[#E2E6E3]">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-serif text-base font-medium text-[#161A17] leading-snug">
                      <Link href={`/blog/${post.slug}`} className="hover:text-[#1C3322] transition-colors">
                        <span className="absolute inset-0 z-10" aria-hidden="true" />
                        {post.title}
                      </Link>
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1C3322] group-hover:text-[#C9A227] transition-colors">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

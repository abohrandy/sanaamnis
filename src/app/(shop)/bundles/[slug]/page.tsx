import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { AddBundleToCartButton } from "@/components/shop/AddBundleToCartButton";
import { BundleHeroImage } from "@/components/shop/BundleHeroImage";
import { getBundle, getBundles, BUNDLES } from "@/lib/bundles";

export const revalidate = 300;

const naira = (value: number) => `₦${Math.round(value).toLocaleString("en-NG")}`;

// Pre-render every bundle at build time, same reasoning as
// src/app/(shop)/products/[slug]/page.tsx — bundles are high-intent pages.
export async function generateStaticParams() {
  try {
    const bundles = await getBundles();
    return bundles.map((b) => ({ slug: b.slug }));
  } catch {
    return BUNDLES.map((b) => ({ slug: b.slug }));
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getBundle(slug);
  if (!bundle) return { title: "Bundle not found" };

  return {
    title: bundle.title,
    description: bundle.tagline,
    alternates: { canonical: `/bundles/${bundle.slug}` },
    openGraph: {
      title: `${bundle.title} | Sana Amnis`,
      description: bundle.tagline,
      images: [{ url: bundle.heroImageUrl }],
      type: "website",
    },
  };
}

export default async function BundleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bundle = await getBundle(slug);

  if (!bundle) notFound();

  const savings =
    bundle.regularValue && bundle.regularValue > bundle.price ? bundle.regularValue - bundle.price : null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-grow w-full max-w-[1100px] mx-auto px-4 md:px-8 py-12 md:py-16 space-y-14">
        <Breadcrumbs items={[{ label: "Bundles", href: "/bundles" }, { label: bundle.title }]} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-6">
            <BundleHeroImage src={bundle.heroImageUrl} alt={bundle.title} />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <Badge variant="gold">Bundle</Badge>
            <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17] leading-[1.12]">
              {bundle.title}
            </h1>
            <p className="text-sm md:text-base text-[#676E6A] leading-relaxed">{bundle.tagline}</p>

            <div className="flex items-baseline gap-3 py-5 border-y border-[#E2E6E3]">
              <span className="font-serif text-3xl font-bold text-[#1C3322]">{naira(bundle.price)}</span>
              {bundle.regularValue && (
                <span className="text-sm text-[#676E6A] line-through">{naira(bundle.regularValue)}</span>
              )}
              {savings && (
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9A227] bg-[#C9A227]/10 px-2.5 py-1 rounded-full">
                  Save {naira(savings)}
                </span>
              )}
            </div>

            <AddBundleToCartButton bundle={bundle} />

            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A227] block">
                What&apos;s inside
              </span>
              <ul className="space-y-2.5">
                {bundle.items.map((item) => (
                  <li key={item.variantId} className="flex items-center justify-between gap-3 text-sm">
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="text-[#161A17] hover:text-[#1C3322] transition-colors"
                    >
                      {item.quantity} × {item.productTitle} ({item.variantName})
                    </Link>
                    <span className="text-xs text-[#676E6A] shrink-0">{naira(item.unitPrice * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {bundle.description && (
          <section className="max-w-[720px] space-y-4 text-sm md:text-base text-[#161A17]/80 leading-[1.85]">
            {bundle.description.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        )}

        <div className="pt-6 border-t border-[#E2E6E3]">
          <Link
            href="/bundles"
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1C3322] hover:text-[#C9A227] transition-colors"
          >
            ← All bundles
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

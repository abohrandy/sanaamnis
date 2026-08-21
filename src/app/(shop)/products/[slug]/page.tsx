import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductDetailClient from "@/components/shop/ProductDetailClient";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CATALOG, categoryOrFallback } from "@/lib/catalog";
import { getProduct, getRelatedProducts, getReviews } from "@/lib/products";

export const revalidate = 300;

/**
 * Pre-render every product at build time.
 *
 * Beyond the obvious speed win this keeps product pages on the same static path
 * as the rest of the storefront; they are the highest-intent pages on the site and
 * should never depend on a database round trip to render.
 */
export function generateStaticParams() {
  return CATALOG.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  const description = product.tagline || product.description.slice(0, 160);

  return {
    title: product.title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.title} | Sana Amnis`,
      description,
      type: "website",
      url: `/products/${product.slug}`,
      images: [{ url: product.images[0], width: 1600, height: 2000, alt: product.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Sana Amnis`,
      description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  // Previously an unknown slug invented a placeholder product priced at ₦120,000.
  if (!product) {
    notFound();
  }

  const [related, reviews] = await Promise.all([
    getRelatedProducts(product),
    getReviews(product.id),
  ]);
  const category = categoryOrFallback(product.categorySlug);

  // Rich result data, so the listing carries price and availability in search.
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: "Sana Amnis" },
    category: category.name,
    offers: product.variants.map((variant) => ({
      "@type": "Offer",
      sku: variant.sku,
      name: variant.name,
      price: variant.price,
      priceCurrency: "NGN",
      availability:
        variant.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `/products/${product.slug}`,
    })),
  };

  const faqJsonLd =
    product.faqs && product.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: product.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }
      : null;

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#FAF8F5]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 pt-8">
          <Breadcrumbs
            items={[
              { label: "Shop", href: "/shop" },
              { label: category.name, href: `/shop?category=${category.slug}` },
              { label: product.title },
            ]}
          />
        </div>

        <ProductDetailClient
          product={product}
          categoryName={category.name}
          related={related}
          reviews={reviews}
        />
      </main>
      <Footer />

      <script
        type="application/ld+json"
        // Server-rendered from our own catalog, never from user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </>
  );
}

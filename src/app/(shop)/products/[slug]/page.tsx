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

/** ISO 3166-2:NG codes for every state and the FCT except Lagos (LA), which has its own rate. */
const OTHER_STATE_CODES = [
  "AB", "AD", "AK", "AN", "BA", "BY", "BE", "BO", "CR", "DE", "EB", "ED", "EK", "EN",
  "FC", "GO", "IM", "JI", "KD", "KN", "KT", "KE", "KO", "KW", "NA", "NI", "OG", "ON",
  "OS", "OY", "PL", "RI", "SO", "TA", "YO", "ZA",
];

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

  // Mirrors /shipping and /returns; keep in step with those pages.
  const deliveryTime = {
    "@type": "ShippingDeliveryTime",
    handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
    transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 5, unitCode: "DAY" },
  };
  const shippingDetails = [
    {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: 2500, currency: "NGN" },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "NG",
        addressRegion: "LA",
      },
      deliveryTime,
    },
    {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: 5000, currency: "NGN" },
      shippingDestination: OTHER_STATE_CODES.map((addressRegion) => ({
        "@type": "DefinedRegion",
        addressCountry: "NG",
        addressRegion,
      })),
      deliveryTime,
    },
  ];
  const returnPolicy = {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "NG",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 14,
    url: "https://sanaamniscoconut.com/returns",
  };

  // Only genuine, published reviews are marked up; never invent a rating.
  const ratedReviews = [
    ...reviews.map((r) => ({ author: r.author, rating: r.rating, comment: r.comment })),
    ...(product.structuredReviews ?? []).map((r) => ({
      author: r.author,
      rating: r.rating,
      comment: r.text,
    })),
  ].filter((r) => r.rating >= 1 && r.rating <= 5);
  const reviewJsonLd =
    ratedReviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue:
              Math.round(
                (ratedReviews.reduce((sum, r) => sum + r.rating, 0) / ratedReviews.length) * 10
              ) / 10,
            reviewCount: ratedReviews.length,
            bestRating: 5,
            worstRating: 1,
          },
          review: ratedReviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author },
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
            ...(r.comment ? { reviewBody: r.comment } : {}),
          })),
        }
      : {};

  // Rich result data, so the listing carries price and availability in search.
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: "Sana Amnis" },
    category: category.name,
    ...reviewJsonLd,
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
      url: `https://sanaamniscoconut.com/products/${product.slug}`,
      shippingDetails,
      hasMerchantReturnPolicy: returnPolicy,
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

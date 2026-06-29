import React from "react";
import Header from "@/components/layout/Header";
import ProductDetailClient from "@/components/shop/ProductDetailClient";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";

// Fallback high-end product definition if DB is empty
const MOCK_DETAILS: Record<string, any> = {
  "amnis-cashmere-overcoat": {
    id: "1",
    title: "Amnis Cashmere Overcoat",
    slug: "amnis-cashmere-overcoat",
    description: "Indulge in unparalleled warmth and sophistication. Our cashmere coat features structural precision cutting, premium hand-sewn linings, and deep internal pockets. Crafted responsibly from eco-sourced Mongolian cashmere yarns.",
    category: "Coats",
    variants: [
      { id: "v1-m", sku: "AM-CASH-OCT-M", name: "Medium / Camel", price: "185000", stock: 8, imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600" },
      { id: "v1-l", sku: "AM-CASH-OCT-L", name: "Large / Camel", price: "185000", stock: 4, imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600" },
    ],
  },
  "linen-minimalist-kimono": {
    id: "2",
    title: "Linen Minimalist Kimono",
    slug: "linen-minimalist-kimono",
    description: "Relaxed-fit unstructured kimono coat. Breathable organic flax linen tailored with raw hems, wide sleeves, and matching tie-belts. Essential layering piece for mild seasonal shifts.",
    category: "Outerwear",
    variants: [
      { id: "v2-one", sku: "AM-LIN-KMN-OS", name: "One Size / Ivory", price: "95000", stock: 12, imageUrl: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=600" },
    ],
  },
};

export const revalidate = 60; // ISR validation time

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product: any = MOCK_DETAILS[slug];

  try {
    const productInDb = await db.query.products.findFirst({
      where: (products, { eq }) => eq(products.slug, slug),
      with: {
        category: true,
        variants: true,
      },
    });

    if (productInDb) {
      product = {
        id: productInDb.id,
        title: productInDb.title,
        slug: productInDb.slug,
        description: productInDb.description,
        category: productInDb.category?.name || "Uncategorized",
        variants: productInDb.variants || [],
      };
    }
  } catch (err) {
    console.error("DB query failed in product page, falling back to mock:", err);
  }

  // If no DB product and slug doesn't exist in mock details, return a mock product dynamically or 404
  if (!product) {
    product = {
      id: "dynamic-mock",
      title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      slug,
      description: "This is a premium tailored Sana Amnis product collection piece. Seamlessly tailored with high attention to detail.",
      category: "Exclusive",
      variants: [
        { id: "v-dyn", sku: `AM-DYN-${slug.toUpperCase()}`, name: "One Size", price: "120000", stock: 5, imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600" }
      ]
    };
  }

  const primaryImage = product.variants?.[0]?.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600";

  return (
    <>
      <Header />
      <main className="flex-1 bg-background py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="text-[10px] uppercase tracking-widest text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground">Home</Link> &nbsp;/&nbsp;&nbsp;
            <Link href="/catalog" className="hover:text-foreground">Catalog</Link> &nbsp;/&nbsp;&nbsp;
            <span className="text-foreground">{product.title}</span>
          </nav>

          <ProductDetailClient product={product} />
        </div>
      </main>
      <Footer />
    </>
  );
}

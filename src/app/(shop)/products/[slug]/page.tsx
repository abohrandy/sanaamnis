import React from "react";
import Header from "@/components/layout/Header";
import ProductDetailClient from "@/components/shop/ProductDetailClient";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";

// Fallback high-end product definition if DB is empty
const MOCK_DETAILS: Record<string, any> = {
  "extra-virgin-coconut-oil": {
    id: "1",
    title: "Extra Virgin Coconut Oil",
    slug: "extra-virgin-coconut-oil",
    description: "Cold-pressed organic extra virgin coconut oil extracted from fresh coconut milk. Rich in medium-chain fatty acids (Lauric Acid) to nourish skin, condition hair, and enhance wellness.",
    category: "Organic Wellness",
    variants: [
      { id: "v1-250", sku: "SA-COCO-OIL-250", name: "250ml Pouch", price: "15000", stock: 50, imageUrl: "https://drive.google.com/thumbnail?id=1cRxBW7bAXR5Alft8iGGt5AVugXPRusMY&sz=w1000" },
      { id: "v1-500", sku: "SA-COCO-OIL-500", name: "500ml Glass Bottle", price: "28000", stock: 30, imageUrl: "https://drive.google.com/thumbnail?id=19MfciPsk515kPomAxziUo3PT_x_-y6K_&sz=w1000" },
    ],
  },
  "sana-amnis-coconut-water": {
    id: "2",
    title: "Organic Coconut Water",
    slug: "sana-amnis-coconut-water",
    description: "100% pure bioactive coconut water harvested at peak freshness. Hydrates naturally with potassium, magnesium, and essential coconut electrolytes with zero added sugars.",
    category: "Organic Wellness",
    variants: [
      { id: "v2-330", sku: "SA-COCO-WTR-330", name: "500ml Bottle Pack", price: "4500", stock: 120, imageUrl: "https://drive.google.com/thumbnail?id=1Z9Yf9iquA-YUp0eGmrcM7xr411520Qgp&sz=w1000" },
      { id: "v2-250", sku: "SA-COCO-WTR-250", name: "250ml Pouch Pack", price: "3000", stock: 150, imageUrl: "https://drive.google.com/thumbnail?id=19MfciPsk515kPomAxziUo3PT_x_-y6K_&sz=w1000" },
    ],
  },
  "pure-coconut-milk-powder": {
    id: "3",
    title: "Pure Coconut Milk Powder",
    slug: "pure-coconut-milk-powder",
    description: "Spray-dried premium coconut milk powder from raw organic coconuts. Instant, rich, and creamy for smoothies, curries, baking, and wellness drinks.",
    category: "Organic Wellness",
    variants: [
      { id: "v3-250", sku: "SA-MILK-PWD-250", name: "250g Pouch", price: "8500", stock: 80, imageUrl: "https://drive.google.com/thumbnail?id=11VjXF_JnUyd9JX6FIqcfMSkF4D5POY4M&sz=w1000" },
    ],
  },
  "coconut-body-butter": {
    id: "4",
    title: "Nourishing Coconut Body Butter",
    slug: "coconut-body-butter",
    description: "Deeply moisturizing body cream crafted with raw coconut lipids, unrefined shea butter, and vitamin E. Restores skin elasticity and provides long-lasting velvety moisture.",
    category: "Premium Skincare",
    variants: [
      { id: "v4-200", sku: "SA-COCO-BTR-200", name: "200g Jar", price: "18000", stock: 40, imageUrl: "https://drive.google.com/thumbnail?id=1Xcc9CmWFaAEvsU4ovWMHKYkEiEhzN0cr&sz=w1000" },
    ],
  },
  "restorative-coconut-hair-mask": {
    id: "5",
    title: "Restorative Coconut Hair Mask",
    slug: "restorative-coconut-hair-mask",
    description: "Intensive deep conditioning treatment enriched with raw coconut oil and natural botanicals to strengthen follicles, reduce split ends, and impart brilliant shine.",
    category: "Hair & Body",
    variants: [
      { id: "v5-250", sku: "SA-HAIR-MSK-250", name: "250ml Jar", price: "14000", stock: 35, imageUrl: "https://drive.google.com/thumbnail?id=1--CLF51noixdnvV8HhLmosvtP75RDlRE&sz=w1000" },
    ],
  },
  "coconut-sugar-scrub": {
    id: "6",
    title: "Exfoliating Coconut Sugar Scrub",
    slug: "coconut-sugar-scrub",
    description: "Gentle exfoliating body polish combining unrefined organic coconut sugar crystals with virgin coconut oil to buff away dead cells and reveal smooth skin.",
    category: "Premium Skincare",
    variants: [
      { id: "v6-200", sku: "SA-SGR-SCR-200", name: "200g Glass Jar", price: "12500", stock: 45, imageUrl: "https://drive.google.com/thumbnail?id=1kfVkQ-lqEpTKfvtl_WT-zwa28NeEOO1n&sz=w1000" },
    ],
  },
  "organic-coconut-chips": {
    id: "7",
    title: "Toasted Organic Coconut Chips",
    slug: "organic-coconut-chips",
    description: "Crispy, golden-toasted coconut flakes lightly seasoned with sea salt. Clean gourmet snacking packed with dietary fiber and healthy natural fats.",
    category: "Gourmet Snacks",
    variants: [
      { id: "v7-100", sku: "SA-CHIP-SNK-100", name: "100g Snack Pack", price: "3500", stock: 100, imageUrl: "https://drive.google.com/thumbnail?id=16WhogTSxDzbjaVewUFprCCPbN_mfhPxg&sz=w1000" },
    ],
  },
  "raw-coconut-flour": {
    id: "8",
    title: "Raw Organic Coconut Flour",
    slug: "raw-coconut-flour",
    description: "High-fiber, gluten-free baking flour finely ground from organic coconut meat. Ideal for keto, paleo, and healthy gluten-free baking recipes.",
    category: "Culinary Essentials",
    variants: [
      { id: "v8-500", sku: "SA-COCO-FLR-500", name: "500g Pack", price: "6000", stock: 75, imageUrl: "https://drive.google.com/thumbnail?id=1hk33UKAflm0EIoFg_sGRzbQ3jSZsPLUp&sz=w1000" },
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

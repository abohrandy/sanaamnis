import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ShopClient, ProductItem } from "@/components/shop/ShopClient";
import { db } from "@/db";

const MOCK_PRODUCTS: ProductItem[] = [
  {
    id: "1",
    title: "Extra Virgin Coconut Oil",
    slug: "extra-virgin-coconut-oil",
    category: "Organic Wellness",
    price: 15000,
    imageUrl: "https://drive.google.com/thumbnail?id=1cRxBW7bAXR5Alft8iGGt5AVugXPRusMY&sz=w1000",
  },
  {
    id: "2",
    title: "Sana Amnis Coconut Water",
    slug: "sana-amnis-coconut-water",
    category: "Organic Wellness",
    price: 4500,
    imageUrl: "https://drive.google.com/thumbnail?id=1Z9Yf9iquA-YUp0eGmrcM7xr411520Qgp&sz=w1000",
  },
  {
    id: "3",
    title: "Pure Coconut Milk Powder",
    slug: "pure-coconut-milk-powder",
    category: "Organic Wellness",
    price: 8500,
    imageUrl: "https://drive.google.com/thumbnail?id=11VjXF_JnUyd9JX6FIqcfMSkF4D5POY4M&sz=w1000",
  },
  {
    id: "4",
    title: "Nourishing Coconut Body Butter",
    slug: "coconut-body-butter",
    category: "Premium Skincare",
    price: 18000,
    imageUrl: "https://drive.google.com/thumbnail?id=1Xcc9CmWFaAEvsU4ovWMHKYkEiEhzN0cr&sz=w1000",
  },
  {
    id: "5",
    title: "Restorative Coconut Hair Mask",
    slug: "restorative-coconut-hair-mask",
    category: "Hair & Body",
    price: 14000,
    imageUrl: "https://drive.google.com/thumbnail?id=1--CLF51noixdnvV8HhLmosvtP75RDlRE&sz=w1000",
  },
  {
    id: "6",
    title: "Exfoliating Coconut Sugar Scrub",
    slug: "coconut-sugar-scrub",
    category: "Premium Skincare",
    price: 12500,
    imageUrl: "https://drive.google.com/thumbnail?id=1kfVkQ-lqEpTKfvtl_WT-zwa28NeEOO1n&sz=w1000",
  },
  {
    id: "7",
    title: "Toasted Organic Coconut Chips",
    slug: "organic-coconut-chips",
    category: "Gourmet Snacks",
    price: 3500,
    imageUrl: "https://drive.google.com/thumbnail?id=16WhogTSxDzbjaVewUFprCCPbN_mfhPxg&sz=w1000",
  },
  {
    id: "8",
    title: "Raw Organic Coconut Flour",
    slug: "raw-coconut-flour",
    category: "Culinary Essentials",
    price: 6000,
    imageUrl: "https://drive.google.com/thumbnail?id=1hk33UKAflm0EIoFg_sGRzbQ3jSZsPLUp&sz=w1000",
  },
];

const MOCK_CATEGORIES = [
  { id: "Organic Wellness", name: "Organic Wellness", count: 3 },
  { id: "Premium Skincare", name: "Premium Skincare", count: 2 },
  { id: "Hair & Body", name: "Hair & Body", count: 1 },
  { id: "Gourmet Snacks", name: "Gourmet Snacks", count: 1 },
  { id: "Culinary Essentials", name: "Culinary Essentials", count: 1 },
];

export const revalidate = 60;

export default async function ShopPage() {
  let displayProducts: ProductItem[] = MOCK_PRODUCTS;
  let categories: Array<{ id: string; name: string; count?: number }> = MOCK_CATEGORIES;


  try {
    const dbCategories = await db.query.categories.findMany();
    if (dbCategories && dbCategories.length > 0) {
      categories = dbCategories.map((c) => ({
        id: c.id,
        name: c.name,
      }));
    }


    const dbProducts = await db.query.products.findMany({
      where: (products, { eq }) => eq(products.isActive, true),
      with: {
        category: true,
        variants: true,
      },
    });

    if (dbProducts && dbProducts.length > 0) {
      displayProducts = dbProducts.map((p) => {
        const firstVariantPrice = Number(p.variants?.[0]?.price) || 0;
        const firstVariantImage = p.variants?.[0]?.imageUrl || "";
        return {
          id: p.id,
          title: p.title,
          slug: p.slug,
          category: p.category ? { id: p.category.id, name: p.category.name } : "Organic Wellness",
          price: firstVariantPrice,
          imageUrl: firstVariantImage || "https://images.unsplash.com/photo-1525385133336-25484cd6c648?q=80&w=600",
          description: p.description || "",
          variants: p.variants?.map((v) => ({
            id: v.id,
            name: v.name,
            price: Number(v.price) || 0,
            stock: v.stock || 0,
          })),
        };
      });
    }
  } catch (err) {
    console.error("DB query failed in shop page, falling back to mock products:", err);
  }

  return (
    <>
      <Header />
      <main className="flex-grow bg-[#FAF8F5]">
        <ShopClient initialProducts={displayProducts} categories={categories} />
      </main>
      <Footer />
    </>
  );
}


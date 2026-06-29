import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BlockRenderer } from "@/components/cms/BlockRenderer";
import { db } from "@/db";

export const revalidate = 60; // ISR validation time

// Predefined mock blocks to render on home page if database hasn't been populated
const MOCK_HOME_BLOCKS = [
  {
    id: "block-1",
    blockType: "hero",
    properties: {
      title: "Sana Amnis Luxury",
      subtitle: "The Summer Collection 2026",
      backgroundImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600",
      ctaText: "Discover Now",
      ctaUrl: "/catalog",
    },
  },
  {
    id: "block-2",
    blockType: "rich_text",
    properties: {
      title: "Sustainable Elegance",
      content: "We believe in a slow approach to fashion. Each Sana Amnis piece is crafted using organic fibers, fair trade cashmere, and state-of-the-art weaving technologies. Our design guidelines center on structural geometry, premium fabrics, and timeless, neutral palettes.",
      alignment: "center",
    },
  },
  {
    id: "block-3",
    blockType: "featured_products",
    properties: {
      title: "Season Favorites",
      products: [
        {
          id: "1",
          title: "Amnis Cashmere Overcoat",
          slug: "amnis-cashmere-overcoat",
          category: "Coats",
          price: "185,000",
          imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600",
        },
        {
          id: "2",
          title: "Linen Minimalist Kimono",
          slug: "linen-minimalist-kimono",
          category: "Outerwear",
          price: "95,000",
          imageUrl: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=600",
        },
        {
          id: "3",
          title: "Silk Ribbed Turtleneck",
          slug: "silk-ribbed-turtleneck",
          category: "Knitwear",
          price: "68,000",
          imageUrl: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=600",
        },
        {
          id: "4",
          title: "Eco-Wool Pleated Trouser",
          slug: "eco-wool-pleated-trouser",
          category: "Trousers",
          price: "82,000",
          imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600",
        },
      ],
    },
  },
];

export default async function Home() {
  let blocks: any[] = MOCK_HOME_BLOCKS;

  try {
    const pageInDb = await db.query.pages.findFirst({
      where: (pages, { eq }) => eq(pages.slug, "home"),
      with: {
        blocks: {
          orderBy: (blocks, { asc }) => asc(blocks.sortOrder),
        },
      },
    });

    if (pageInDb && pageInDb.blocks && pageInDb.blocks.length > 0) {
      blocks = pageInDb.blocks.map((b) => ({
        id: b.id,
        blockType: b.blockType,
        properties: b.properties,
      }));
    }
  } catch (err) {
    console.error("DB query failed in homepage, falling back to mock blocks:", err);
  }

  return (
    <>
      <Header />
      <main className="flex-1 w-full">
        {blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            blockType={block.blockType}
            properties={block.properties}
          />
        ))}
      </main>
      <Footer />
    </>
  );
}

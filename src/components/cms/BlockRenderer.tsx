"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

interface BlockProps {
  properties: any;
}

export function HeroBlock({ properties }: BlockProps) {
  const { title, subtitle, backgroundImage, ctaText, ctaUrl } = properties || {};
  return (
    <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax / Scale */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={backgroundImage}
            alt={title || "Sana Amnis Luxury"}
            className="w-full h-full object-cover scale-105 filter brightness-75 transition-all duration-1000"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-b from-neutral-800 to-neutral-950" />
        )}
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs uppercase tracking-[0.3em] text-amber-300 font-medium mb-4"
        >
          {subtitle || "Premium Collection"}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8"
        >
          {title || "Sana Amnis"}
        </motion.h1>
        {ctaText && ctaUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-sm font-semibold rounded-none tracking-widest uppercase hover:bg-primary/90 transition-all duration-300 shadow-xl"
            >
              {ctaText}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export function EditorialTextBlock({ properties }: BlockProps) {
  const { title, content, alignment = "center" } = properties || {};
  const alignClass = alignment === "left" ? "text-left" : alignment === "right" ? "text-right" : "text-center";

  return (
    <section className="py-20 px-6 max-w-3xl mx-auto">
      <div className={alignClass}>
        {title && (
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-6 text-foreground tracking-tight">
            {title}
          </h2>
        )}
        {content && (
          <p className="text-muted-foreground leading-relaxed font-sans text-lg whitespace-pre-line">
            {content}
          </p>
        )}
      </div>
    </section>
  );
}

export function FeaturedProductsBlock({ properties }: BlockProps) {
  const { title, productIds = [], products = [] } = properties || {};

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span className="text-xs uppercase tracking-widest text-primary font-bold">Curated Selection</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mt-2 text-foreground">
            {title || "Featured Additions"}
          </h2>
        </div>
        <Link href="/shop" className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-2 mt-4 md:mt-0">
          Browse Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.length > 0 ? (
          products.map((prod: any, idx: number) => (
            <motion.div
              key={prod.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group flex flex-col border border-border/40 overflow-hidden bg-card transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={prod.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600"}
                  alt={prod.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{prod.category}</span>
                <h3 className="font-sans font-medium text-foreground text-base mb-2 group-hover:text-primary transition-colors">
                  {prod.title}
                </h3>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/20">
                  <span className="font-serif font-semibold text-primary">₦{prod.price}</span>
                  <Link href={`/products/${prod.slug}`} className="p-2 hover:bg-accent rounded-full transition-colors">
                    <ShoppingBag className="w-4 h-4 text-foreground" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No products defined for this showcase.
          </div>
        )}
      </div>
    </section>
  );
}

const componentMap: Record<string, React.ComponentType<BlockProps>> = {
  hero: HeroBlock,
  rich_text: EditorialTextBlock,
  featured_products: FeaturedProductsBlock,
};

export function BlockRenderer({ blockType, properties }: { blockType: string; properties: any }) {
  const Component = componentMap[blockType];
  if (!Component) {
    return (
      <div className="p-6 border border-dashed border-red-200 text-red-500 rounded text-center">
        Block type &quot;{blockType}&quot; is not registered.
      </div>
    );
  }
  return <Component properties={properties} />;
}

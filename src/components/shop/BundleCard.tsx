"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { formatNaira } from "@/lib/catalog";
import type { Bundle } from "@/lib/bundles";

export interface BundleCardProps {
  bundle: Bundle;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/** Grid card for a bundle, styled to match ProductCard so the two mix in the same shop grid. */
export function BundleCard({
  bundle,
  className,
  priority = false,
  sizes = "(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 320px",
}: BundleCardProps) {
  const reduceMotion = useReducedMotion();
  const savings =
    bundle.regularValue && bundle.regularValue > bundle.price
      ? bundle.regularValue - bundle.price
      : null;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col rounded-[1.25rem] border border-[#E2E6E3] overflow-hidden bg-[#FAF8F5] transition-all duration-500 hover:shadow-ambient-md hover-lift-luxury ${className ?? ""}`}
    >
      <div className="absolute top-4 left-4 right-4 z-20 flex items-start justify-between gap-2 pointer-events-none">
        <Badge variant="gold" size="sm" className="shadow-ambient-sm">
          {bundle.badge ?? "Bundle"}
        </Badge>
      </div>

      <Link
        href={`/bundles/${bundle.slug}`}
        className="relative aspect-[4/5] overflow-hidden bg-[#F3EFE8] block"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={bundle.heroImageUrl}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </Link>

      <div className="p-5 md:p-6 flex flex-col flex-1">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#676E6A] font-sans font-semibold mb-1.5">
          Bundle
        </span>

        <h3 className="font-serif font-medium text-[#161A17] text-base md:text-lg leading-snug mb-1">
          <Link
            href={`/bundles/${bundle.slug}`}
            className="transition-colors hover:text-[#1C3322] focus-visible:outline-none focus-visible:underline underline-offset-4"
          >
            <span className="absolute inset-0 z-10" aria-hidden="true" />
            {bundle.title}
          </Link>
        </h3>

        {bundle.tagline && (
          <p className="text-xs text-[#676E6A] font-sans leading-relaxed line-clamp-2 mb-4">
            {bundle.tagline}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-[#E2E6E3]/70 flex items-baseline justify-between gap-2">
          <span className="font-serif font-semibold text-[#1C3322] text-base flex items-baseline gap-1.5">
            {formatNaira(bundle.price)}
            {bundle.regularValue && (
              <span className="text-xs font-sans font-normal text-[#676E6A] line-through">
                {formatNaira(bundle.regularValue)}
              </span>
            )}
          </span>

          {savings && (
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#C9A227] font-bold">
              Save {formatNaira(savings)}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

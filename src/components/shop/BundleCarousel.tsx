"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Bundle } from "@/lib/bundles";

export interface BundleCarouselProps {
  bundles: Bundle[];
}

const naira = (value: number) => `₦${Math.round(value).toLocaleString("en-NG")}`;

export function BundleCarousel({ bundles }: BundleCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * (node.clientWidth * 0.8), behavior: "smooth" });
  };

  if (bundles.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex gap-5 md:gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scroll-px-4 -mx-4 px-4 md:-mx-0 md:px-0"
      >
        {bundles.map((bundle) => {
          const savings =
            bundle.regularValue && bundle.regularValue > bundle.price
              ? bundle.regularValue - bundle.price
              : null;

          return (
            <Link
              key={bundle.id}
              href={`/bundles/${bundle.slug}`}
              className="group shrink-0 w-[280px] md:w-[320px] snap-start rounded-[1.25rem] overflow-hidden border border-[#E2E6E3] bg-[#FAF8F5] shadow-ambient-sm hover-lift-luxury"
            >
              <div className="relative aspect-[4/5] bg-[#F3EFE8] overflow-hidden">
                <Image
                  src={bundle.heroImageUrl}
                  alt={bundle.title}
                  fill
                  sizes="(max-width: 768px) 280px, 320px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                {bundle.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#1C3322] text-[#FAF8F5] text-[9px] font-bold uppercase tracking-[0.14em] shadow-ambient-sm">
                    {bundle.badge}
                  </span>
                )}
              </div>

              <div className="p-5 space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#C9A227]">Bundle</span>
                <h3 className="font-serif text-lg font-medium text-[#161A17] leading-snug line-clamp-2">
                  {bundle.title}
                </h3>
                <p className="text-xs text-[#676E6A] leading-relaxed line-clamp-2">{bundle.tagline}</p>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="font-serif text-xl font-bold text-[#1C3322]">{naira(bundle.price)}</span>
                  {bundle.regularValue && (
                    <span className="text-xs text-[#676E6A] line-through">{naira(bundle.regularValue)}</span>
                  )}
                </div>
                {savings && (
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9A227]">
                    You save {naira(savings)}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {bundles.length > 1 && (
        <div className="hidden md:flex items-center gap-2 justify-end mt-4">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous bundle"
            className="p-2.5 rounded-full border border-[#E2E6E3] text-[#161A17] hover:border-[#1C3322] hover:text-[#1C3322] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next bundle"
            className="p-2.5 rounded-full border border-[#E2E6E3] text-[#161A17] hover:border-[#1C3322] hover:text-[#1C3322] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

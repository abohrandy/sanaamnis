"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ProductHeroGalleryProps {
  images: string[];
  title: string;
  badgeText?: string;
  /** Set on the first product image above the fold so it can be the LCP element. */
  priority?: boolean;
}

export function ProductHeroGallery({
  images,
  title,
  badgeText,
  priority = true,
}: ProductHeroGalleryProps) {
  const gallery = images.length > 0 ? images : ["/products/placeholder.jpg"];

  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeImage = gallery[index] ?? gallery[0];
  const hasMultiple = gallery.length > 1;

  useEffect(() => {
    setIndex(0);
  }, [images]);

  const step = useCallback(
    (delta: number) => setIndex((i) => (i + delta + gallery.length) % gallery.length),
    [gallery.length]
  );

  // Arrow keys page the lightbox; Escape closes it.
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    // Stop the page behind the lightbox from scrolling.
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, step]);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-[#F3EFE8] border border-[#E2E6E3] shadow-ambient-md group">
        <div className="absolute top-4 left-4 right-4 z-20 flex items-start justify-between pointer-events-none">
          {badgeText ? (
            <Badge variant="gold" className="pointer-events-auto shadow-ambient-sm">
              {badgeText}
            </Badge>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="p-2.5 rounded-full glass-alabaster text-[#161A17] hover:text-[#C9A227] transition-colors shadow-ambient-sm cursor-pointer pointer-events-auto"
            aria-label="View image full screen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={activeImage}
              alt={title}
              fill
              // Half the viewport on desktop, full width on mobile.
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority={priority}
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {hasMultiple && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-10 flex justify-between opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="p-2.5 rounded-full glass-alabaster text-[#161A17] hover:text-[#C9A227] shadow-ambient-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="p-2.5 rounded-full glass-alabaster text-[#161A17] hover:text-[#C9A227] shadow-ambient-sm cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {hasMultiple && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {gallery.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View image ${i + 1} of ${gallery.length}`}
              aria-current={i === index}
              className={cn(
                "relative w-20 h-24 rounded-[0.75rem] overflow-hidden bg-[#F3EFE8] border transition-all duration-300 shrink-0 cursor-pointer",
                i === index
                  ? "border-[#1C3322] ring-2 ring-[#1C3322]/20 shadow-ambient-sm"
                  : "border-[#E2E6E3] opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} — enlarged image`}
            className="fixed inset-0 z-50 bg-[#161A17]/92 backdrop-blur-md flex items-center justify-center p-6 cursor-zoom-out"
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#161A17] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="relative w-full max-w-3xl aspect-[4/5] max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeImage}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

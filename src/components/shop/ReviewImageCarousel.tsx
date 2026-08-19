"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface ReviewImageCarouselProps {
  images: string[];
  title: string;
}

/** A horizontally scrollable strip of customer review screenshots, with a full-screen lightbox on click. */
export function ReviewImageCarousel({ images, title }: ReviewImageCarouselProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const step = useCallback(
    (delta: number) =>
      setLightboxIndex((i) => (i === null ? null : (i + delta + images.length) % images.length)),
    [images.length]
  );

  // Arrow keys page the lightbox; Escape closes it.
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, step]);

  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setLightboxIndex(i)}
            aria-label={`Open review screenshot ${i + 1} of ${images.length}`}
            className="relative w-36 md:w-44 aspect-[9/19] rounded-[1rem] overflow-hidden bg-[#F3EFE8] border border-[#E2E6E3] shrink-0 snap-start shadow-ambient-sm hover:shadow-ambient-md transition-shadow cursor-zoom-in"
          >
            <Image
              src={src}
              alt={`${title} customer review ${i + 1}`}
              fill
              sizes="200px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} — customer review screenshot`}
            className="fixed inset-0 z-50 bg-[#161A17]/92 backdrop-blur-md flex items-center justify-center p-6 cursor-zoom-out"
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close"
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#161A17] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Previous review"
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#161A17] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label="Next review"
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#161A17] transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm aspect-[9/19] max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightboxIndex]}
                alt={`${title} customer review ${lightboxIndex + 1}`}
                fill
                sizes="(max-width: 480px) 100vw, 480px"
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

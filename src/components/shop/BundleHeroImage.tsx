"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";

export interface BundleHeroImageProps {
  src: string;
  alt: string;
}

/**
 * Bundle hero images are tall infographic posters (ingredients, storage
 * instructions, pricing) — the aspect-[4/5] object-cover thumbnail crops
 * that content, so clicking through to an uncropped lightbox is the only
 * way to read the whole poster.
 */
export function BundleHeroImage({ src, alt }: BundleHeroImageProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View ${alt} full size`}
        className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-[#F3EFE8] border border-[#E2E6E3] shadow-ambient-md w-full block cursor-zoom-in group"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <span className="absolute top-4 right-4 p-2.5 rounded-full glass-alabaster text-[#161A17] shadow-ambient-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-4 h-4" />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`${alt} — full size`}
            className="fixed inset-0 z-50 bg-[#161A17]/92 backdrop-blur-md flex items-center justify-center p-6 cursor-zoom-out"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#161A17] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="relative w-full max-w-2xl h-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

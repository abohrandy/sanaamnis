"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Rotate3d, Sparkles, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ProductHeroGalleryProps {
  images: string[];
  title: string;
  badgeText?: string;
}

export function ProductHeroGallery({
  images = [],
  title,
  badgeText = "ORGANIC CERTIFIED",
}: ProductHeroGalleryProps) {
  const galleryImages =
    images.length > 0
      ? images
      : ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800"];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [is360Mode, setIs360Mode] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activeImage = galleryImages[selectedImageIndex] || galleryImages[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  return (
    <div className="space-y-4">
      {/* Main Display Container */}
      <div
        className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-[#F3EFE8] border border-[#E2E6E3] shadow-ambient-md group cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoomPos((prev) => ({ ...prev, show: false }))}
      >
        {/* Floating Top Badges & Controls */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <Badge variant="gold" className="pointer-events-auto shadow-ambient-sm">
            {badgeText}
          </Badge>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setIs360Mode(!is360Mode)}
              className={`p-2.5 rounded-full glass-alabaster transition-all duration-300 shadow-ambient-sm cursor-pointer ${
                is360Mode ? "bg-[#1C3322] text-[#FAF8F5]" : "text-[#161A17] hover:text-[#C9A227]"
              }`}
              title="Toggle 360 View"
            >
              <Rotate3d className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="p-2.5 rounded-full glass-alabaster text-[#161A17] hover:text-[#C9A227] transition-all duration-300 shadow-ambient-sm cursor-pointer"
              title="Full Lightbox View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 360 View Interactive Mode */}
        {is360Mode ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#161A17] text-[#FAF8F5] p-6 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 rounded-full border-2 border-dashed border-[#C9A227] flex items-center justify-center mb-4"
            >
              <Rotate3d className="w-8 h-8 text-[#C9A227]" />
            </motion.div>
            <h4 className="font-serif text-lg font-medium text-[#FAF8F5] mb-1">
              360° Interactive Formulation View
            </h4>
            <p className="text-xs text-[#FAF8F5]/70 font-sans max-w-xs leading-relaxed">
              Drag horizontally to inspect bottle angles, seal integrity, and amber UV glass dimensions.
            </p>
          </div>
        ) : (
          /* Normal Image View with Hover Zoom Lens */
          <div className="w-full h-full relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: zoomPos.show ? "scale(2)" : "scale(1)",
              }}
            />
          </div>
        )}
      </div>

      {/* Thumbnail Switcher List */}
      {galleryImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedImageIndex(idx);
                setIs360Mode(false);
              }}
              className={`relative w-20 h-24 rounded-[0.75rem] overflow-hidden bg-[#F3EFE8] border transition-all duration-300 shrink-0 cursor-pointer ${
                selectedImageIndex === idx && !is360Mode
                  ? "border-[#1C3322] ring-2 ring-[#1C3322]/20 shadow-ambient-sm scale-105"
                  : "border-[#E2E6E3] opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`${title} view ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-[#161A17]/90 backdrop-blur-md flex items-center justify-center p-6 cursor-zoom-out"
          >
            <div className="max-w-4xl max-h-[85vh] relative rounded-[1.5rem] overflow-hidden border border-gold-hairline">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeImage} alt={title} className="w-full h-full object-contain" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

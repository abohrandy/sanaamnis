"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  highlightText?: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  bgImage: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    badge: "SINGLE-ORIGIN COASTAL HARVEST",
    title: "The Purest Essence of Nigeria",
    description: "Sustainably harvested cold-pressed extra virgin coconut oil and bioactive hydration formulated for mindful luxury.",
    ctaText: "Explore Catalog",
    ctaLink: "/shop",
    secondaryCtaText: "Read Ethos",
    secondaryCtaLink: "/about",
    bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC07WXtYVjd0cZ9GcvZZNyzIPOmSCd0hhyaAN-9MubRN4TsLY7XXhWir0ekH142Oz3vkrBiUu4feTlSttsylndaVvNfTEnSGqMYHrdwgs0ou6YLOYY0yPPoqqixY_--KWZZupzbKmKGXPr29VfWW_MqJ4Sexb666SbUw2B9MrqbAKT9m0zWefDFTSlb0u2raljI1un8yXbmxuB9GWepc21NMP4Uw_EkYElqw1rjiKZACv-ZT3j4ge1Z1ZQ_FrTo6o9dJTRP-JdT4Q0",
  },
  {
    id: "slide-2",
    badge: "BIO-ACTIVE HYDRATION",
    title: "Raw Electrolytes From Badagry Groves",
    description: "100% natural, refreshing coconut water packed with potassium and essential mineral salts, bottled within 24 hours of harvest.",
    ctaText: "Discover Coconut Water",
    ctaLink: "/shop",
    secondaryCtaText: "Our Sourcing",
    secondaryCtaLink: "/about",
    bgImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1600",
  },
  {
    id: "slide-3",
    badge: "SKIN & FOLLICLE REPAIR",
    title: "Cold-Pressed Lipid Body Sanctuary",
    description: "Rich in lauric fatty acids (C12) and natural vitamin E to restore your skin lipid barrier and nourish hair follicles.",
    ctaText: "Shop Skincare Rituals",
    ctaLink: "/shop",
    secondaryCtaText: "View Recipes",
    secondaryCtaLink: "/recipes",
    bgImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1600",
  },
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoplay]);

  const currentSlide = HERO_SLIDES[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <section className="relative h-[75vh] md:h-[85vh] w-full flex items-center justify-center rounded-[2rem] overflow-hidden shadow-ambient-lg border border-[#E2E6E3]/60 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentSlide.bgImage}
            alt={currentSlide.title}
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C3322]/85 via-[#1C3322]/35 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Slide Content */}
      <div className="relative z-10 text-center text-[#FAF8F5] px-6 max-w-4xl space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id + "-text"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <Badge variant="gold" size="md" className="mx-auto shadow-ambient-sm">
              {currentSlide.badge}
            </Badge>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] text-[#FAF8F5] drop-shadow-md">
              {currentSlide.title}
            </h1>

            <p className="font-sans text-sm md:text-lg max-w-xl mx-auto text-[#FAF8F5]/90 font-light leading-relaxed drop-shadow-sm">
              {currentSlide.description}
            </p>

            <div className="pt-4 flex items-center justify-center gap-4">
              <Link href={currentSlide.ctaLink}>
                <Button variant="gold" size="lg" className="flex items-center gap-2">
                  {currentSlide.ctaText} <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              {currentSlide.secondaryCtaText && (
                <Link href={currentSlide.secondaryCtaLink || "/about"} className="hidden sm:inline-block">
                  <Button variant="alabaster" size="lg">
                    {currentSlide.secondaryCtaText}
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Controls (Previous / Next Arrows) */}
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-20 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          className="p-3 rounded-full glass-alabaster text-[#161A17] hover:text-[#C9A227] transition-all pointer-events-auto cursor-pointer shadow-ambient-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next slide"
          className="p-3 rounded-full glass-alabaster text-[#161A17] hover:text-[#C9A227] transition-all pointer-events-auto cursor-pointer shadow-ambient-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Pagination Dots & Play/Pause */}
      <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-3">
        {HERO_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
              currentIndex === idx
                ? "w-8 bg-[#C9A227]"
                : "w-2 bg-[#FAF8F5]/50 hover:bg-[#FAF8F5]"
            }`}
          />
        ))}

        <button
          onClick={() => setIsAutoplay(!isAutoplay)}
          aria-label={isAutoplay ? "Pause slideshow" : "Play slideshow"}
          className="ml-2 text-[#FAF8F5]/80 hover:text-[#C9A227] transition-colors cursor-pointer"
        >
          {isAutoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronRight, ChevronLeft, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  image: string;
  /** Keeps the product in frame when a portrait shot is cropped to a wide hero. */
  objectPosition?: string;
}

const SLIDE_DURATION = 7000;

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "range",
    eyebrow: "Sana Amnis",
    title: "Naturally Nourishing. Purposefully Made.",
    description:
      "Sana Amnis products are made in Nigeria from Nigerian, home-grown coconuts — coconut water, milk powder, oil, flour, flakes, poundo and body care.",
    ctaText: "Shop the range",
    ctaLink: "/shop",
    secondaryCtaText: "Our story",
    secondaryCtaLink: "/about",
    image: "/products/range-full-dark.jpg",
    objectPosition: "center bottom",
  },
  {
    id: "water",
    eyebrow: "Coconut Water",
    title: "Hydration, straight from the nut",
    description:
      "Drawn from young green coconuts and bottled as it comes. No added sugar, no concentrate, no preservatives.",
    ctaText: "Shop coconut water",
    ctaLink: "/products/sana-amnis-coconut-water",
    secondaryCtaText: "See all drinks",
    secondaryCtaLink: "/shop?category=hydration",
    image: "/products/coconut-water-range.jpg",
    objectPosition: "center bottom",
  },
  {
    id: "oil",
    eyebrow: "Cold-Pressed Coconut Oil",
    title: "Made without heat",
    description:
      "Extracted through a natural fermentation process, so nothing is bleached, deodorised or cooked away.",
    ctaText: "Shop coconut oil",
    ctaLink: "/products/extra-virgin-coconut-oil",
    secondaryCtaText: "How we press",
    secondaryCtaLink: "/about",
    image: "/products/coconut-oil-cold-pressed.jpg",
    objectPosition: "center bottom",
  },
];

export function HeroSlider() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [paused, setPaused] = useState(false);

  const go = useCallback((next: number) => {
    setIndex((next + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Reduced motion means no autoplay at all: an unrequested moving carousel is
  // exactly what that preference is asking us not to do.
  const autoplaying = playing && !paused && !reduceMotion;

  // Keying the timer on `index` restarts it whenever the slide changes, so
  // clicking an arrow gives you a full interval rather than a clipped one.
  useEffect(() => {
    if (!autoplaying) return;
    const timer = window.setTimeout(() => go(index + 1), SLIDE_DURATION);
    return () => window.clearTimeout(timer);
  }, [autoplaying, index, go]);

  const slide = HERO_SLIDES[index];
  const regionRef = useRef<HTMLElement>(null);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(index + 1);
    if (e.key === "ArrowLeft") go(index - 1);
  };

  return (
    <section
      ref={regionRef}
      aria-roledescription="carousel"
      aria-label="Featured products"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative h-[78vh] min-h-[520px] md:h-[86vh] w-full flex items-end rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-ambient-lg border border-[#E2E6E3]/60 group"
    >
      {/* Every slide image is rendered so the browser can decode ahead; only the
          active one is visible. Three images is cheap and removes the flash on
          first advance. */}
      {HERO_SLIDES.map((s, i) => (
        <div
          key={s.id}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-out",
            i === index ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={s.image}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            quality={82}
            className="object-cover"
            style={{ objectPosition: s.objectPosition ?? "center" }}
          />
        </div>
      ))}

      {/* Two-stop scrim: dark enough at the base for text contrast, clear at the
          top so the photography still reads. */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F14]/92 via-[#0F1F14]/55 to-[#0F1F14]/10" />

      <motion.div
        // Swipe on touch; the drag never moves the layout, it only reports direction.
        drag={reduceMotion ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) go(index + 1);
          if (info.offset.x > 60) go(index - 1);
        }}
        className="relative z-10 w-full px-6 md:px-14 lg:px-20 pb-20 md:pb-24 cursor-grab active:cursor-grabbing"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl space-y-5"
          >
            <span className="inline-block text-[10px] md:text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-[#C9A227]">
              {slide.eyebrow}
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] text-[#FAF8F5]">
              {slide.title}
            </h1>

            <p className="font-sans text-sm md:text-base text-[#FAF8F5]/85 leading-relaxed max-w-xl">
              {slide.description}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <Link href={slide.ctaLink}>
                <Button variant="gold" size="lg" className="flex items-center gap-2">
                  {slide.ctaText} <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              {slide.secondaryCtaText && (
                <Link href={slide.secondaryCtaLink || "/about"}>
                  <Button variant="alabaster" size="lg">
                    {slide.secondaryCtaText}
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Announce slide changes for screen readers without moving focus. */}
      <p className="sr-only" aria-live="polite">
        Slide {index + 1} of {HERO_SLIDES.length}: {slide.title}
      </p>

      <div className="hidden md:flex absolute inset-x-5 top-1/2 -translate-y-1/2 z-20 justify-between pointer-events-none opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous slide"
          className="p-3 rounded-full glass-alabaster text-[#161A17] hover:text-[#C9A227] transition-colors pointer-events-auto cursor-pointer shadow-ambient-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next slide"
          className="p-3 rounded-full glass-alabaster text-[#161A17] hover:text-[#C9A227] transition-colors pointer-events-auto cursor-pointer shadow-ambient-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute bottom-6 md:bottom-8 left-6 md:left-14 lg:left-20 z-20 flex items-center gap-3">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show slide ${i + 1}: ${s.title}`}
            aria-current={i === index}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500 cursor-pointer",
              i === index ? "w-10 bg-[#C9A227]" : "w-4 bg-[#FAF8F5]/45 hover:bg-[#FAF8F5]/80"
            )}
          />
        ))}

        {!reduceMotion && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            className="ml-2 p-1.5 text-[#FAF8F5]/75 hover:text-[#C9A227] transition-colors cursor-pointer"
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </section>
  );
}

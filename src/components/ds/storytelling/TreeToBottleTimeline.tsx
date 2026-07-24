"use client";

import React from "react";
import { motion } from "framer-motion";
import { TreePine, Droplet, ShieldCheck, GlassWater, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  {
    step: "01",
    title: "Artisanal Grove Harvesting",
    subtitle: "BADAGRY & EPE COASTAL GROVES",
    description:
      "Hand-selected organic coconuts are harvested at peak maturity by third-generation coastal farming partners. Zero synthetic fertilizers or chemical pesticides are ever used.",
    icon: TreePine,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800",
    detail: "100% Organic Certified",
  },
  {
    step: "02",
    title: "Zero-Heat Cold Pressing",
    subtitle: "WITHIN 24 HOURS OF HARVEST",
    description:
      "Extracted at temperatures strictly below 37°C (98.6°F) to ensure lauric acid, antioxidants, and active enzymes remain completely intact and un-denatured.",
    icon: Droplet,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800",
    detail: "Max 37°C Temperature",
  },
  {
    step: "03",
    title: "Triple Micro-Filtration",
    subtitle: "PURITY & CLARITY TESTING",
    description:
      "Passed through medical-grade cotton and linen filters to remove sediment without chemical bleaching, deodorization, or hydrogenation.",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800",
    detail: "0% Hexane or Solvents",
  },
  {
    step: "04",
    title: "UV-Protected Amber Glass Bottling",
    subtitle: "SUSTAINABLE PACKAGING",
    description:
      "Encased in recyclable pharmaceutical-grade amber glass to block harmful light wavelengths, ensuring long-term shelf stability without artificial preservatives.",
    icon: GlassWater,
    image: "https://images.unsplash.com/photo-1608248597263-00079e96047a?q=80&w=800",
    detail: "100% Recyclable Glass",
  },
];

export function TreeToBottleTimeline() {
  return (
    <section className="py-24 px-6 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <Badge variant="gold" className="mb-3">
            BOTANICAL JOURNEY
          </Badge>
          <h2 className="font-serif text-3xl md:text-5xl font-medium text-[#161A17] mb-4 leading-tight">
            From Tree to Bottle
          </h2>
          <p className="text-xs md:text-sm text-[#676E6A] font-sans leading-relaxed">
            Trace our transparent 4-stage extraction journey from Nigeria’s coastal palms to your daily wellness sanctuary.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="relative space-y-16 md:space-y-24">
          {/* Vertical Connecting Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-0.5 bg-[#E2E6E3] -translate-x-1/2" />

          {STEPS.map((item, index) => {
            const Icon = item.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center ${
                  isEven ? "" : "md:flex-row-reverse"
                }`}
              >
                {/* Text Content */}
                <div
                  className={`md:col-span-5 ${
                    isEven ? "md:text-right md:order-1" : "md:text-left md:order-3"
                  }`}
                >
                  <span className="font-serif text-4xl font-light text-[#C9A227] block mb-2">
                    {item.step}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-bold text-[#676E6A] block mb-1">
                    {item.subtitle}
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl font-medium text-[#161A17] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#676E6A] font-sans leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <Badge variant="botanical">{item.detail}</Badge>
                </div>

                {/* Center Badge Marker (Desktop) */}
                <div className="hidden md:flex md:col-span-2 order-2 justify-center items-center z-10">
                  <div className="w-14 h-14 rounded-full bg-[#1C3322] text-[#FAF8F5] flex items-center justify-center shadow-ambient-md border-4 border-[#FAF8F5]">
                    <Icon className="w-6 h-6 text-[#C9A227]" />
                  </div>
                </div>

                {/* Image Frame */}
                <div
                  className={`md:col-span-5 ${
                    isEven ? "md:order-3" : "md:order-1"
                  }`}
                >
                  <div className="relative aspect-[4/3] rounded-[1.25rem] overflow-hidden border border-[#E2E6E3] shadow-ambient-md group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161A17]/30 to-transparent" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

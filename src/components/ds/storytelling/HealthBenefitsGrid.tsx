"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Droplet, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BENEFITS = [
  {
    icon: Zap,
    title: "Rapid Cellular MCT Bio-Energy",
    badge: "METABOLIC HEALTH",
    description:
      "Packed with Caprylic (C8) and Capric (C10) acids that bypass liver digestion for immediate brain and metabolic energy without glucose spikes.",
  },
  {
    icon: ShieldCheck,
    title: "Immune-Shielding Lauric Acid",
    badge: "52% LAURIC CONTENT",
    description:
      "Contains high levels of Lauric Acid (C12)—the same protective compound found in human mother's milk—supporting gut microbiome balance.",
  },
  {
    icon: Droplet,
    title: "Deep Lipid Barrier Hydration",
    badge: "DERMATOLOGY APPROVED",
    description:
      "Small molecular structure easily penetrates skin layers, restoring natural lipid moisture barriers without clogging pores or leaving greasy residue.",
  },
  {
    icon: Sparkles,
    title: "Potent Polyphenol Antioxidants",
    badge: "ZERO OXIDATION",
    description:
      "Cold-pressed zero-heat extraction retains natural Vitamin E and polyphenol compounds that neutralize free radicals and environmental stress.",
  },
];

export function HealthBenefitsGrid() {
  return (
    <section className="py-24 px-6 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="gold" className="mb-3">
            SCIENCE & VITALITY
          </Badge>
          <h2 className="font-serif text-3xl md:text-5xl font-medium text-[#161A17] mb-4 leading-tight">
            Bio-Active Health Benefits
          </h2>
          <p className="text-xs md:text-sm text-[#676E6A] font-sans leading-relaxed">
            Every drop delivers raw, unrefined coconut lipid nutrients engineered by nature to nourish mind, body, and skin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((b, idx) => {
            const Icon = b.icon;

            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-[1.25rem] bg-[#F3EFE8] border border-[#E2E6E3] flex flex-col justify-between hover-lift-luxury group transition-all duration-300"
              >
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#1C3322] text-[#FAF8F5] flex items-center justify-center mb-6 shadow-ambient-sm group-hover:bg-[#C9A227] transition-colors">
                    <Icon className="w-5 h-5 text-[#FAF8F5]" />
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.22em] font-sans font-bold text-[#C9A227] block mb-2">
                    {b.badge}
                  </span>
                  <h3 className="font-serif text-xl font-medium text-[#161A17] mb-3 leading-snug">
                    {b.title}
                  </h3>
                  <p className="text-xs text-[#676E6A] font-sans leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

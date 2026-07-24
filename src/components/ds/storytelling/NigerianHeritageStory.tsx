"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function NigerianHeritageStory() {
  return (
    <section className="py-24 px-6 bg-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Editorial Photo Collage */}
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden border border-[#E2E6E3] shadow-ambient-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800"
              alt="Nigerian Coconut Grove Harvesting"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Overlapping Card Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute -bottom-8 -right-4 md:right-6 max-w-xs p-6 rounded-[1.25rem] glass-alabaster shadow-ambient-lg border border-[#E2E6E3] hidden sm:block"
          >
            <div className="flex items-center gap-2 mb-2 text-[#C9A227]">
              <MapPin className="w-4 h-4" />
              <span className="text-[10px] font-sans uppercase font-bold tracking-[0.2em]">
                Badagry Coastal Belt
              </span>
            </div>
            <p className="font-serif italic text-xs text-[#161A17] leading-relaxed mb-2">
              "Our coconut palms thrive in nutrient-dense coastal soil, nourished by oceanic breeze and rich equatorial rainfall."
            </p>
            <span className="text-[10px] font-sans uppercase tracking-[0.18em] text-[#676E6A] font-semibold">
              — Chief Olusegun, Partner Farmer
            </span>
          </motion.div>
        </div>

        {/* Storytelling Text Content */}
        <div className="lg:col-span-6 space-y-6">
          <Badge variant="gold">LOCAL HERITAGE & FAIR TRADE</Badge>

          <h2 className="font-serif text-3xl md:text-5xl font-medium text-[#161A17] leading-tight">
            The Nigerian Coconut Story & Our Farmers
          </h2>

          <p className="text-xs md:text-sm text-[#676E6A] font-sans leading-relaxed">
            Nigeria's coastal palm groves produce some of the highest-yielding, nutrient-dense organic coconuts in West Africa. At Sana Amnis, we partner directly with over 150 smallholder farming families in Lagos and Ogun State.
          </p>

          <p className="text-xs md:text-sm text-[#676E6A] font-sans leading-relaxed">
            By eliminating predatory middlemen, we guarantee fair living wages, provide agricultural training in organic soil conservation, and reinvest 5% of proceeds back into local clean water initiatives.
          </p>

          {/* Key Impact Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E2E6E3]">
            <div className="p-4 rounded-[1rem] bg-[#F3EFE8] border border-[#E2E6E3]/60">
              <div className="flex items-center gap-2 text-[#1C3322] mb-1">
                <Users className="w-4 h-4 text-[#C9A227]" />
                <span className="font-serif text-2xl font-bold">150+</span>
              </div>
              <span className="text-[10px] font-sans uppercase tracking-[0.18em] text-[#676E6A] font-semibold">
                Farming Families Partnered
              </span>
            </div>

            <div className="p-4 rounded-[1rem] bg-[#F3EFE8] border border-[#E2E6E3]/60">
              <div className="flex items-center gap-2 text-[#1C3322] mb-1">
                <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                <span className="font-serif text-2xl font-bold">2.5x</span>
              </div>
              <span className="text-[10px] font-sans uppercase tracking-[0.18em] text-[#676E6A] font-semibold">
                Above Fair Trade Minimum
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

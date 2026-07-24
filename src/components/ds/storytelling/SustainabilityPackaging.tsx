"use client";

import React from "react";
import { motion } from "framer-motion";
import { Leaf, Package, Truck, ShieldCheck, RefreshCw, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STAGES = [
  {
    icon: ShieldCheck,
    title: "1. Batch Quality Assay",
    desc: "Independent laboratory testing for moisture content (<0.1%), zero heavy metals, and peroxide values.",
  },
  {
    icon: Package,
    title: "2. Amber Glass Sealing",
    desc: "Bottled in pharmaceutical-grade dark amber glass with tamper-evident wooden cork seals.",
  },
  {
    icon: Leaf,
    title: "3. Zero-Plastic Protective Wrap",
    desc: "Encased in 100% biodegradable corrugated cardboard and organic cotton protective sleeves.",
  },
  {
    icon: Truck,
    title: "4. Carbon-Neutral Shipping",
    desc: "Dispatched via temperature-monitored courier partners directly to your sanctuary doorstep.",
  },
];

export function SustainabilityPackaging() {
  return (
    <section className="py-24 px-6 bg-[#161A17] text-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="gold" className="mb-3">
            RESPONSIBLE STEWARDSHIP
          </Badge>
          <h2 className="font-serif text-3xl md:text-5xl font-medium text-[#FAF8F5] mb-4 leading-tight">
            Sustainability & Shipping Journey
          </h2>
          <p className="text-xs md:text-sm text-[#FAF8F5]/80 font-sans leading-relaxed">
            Our commitment to zero waste, recyclable amber glass packaging, and tracked climate-conscious fulfillment.
          </p>
        </div>

        {/* 4-Step Process Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {STAGES.map((s, idx) => {
            const Icon = s.icon;

            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-[1.25rem] bg-[#1C3322]/60 border border-[#FAF8F5]/10 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#C9A227]/20 text-[#C9A227] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-base font-medium text-[#FAF8F5] mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[#FAF8F5]/70 font-sans leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Highlight Banner */}
        <div className="p-8 md:p-12 rounded-[1.5rem] bg-gradient-to-r from-[#1C3322] to-[#2D4E35] border border-gold-hairline flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#C9A227] font-bold">
              100% CIRCULAR PACKAGING GUARANTEE
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-medium text-[#FAF8F5]">
              Return 5 Empty Amber Bottles For A Complimentary 250ml Nectar
            </h3>
            <p className="text-xs text-[#FAF8F5]/80 font-sans leading-relaxed">
              We clean, sterilize, and re-integrate returned glass bottles into our circular bottling cycle to eliminate landfill waste.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <div className="px-6 py-3.5 rounded-full glass-obsidian text-[#C9A227] text-xs font-sans font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin-slow" /> Circular Return Program
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

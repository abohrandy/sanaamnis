"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Thermometer, ShieldAlert, Sparkles, Zap, Check, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STAGES = [
  {
    id: "temp",
    title: "Zero-Heat Control (37°C)",
    icon: Thermometer,
    summary: "Guaranteed maximum temperature threshold to prevent lipid denaturing.",
    description:
      "Conventional commercial coconut oils are heated up to 200°C, stripping beneficial enzymes and creating trans-fats. Sana Amnis uses a temperature-controlled hydraulic cold press kept strictly below body temperature (37°C).",
    stat: "< 37°C",
    statLabel: "Max Temp Guarantee",
  },
  {
    id: "purity",
    title: "Zero Solvents & Hexane",
    icon: ShieldAlert,
    summary: "Pure physical extraction without chemical solvents.",
    description:
      "We rely solely on mechanical pressure without petroleum-derived solvents like hexane or chemical neutralizers. The liquid gold that emerges is 100% unadulterated coconut nectar.",
    stat: "100%",
    statLabel: "Pure Extraction",
  },
  {
    id: "mct",
    title: "Preserved MCT Bio-Active Acids",
    icon: Zap,
    summary: "High concentration of lauric (C12) and caprylic (C8) acids.",
    description:
      "Because no high heat is introduced, key medium-chain fatty acids remain intact, providing cellular bio-energy and potent antimicrobial natural immunity.",
    stat: "62%",
    statLabel: "Natural MCT Acids",
  },
];

export function ColdPressProcess() {
  const [activeStage, setActiveStage] = useState(STAGES[0]);

  return (
    <section className="py-24 px-6 bg-[#1C3322] text-[#FAF8F5] relative overflow-hidden rounded-[2rem] my-12 mx-4 md:mx-12 shadow-ambient-lg border border-gold-hairline">
      {/* Background Lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="gold" className="mb-3">
            EXTRACTION SCIENCE
          </Badge>
          <h2 className="font-serif text-3xl md:text-5xl font-medium text-[#FAF8F5] mb-4 leading-tight">
            How We Cold Press
          </h2>
          <p className="text-xs md:text-sm text-[#FAF8F5]/80 font-sans leading-relaxed">
            Discover why our zero-heat hydraulic extraction retains the full sensory profile and bio-active potency of fresh organic coconuts.
          </p>
        </div>

        {/* Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Stage Selectors */}
          <div className="lg:col-span-5 space-y-4">
            {STAGES.map((stage) => {
              const Icon = stage.icon;
              const isActive = activeStage.id === stage.id;

              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage)}
                  className={`w-full p-6 rounded-[1.25rem] text-left transition-all duration-300 border flex items-start gap-4 cursor-pointer ${
                    isActive
                      ? "bg-[#FAF8F5] text-[#161A17] border-transparent shadow-ambient-md scale-[1.02]"
                      : "bg-[#161A17]/40 text-[#FAF8F5]/80 border-[#FAF8F5]/10 hover:bg-[#161A17]/70"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      isActive
                        ? "bg-[#1C3322] text-[#C9A227]"
                        : "bg-[#FAF8F5]/10 text-[#FAF8F5]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium mb-1 leading-snug">
                      {stage.title}
                    </h3>
                    <p
                      className={`text-xs font-sans leading-relaxed ${
                        isActive ? "text-[#676E6A]" : "text-[#FAF8F5]/60"
                      }`}
                    >
                      {stage.summary}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Detail Showcase Panel */}
          <div className="lg:col-span-7">
            <motion.div
              key={activeStage.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 md:p-12 rounded-[1.5rem] bg-[#121412] border border-[#FAF8F5]/15 flex flex-col justify-between shadow-ambient-lg relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-bold text-[#C9A227]">
                  Extraction Protocol
                </span>
                <div className="px-4 py-1.5 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] text-xs font-serif font-bold">
                  {activeStage.statLabel}: {activeStage.stat}
                </div>
              </div>

              <h3 className="font-serif text-2xl md:text-3xl font-medium text-[#FAF8F5] mb-4">
                {activeStage.title}
              </h3>

              <p className="text-xs md:text-sm text-[#FAF8F5]/80 font-sans leading-relaxed mb-8">
                {activeStage.description}
              </p>

              <div className="pt-6 border-t border-[#FAF8F5]/10 flex flex-wrap gap-4 items-center justify-between text-xs text-[#FAF8F5]/70 font-sans">
                <span className="flex items-center gap-1.5 text-[#C9A227]">
                  <Check className="w-4 h-4" /> Zero Refinement
                </span>
                <span className="flex items-center gap-1.5 text-[#C9A227]">
                  <Check className="w-4 h-4" /> 100% Cold-Pressed
                </span>
                <span className="flex items-center gap-1.5 text-[#C9A227]">
                  <Check className="w-4 h-4" /> Raw Botanical Purity
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

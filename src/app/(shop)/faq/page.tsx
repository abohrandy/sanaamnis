"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "How does cold processing differ from hot coconut oil extraction?",
    a: "Hot extraction uses boiling temperatures which destroy active enzymes, proteins, and aromatic components. Cold pressing mechanically squeezes coconut meat below 45°C, preserving all native cellular antioxidants.",
  },
  {
    q: "Do you ship your organic products outside Nigeria?",
    a: "Yes. In addition to our domestic concierge deliveries within Nigeria (Lagos, Abuja, Port Harcourt), we offer international shipping to North America and Europe via DHL Express.",
  },
  {
    q: "Are the coconut elixirs safe for sensitive skin types?",
    a: "Absolutely. Our oils are 100% organic, containing no chemical fragrances, preservatives, or alcohol additives, making them safe for sensitive epidermal skins.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow max-w-3xl mx-auto px-6 py-20 w-full space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">
            Client Services
          </span>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Frequently Answered Queries
          </h1>
        </div>

        {/* Collapsible List */}
        <div className="space-y-4 pt-6 border-t border-border/20">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(53,94,59,0.01)]"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-muted/10 transition-colors"
                >
                  <h3 className="font-serif text-base font-medium text-foreground pr-4">
                    {item.q}
                  </h3>
                  {isOpen ? (
                    <Minus className="w-4 h-4 text-primary flex-shrink-0" />
                  ) : (
                    <Plus className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-border/10">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

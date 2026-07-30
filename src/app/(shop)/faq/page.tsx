"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  q: string;
  a: React.ReactNode;
}

// Rewritten to match what the rest of the site actually claims — the previous
// copy said cold-pressing happens "below 45°C" and offered international DHL
// shipping to North America and Europe, neither of which appears anywhere else
// on the site (the product pages and journal both say below 37°C, and shipping
// elsewhere is Nigeria-only).
const FAQ_ITEMS: FAQItem[] = [
  {
    q: "What is the difference between your cold-pressed and hot-pressed coconut oil?",
    a: "Cold-pressed is extracted on a temperature-controlled press held below 37°C, so nothing is refined, bleached or deodorised — it keeps a stronger coconut aroma and a lower smoke point, which suits skin, hair and baking. Hot-pressed uses heat for a higher yield, giving a milder flavour and a higher smoke point, which suits everyday frying and cooking.",
  },
  {
    q: "Where do you deliver?",
    a: "Nationwide across Nigeria. Lagos orders typically arrive in 24–48 hours; other states take 3–5 working days. Orders above ₦50,000 ship free. See our shipping page for details.",
  },
  {
    q: "Why has my coconut oil gone solid?",
    a: (
      <>
        Coconut oil naturally sets solid below about 24°C and turns liquid again above
        it — that is normal for an unrefined oil, not a fault. See our{" "}
        <Link href="/blog/storing-coconut-oil" className="underline underline-offset-4 hover:text-[#1C3322]">
          storage guide
        </Link>{" "}
        for how to bring it back to liquid.
      </>
    ),
  },
  {
    q: "Are your products suitable for sensitive skin?",
    a: "Our oils and butters contain no synthetic fragrance, parabens, sulphates or alcohol. As with any natural oil, we would still suggest a small patch test first if you have a known sensitivity.",
  },
  {
    q: "Can I use your coconut oil for cooking and on my skin?",
    a: "Yes — both are food-grade. Many customers use the same cold-pressed bottle for cooking and for skin and hair. If you are frying regularly, the hot-pressed bottle's higher smoke point will serve you better.",
  },
  {
    q: "What is your returns policy?",
    a: (
      <>
        Unopened items can be returned within 14 days of delivery for a full refund.
        For food-safety reasons we cannot accept returns of opened consumables unless
        the product is faulty. Full details are on our{" "}
        <Link href="/returns" className="underline underline-offset-4 hover:text-[#1C3322]">
          returns page
        </Link>
        .
      </>
    ),
  },
  {
    q: "Do you sell wholesale or in bulk?",
    a: (
      <>
        Yes — get in touch through our{" "}
        <Link href="/contact" className="underline underline-offset-4 hover:text-[#1C3322]">
          contact page
        </Link>{" "}
        with the quantities you need and we will quote you directly.
      </>
    ),
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-grow w-full max-w-[820px] mx-auto px-4 md:px-8 py-12 md:py-16 space-y-10">
        <Breadcrumbs items={[{ label: "FAQ" }]} />

        <header className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-bold">
            Good to know
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17] leading-[1.12]">
            Frequently asked questions
          </h1>
        </header>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.q}
                className="rounded-[1rem] border border-[#E2E6E3] bg-[#FAF8F5] overflow-hidden"
              >
                <h2>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    className="w-full p-5 md:p-6 text-left flex justify-between items-center gap-4 hover:bg-[#F3EFE8]/60 transition-colors cursor-pointer"
                  >
                    <span className="font-serif text-base md:text-lg font-medium text-[#161A17]">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-[#C9A227] transition-transform duration-300 shrink-0",
                        isOpen && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </h2>

                {isOpen && (
                  <div id={`faq-${i}`} className="px-5 md:px-6 pb-5 md:pb-6">
                    <p className="text-sm text-[#676E6A] leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-sm text-[#676E6A] pt-4 border-t border-[#E2E6E3]">
          Can&apos;t find your answer?{" "}
          <Link href="/contact" className="text-[#1C3322] font-semibold underline underline-offset-4 hover:text-[#C9A227]">
            Get in touch
          </Link>
          .
        </p>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnswerSegment } from "@/lib/faqs";

export interface FaqAccordionItem {
  question: string;
  segments: AnswerSegment[];
}

/**
 * Extracted from src/app/(shop)/faq/page.tsx so that page could become an async
 * server component (it now fetches from the database) — the open/closed state
 * for each question still needs to live in a client component.
 */
export function FaqAccordion({ items }: { items: FaqAccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question} className="rounded-[1rem] border border-[#E2E6E3] bg-[#FAF8F5] overflow-hidden">
            <h2>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                className="w-full p-5 md:p-6 text-left flex justify-between items-center gap-4 hover:bg-[#F3EFE8]/60 transition-colors cursor-pointer"
              >
                <span className="font-serif text-base md:text-lg font-medium text-[#161A17]">{item.question}</span>
                <ChevronDown
                  className={cn("w-4 h-4 text-[#C9A227] transition-transform duration-300 shrink-0", isOpen && "rotate-180")}
                  aria-hidden="true"
                />
              </button>
            </h2>

            {isOpen && (
              <div id={`faq-${i}`} className="px-5 md:px-6 pb-5 md:pb-6">
                <p className="text-sm text-[#676E6A] leading-relaxed">
                  {item.segments.map((segment, j) =>
                    segment.href ? (
                      <Link key={j} href={segment.href} className="underline underline-offset-4 hover:text-[#1C3322]">
                        {segment.text}
                      </Link>
                    ) : (
                      <React.Fragment key={j}>{segment.text}</React.Fragment>
                    )
                  )}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

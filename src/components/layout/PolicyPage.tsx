import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";

export interface PolicySection {
  heading: string;
  /** Each entry renders as its own paragraph. */
  body: string[];
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[];
}

export interface PolicyPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  sections: PolicySection[];
  lastUpdated?: string;
}

/**
 * Shared shell for the informational pages (shipping, returns, sustainability).
 * Keeps them typographically identical rather than each reinventing a layout.
 */
export function PolicyPage({
  eyebrow,
  title,
  intro,
  sections,
  lastUpdated,
}: PolicyPageProps) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 md:py-16">
        <Breadcrumbs items={[{ label: title }]} className="mb-10" />

        <header className="space-y-4 pb-10 border-b border-[#E2E6E3]">
          <Badge variant="gold">{eyebrow}</Badge>
          <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17] leading-[1.12]">
            {title}
          </h1>
          <p className="text-sm md:text-base text-[#676E6A] leading-relaxed">{intro}</p>
        </header>

        <div className="py-10 space-y-12">
          {sections.map((section) => (
            <section key={section.heading} className="space-y-4">
              <h2 className="font-serif text-xl md:text-2xl font-medium text-[#1C3322]">
                {section.heading}
              </h2>

              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="text-sm text-[#161A17]/75 leading-[1.85]"
                >
                  {paragraph}
                </p>
              ))}

              {section.bullets && (
                <ul className="space-y-2.5 pt-1">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet.slice(0, 40)}
                      className="text-sm text-[#161A17]/75 leading-relaxed flex gap-3"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C9A227] shrink-0"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {lastUpdated && (
          <p className="pt-8 border-t border-[#E2E6E3] text-[10px] uppercase tracking-[0.2em] text-[#676E6A] font-semibold">
            Last updated {lastUpdated}
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}

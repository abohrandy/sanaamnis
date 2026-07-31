import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { getFaqs, parseFaqAnswer } from "@/lib/faqs";
import { FaqAccordion } from "@/components/shop/FaqAccordion";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about our products, shipping and returns.",
  alternates: { canonical: "/faq" },
};

export default async function FAQPage() {
  const faqs = await getFaqs();
  const items = faqs.map((f) => ({ question: f.question, segments: parseFaqAnswer(f.answer) }));

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

        <FaqAccordion items={items} />

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

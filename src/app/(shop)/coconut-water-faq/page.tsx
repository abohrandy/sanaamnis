import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, AtSign } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { FaqAccordion, type FaqAccordionItem } from "@/components/shop/FaqAccordion";

export const metadata: Metadata = {
  title: "Sana Amnis Coconut Water FAQs | Natural Coconut Water Nigeria",
  description:
    "Have questions about Sana Amnis Coconut Water? Get quick answers about ingredients, storage, refrigeration, shelf life, delivery, bulk orders and more.",
  keywords: [
    "Sana Amnis Coconut Water",
    "coconut water Nigeria",
    "natural coconut water Nigeria",
    "fresh coconut water",
    "coconut water delivery Nigeria",
    "buy coconut water Nigeria",
  ],
  alternates: { canonical: "/coconut-water-faq" },
  openGraph: {
    title: "Sana Amnis Coconut Water FAQs | Natural Coconut Water Nigeria",
    description:
      "Have questions about Sana Amnis Coconut Water? Get quick answers about ingredients, storage, refrigeration, shelf life, delivery, bulk orders and more.",
    type: "website",
    url: "/coconut-water-faq",
  },
  twitter: {
    card: "summary",
    title: "Sana Amnis Coconut Water FAQs | Natural Coconut Water Nigeria",
    description:
      "Have questions about Sana Amnis Coconut Water? Get quick answers about ingredients, storage, refrigeration, shelf life, delivery, bulk orders and more.",
  },
};

const FAQ_ITEMS: FaqAccordionItem[] = [
  {
    question: "Is Sana Amnis Coconut Water natural?",
    segments: [
      {
        text: "Yes. Sana Amnis Coconut Water is made from carefully selected fresh green coconuts, giving you a naturally refreshing drink.",
      },
    ],
  },
  {
    question: "Does Sana Amnis Coconut Water contain added sugar?",
    segments: [
      { text: "No. We do not add sugar to our coconut water. Its mild sweetness comes naturally from the coconut." },
    ],
  },
  {
    question: "Why does the taste sometimes vary?",
    segments: [
      {
        text: "Coconuts are natural fruits, so their sweetness and flavour can vary slightly depending on the season, variety and maturity of the coconut. Slight differences in taste are completely normal.",
      },
    ],
  },
  {
    question: "Why does my coconut water sometimes turn pink?",
    segments: [
      {
        text: "Fresh coconut water can sometimes develop a light pink colour due to a natural reaction involving oxygen, light and temperature. A slight pink colour does not automatically mean the coconut water has gone bad.",
      },
    ],
  },
  {
    question: "Does Sana Amnis Coconut Water need to be refrigerated?",
    segments: [
      {
        text: "Yes. Sana Amnis Coconut Water should be kept refrigerated, particularly in the freezer compartment. Always follow the storage instructions provided on the product label.",
      },
    ],
  },
  {
    question: "How long does Sana Amnis Coconut Water last?",
    segments: [
      {
        text: "It can last for 3 months once stored properly. Please check the Best Before date on your bottle or pouch and follow the recommended storage instructions.",
      },
    ],
  },
  {
    question: "How do I know if my coconut water has gone bad?",
    segments: [
      {
        text: "Do not drink the product if it develops an unusual smell or taste, or if the packaging is swollen, leaking or damaged. When in doubt, do not consume it.",
      },
    ],
  },
  {
    question: "What sizes of Sana Amnis Coconut Water are available?",
    segments: [
      {
        text: "Our coconut water is available in convenient 250 ml pouches and 500 ml bottles, making it easy to choose the size that works for you.",
      },
    ],
  },
  {
    question: "Do you deliver Sana Amnis Coconut Water?",
    segments: [
      {
        text: "Yes. We offer delivery to different locations. Delivery availability, fees and timelines depend on your location. Contact us or use the Order Now button to confirm delivery to your area.",
      },
    ],
  },
  {
    question: "Can I buy Sana Amnis Coconut Water in bulk?",
    segments: [
      {
        text: "Yes. We accept bulk orders for homes, offices, events, gyms, restaurants, retailers and other businesses. Contact us for current bulk-order options.",
      },
    ],
  },
  {
    question: "Do you supply supermarkets, gyms, restaurants and other retailers?",
    segments: [
      {
        text: "Yes. We welcome wholesale and retail partnerships. If you would like to stock Sana Amnis Coconut Water in your supermarket, store, gym, restaurant, café or other business, please contact us for our supply options.",
      },
    ],
  },
  {
    question: "How can I order Sana Amnis Coconut Water?",
    segments: [
      { text: "Ordering is easy. Simply click the Order Now button on our website or contact us directly on WhatsApp." },
    ],
  },
];

const USAGE_STEPS = [
  {
    title: "Drink it chilled",
    description:
      "For the best refreshing experience, shake gently, pour into a glass or enjoy directly from the bottle or pouch while chilled.",
  },
  {
    title: "After exercise",
    description: "Enjoy chilled after your workout, walk, run or other physical activity as a refreshing way to replenish fluids.",
  },
  {
    title: "With your meals",
    description: "Pair Sana Amnis Coconut Water with breakfast, lunch or your favourite meal as a refreshing alternative to heavily sweetened drinks.",
  },
  {
    title: "In smoothies",
    description: "Use coconut water as the liquid base for fruit and vegetable smoothies. Simply blend with your favourite fruits and enjoy.",
  },
  {
    title: "On hot days",
    description: "Whether you're at work, outdoors or on the move, enjoy a chilled Sana Amnis Coconut Water when you need something cool and refreshing.",
  },
  {
    title: "At events & gatherings",
    description: "Serve chilled at meetings, parties, weddings, fitness events and other gatherings for guests who want a natural beverage option.",
  },
  {
    title: "For the family",
    description: "Keep Sana Amnis Coconut Water chilled at home for a convenient drink the family can enjoy.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.segments.map((s) => s.text).join(""),
    },
  })),
};

export default function CoconutWaterFaqPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <main className="flex-grow w-full max-w-[820px] mx-auto px-4 md:px-8 py-12 md:py-16 space-y-16">
        <div className="space-y-10">
          <Breadcrumbs items={[{ label: "Coconut Water FAQ" }]} />

          <header className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-bold">Good to know</span>
            <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17] leading-[1.12]">
              Coconut Water FAQs
            </h1>
            <p className="text-sm text-[#676E6A] leading-relaxed max-w-lg">
              Got questions about Sana Amnis Coconut Water? Here are quick answers to some of the questions our
              customers frequently ask.
            </p>
          </header>

          <FaqAccordion items={FAQ_ITEMS} />

          <div className="pt-4 border-t border-[#E2E6E3] space-y-3">
            <h2 className="font-serif text-lg font-medium text-[#161A17]">Still have questions?</h2>
            <p className="text-sm text-[#676E6A] leading-relaxed">
              Can&apos;t find the answer you&apos;re looking for? Talk to us on WhatsApp and a member of the Sana
              Amnis team will be happy to assist you.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="https://wa.me/2349137358352"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[0.5rem] border border-[#E2E6E3] text-[#161A17] text-[11px] font-bold uppercase tracking-[0.12em] hover:border-[#1C3322] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#C9A227]" aria-hidden="true" /> WhatsApp
              </a>
              <a
                href="https://instagram.com/springscoconutproducts"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[0.5rem] border border-[#E2E6E3] text-[#161A17] text-[11px] font-bold uppercase tracking-[0.12em] hover:border-[#1C3322] transition-colors"
              >
                <AtSign className="w-3.5 h-3.5 text-[#C9A227]" aria-hidden="true" /> Instagram: @springscoconutproducts
              </a>
              <a
                href="https://facebook.com/springscoconutproducts"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[0.5rem] border border-[#E2E6E3] text-[#161A17] text-[11px] font-bold uppercase tracking-[0.12em] hover:border-[#1C3322] transition-colors"
              >
                <AtSign className="w-3.5 h-3.5 text-[#C9A227]" aria-hidden="true" /> Facebook: @springscoconutproducts
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <header className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-bold">Enjoy it your way</span>
            <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-tight text-[#161A17] leading-[1.12]">
              How to enjoy Sana Amnis Coconut Water
            </h2>
            <p className="text-sm text-[#676E6A] leading-relaxed max-w-lg">
              Naturally refreshing and easy to enjoy, Sana Amnis Coconut Water fits effortlessly into your everyday
              routine.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {USAGE_STEPS.map((step, index) => (
              <div key={step.title} className="p-5 rounded-[1rem] bg-[#F3EFE8] border border-[#E2E6E3]">
                <span className="font-serif text-lg text-[#C9A227] font-bold block mb-1.5">
                  {String(index + 1).padStart(2, "0")}. {step.title}
                </span>
                <p className="text-xs text-[#676E6A] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.25rem] bg-[#1C3322] text-[#FAF8F5] p-8 md:p-12 text-center space-y-5">
          <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-tight">Best served chilled</h2>
          <p className="text-xs uppercase tracking-[0.18em] text-[#FAF8F5]/70">Shake gently. Serve chilled. Enjoy.</p>
          <p className="text-sm text-[#FAF8F5]/70 max-w-md mx-auto leading-relaxed">
            Keep refrigerated according to the storage instructions on the pack. Once opened, consume immediately.
          </p>
          <div className="pt-2">
            <Link href="/products/sana-amnis-coconut-water">
              <Button variant="gold" size="lg">Order Now</Button>
            </Link>
          </div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] pt-1">Sana Amnis — For a Healthier You</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

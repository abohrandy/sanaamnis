import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, MessageCircle, User, Info } from "lucide-react";
import { getDistributors } from "@/lib/distributors";
import type { Distributor } from "@/lib/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Pickup locations & distributors",
  description:
    "Find a Sana Amnis pickup location or distributor near you — Lagos, Abuja, Port Harcourt, Uyo and beyond.",
  alternates: { canonical: "/distributors" },
};

/** wa.me needs digits only, with the country code — Nigerian numbers are given with a leading 0. */
function whatsappLink(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const withCountryCode = digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
  return `https://wa.me/${withCountryCode}`;
}

/** A phone field sometimes carries more than one number, comma-separated — tel: only takes one. */
function firstNumber(raw: string): string {
  return raw.split(",")[0].trim();
}

function DistributorCard({ d }: { d: Distributor }) {
  return (
    <article className="p-6 md:p-7 rounded-[1.25rem] border border-[#E2E6E3] bg-[#FAF8F5] shadow-ambient-sm space-y-4">
      <div className="space-y-1">
        <h2 className="font-serif text-lg md:text-xl font-medium text-[#161A17]">{d.region}</h2>
        {d.areasCovered && (
          <p className="text-xs text-[#676E6A] leading-relaxed">Covers: {d.areasCovered}</p>
        )}
      </div>

      <div className="space-y-2.5 text-sm text-[#161A17]/80">
        {d.address && (
          <div className="flex gap-2.5">
            <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" aria-hidden="true" />
            <span className="leading-relaxed">{d.address}</span>
          </div>
        )}

        {d.contactName && (
          <div className="flex gap-2.5 items-center">
            <User className="w-4 h-4 text-[#C9A227] shrink-0" aria-hidden="true" />
            <span>{d.contactName}</span>
          </div>
        )}

        {d.notes && (
          <div className="flex gap-2.5">
            <Info className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" aria-hidden="true" />
            <span className="leading-relaxed italic">{d.notes}</span>
          </div>
        )}
      </div>

      {(d.phone || d.whatsapp) && (
        <div className="flex flex-wrap gap-2.5 pt-2 border-t border-[#E2E6E3]/70">
          {d.phone && (
            <a
              href={`tel:${firstNumber(d.phone).replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[0.5rem] bg-[#1C3322] text-[#FAF8F5] text-[11px] font-bold uppercase tracking-[0.12em] hover:bg-[#2D4E35] transition-colors"
            >
              <Phone className="w-3.5 h-3.5" aria-hidden="true" /> {d.phone}
            </a>
          )}
          {d.whatsapp && (
            <a
              href={whatsappLink(d.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[0.5rem] border border-[#E2E6E3] text-[#161A17] text-[11px] font-bold uppercase tracking-[0.12em] hover:border-[#1C3322] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#C9A227]" aria-hidden="true" /> WhatsApp {d.whatsapp}
            </a>
          )}
        </div>
      )}
    </article>
  );
}

export default async function DistributorsPage() {
  const distributors = await getDistributors();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: distributors.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
        name: `Sana Amnis — ${d.region}`,
        ...(d.address ? { address: d.address } : {}),
        ...(d.phone ? { telephone: firstNumber(d.phone) } : {}),
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-grow w-full max-w-[1100px] mx-auto px-4 md:px-8 py-12 md:py-16 space-y-10">
        <Breadcrumbs items={[{ label: "Pickup locations" }]} />

        <header className="max-w-2xl space-y-4">
          <Badge variant="gold">Pickup & distributors</Badge>
          <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17] leading-[1.12]">
            Find us near you
          </h1>
          <p className="text-sm md:text-base text-[#676E6A] leading-relaxed">
            Beyond nationwide delivery, you can collect directly from one of our
            distributors and pickup points across Nigeria. Reach out to confirm
            stock and arrange a time before you travel.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {distributors.map((d) => (
            <DistributorCard key={d.slug} d={d} />
          ))}
        </div>

        <p className="text-sm text-[#676E6A] pt-4 border-t border-[#E2E6E3]">
          Don&apos;t see your area?{" "}
          <Link href="/contact" className="text-[#1C3322] font-semibold underline underline-offset-4 hover:text-[#C9A227]">
            Get in touch
          </Link>{" "}
          — we deliver nationwide even where there isn&apos;t a local pickup point yet.
        </p>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

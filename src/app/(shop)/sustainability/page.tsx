import React from "react";
import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/PolicyPage";

export const metadata: Metadata = {
  title: "Sustainability",
  description:
    "How Sana Amnis sources coconuts, uses the whole fruit, and works with local farming families across Nigeria.",
  alternates: { canonical: "/sustainability" },
};

export default function SustainabilityPage() {
  return (
    <PolicyPage
      eyebrow="Sustainability"
      title="How we source and what we do with it"
      intro="We buy coconuts from local farms across Nigeria and try to leave as little of the fruit unused as possible. This page sets out what that means in practice."
      lastUpdated="July 2026"
      sections={[
        {
          heading: "Where our coconuts come from",
          body: [
            "We buy directly from local farming families across Nigeria, rather than through the layers of intermediaries that normally sit between a Nigerian farm and a finished product.",
            "Buying direct means more of what you pay reaches the people who actually grow the fruit, and it lets us know which farms our stock came from.",
          ],
        },
        {
          heading: "Using the whole coconut",
          body: [
            "A coconut yields far more than one product, and processing it in one place means very little is discarded.",
          ],
          bullets: [
            "The water is drawn off first and bottled",
            "The meat is pressed for milk, then dried into powder",
            "What remains is pressed for oil, hot and cold",
            "The residue is dried into flakes and chips, or milled into flour and poundo",
            "Husk and shell go back out for fuel and horticultural use rather than to landfill",
          ],
        },
        {
          heading: "Packaging",
          body: [
            "Our outer shipping packaging is recyclable and we do not use plastic void fill. Product packaging is a work in progress: pouches and PET bottles are the practical option for food safety and transport in Nigeria today, and we are actively looking at alternatives that survive the supply chain without spoiling the contents.",
            "We would rather say that plainly than describe our packaging as something it is not.",
          ],
        },
        {
          heading: "What we are still working on",
          body: [
            "We do not yet hold the relevant certification, and we do not claim it. Our coconuts are grown without synthetic pesticide programmes, but certification is a formal process we have not completed.",
            "We are also working towards publishing the share of each sale that reaches farmers. Until that number is audited we would rather not put a figure on it.",
          ],
        },
        {
          heading: "Questions",
          body: [
            "If you want to know more about where a specific batch came from, or you are considering stocking our products and need sourcing detail, write to concierge@sanaamnis.com and ask. We will tell you what we know.",
          ],
        },
      ]}
    />
  );
}

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage } from "@/components/layout/PolicyPage";

export const metadata: Metadata = {
  title: "Delivery",
  description:
    "How and when Sana Amnis orders are delivered across Nigeria and what delivery costs.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <PolicyPage
      eyebrow="Delivery"
      title="Getting your order to you"
      intro="We deliver across Nigeria. Here is what it costs, how long it takes, and what happens if something goes wrong on the way."
      lastUpdated="July 2026"
      sections={[
        {
          heading: "How long it takes",
          body: [
            "We offer 24 to 48 hours delivery of orders in cities where our distributors are domicile. Orders outside these cities take 3 to 5 working days.",
          ],
        },
        {
          heading: "What it costs",
          body: [
            "Delivery is charged at a flat rate by destination, calculated at checkout before you pay.",
          ],
          bullets: [
            "Lagos — ₦2,500",
            "Rest of Nigeria — ₦5,000",
            "Express handling — ₦1,500 on top of the rate above",
          ],
        },
        {
          heading: "Tracking your order",
          body: [
            "You will get an email confirming your order as soon as payment clears, and a second message with tracking details once the courier collects it.",
            "If your tracking has not updated for more than two working days, contact us and we will chase the courier on your behalf.",
          ],
        },
        {
          heading: "If something arrives damaged",
          body: [
            "Our products travel in protective packaging, but bottles occasionally take a knock in transit. If anything arrives leaking, broken or with a compromised seal, photograph it and contact us within 48 hours of delivery.",
            "We will send a replacement or refund that item in full. You will not be asked to return a damaged consumable.",
          ],
        },
        {
          heading: "Addresses and failed deliveries",
          body: [
            "Please double-check your address and phone number at checkout — couriers in Nigeria rely heavily on being able to call you.",
            "If a delivery fails because nobody could be reached, the courier will normally attempt redelivery once. After a second failed attempt the parcel returns to us and we will contact you to arrange a redelivery, which may incur a further delivery charge.",
          ],
        },
      ]}
    >
      <p className="pb-8 text-sm text-[#161A17]/75 leading-[1.85]">
        <Link href="/distributors" className="underline underline-offset-4 hover:text-[#1C3322]">
          Check the distributor list to see the distributors closest to you.
        </Link>
      </p>
    </PolicyPage>
  );
}

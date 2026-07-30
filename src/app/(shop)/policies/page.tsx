import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage } from "@/components/layout/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy & terms",
  description: "Sana Amnis privacy policy and terms of service.",
  alternates: { canonical: "/policies" },
};

/**
 * Privacy policy and terms of service.
 *
 * Previously this page also carried shipping and returns copy that contradicted
 * the dedicated /shipping and /returns pages once those were written properly
 * (this page said Lagos delivery is "24 hours" and opened jars can never be
 * returned; the dedicated pages say 24–48 hours and allow returns of faulty
 * opened items). It now covers privacy and terms only, and links out for the rest.
 */
export default function PoliciesPage() {
  return (
    <PolicyPage
      eyebrow="Legal"
      title="Privacy & terms"
      intro="What we collect, why, and the terms that apply when you order from us. For delivery and returns, see the dedicated pages linked below."
      lastUpdated="July 2026"
      sections={[
        {
          heading: "What we collect",
          body: [
            "To place an order we collect your name, email address, delivery address and phone number, and pass your order total to Paystack to take payment — we never see or store your card details ourselves.",
            "If you create an account, we store your name and email against it. If you write to us, we keep your message and email address so we can reply and so we have a record if you follow up.",
          ],
        },
        {
          heading: "Cookies and local storage",
          body: [
            "We use a session cookie to keep you signed in. Your shopping bag and saved items are stored in your browser's local storage, not on our servers, until you check out.",
            "We do not run third-party advertising trackers on this site.",
          ],
        },
        {
          heading: "How we use your information",
          body: [
            "Order and delivery details are used to fulfil that order and to contact you about it. If you subscribe to our newsletter, we email you about new products and offers — no more than once or twice a month — and you can unsubscribe at any time.",
            "We do not sell your personal information to anyone.",
          ],
        },
        {
          heading: "Who we share it with",
          body: [
            "Paystack processes your payment. Our delivery couriers receive your name, address and phone number to complete delivery. We do not share your details with anyone else except where required by law.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "You can ask us what personal data we hold about you, ask us to correct it, or ask us to delete it, subject to what we are legally required to keep for tax and accounting purposes. Write to concierge@sanaamnis.com to make a request.",
          ],
        },
        {
          heading: "Terms of service",
          body: [
            "Prices are shown in Naira and include VAT where applicable. Delivery charges are calculated at checkout and shown before you pay. We reserve the right to correct a listed price that is clearly a pricing error before your order is dispatched, and will contact you if this affects your order.",
            "Product descriptions describe what we intend to sell and how it is made. We are not medical professionals, and nothing on this site is medical advice — if you have a health condition or allergy, check with a doctor before starting any new food or skincare product.",
          ],
        },
      ]}
    >
      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/shipping"
          className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1C3322] hover:text-[#C9A227] underline underline-offset-4 transition-colors"
        >
          Delivery details
        </Link>
        <Link
          href="/returns"
          className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1C3322] hover:text-[#C9A227] underline underline-offset-4 transition-colors"
        >
          Returns policy
        </Link>
        <Link
          href="/sustainability"
          className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1C3322] hover:text-[#C9A227] underline underline-offset-4 transition-colors"
        >
          Sourcing & sustainability
        </Link>
      </div>
    </PolicyPage>
  );
}

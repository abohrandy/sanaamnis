import React from "react";
import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/PolicyPage";

export const metadata: Metadata = {
  title: "Returns",
  description:
    "How to return a Sana Amnis order, what can and cannot be returned, and how refunds are processed.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return (
    <PolicyPage
      eyebrow="Returns"
      title="Returns and refunds"
      intro="If something is not right, we want to put it right. Because most of what we sell is food, there are limits on what can come back — here is exactly how it works."
      lastUpdated="July 2026"
      sections={[
        {
          heading: "What you can return",
          body: [
            "You can return any unopened item within 14 days of delivery for a full refund, as long as the seal is intact and the packaging is undamaged.",
          ],
          bullets: [
            "Unopened consumables — oils, water, milk powder, flour, flakes, poundo",
            "Unopened body care — balms, butters, scrubs, masks",
            "Anything that arrived damaged, leaking or past its date",
            "Anything that is not what you ordered",
          ],
        },
        {
          heading: "What we cannot take back",
          body: [
            "For food-safety reasons we cannot accept opened consumables or opened body care unless the product itself is faulty. Once a seal is broken we have no way to verify how a product has been stored, and we will not resell it.",
            "This does not affect your rights where a product is genuinely defective, mislabelled or unfit for consumption. In those cases contact us and we will replace or refund it regardless of whether it has been opened.",
          ],
        },
        {
          heading: "How to start a return",
          body: [
            "Email concierge@sanaamnis.com with your order number and, where relevant, a photograph of the problem. You do not need to ship anything back before hearing from us.",
            "We will confirm within one working day whether to return the item and, if so, arrange collection or give you a return address.",
          ],
        },
        {
          heading: "Refunds",
          body: [
            "Once a returned item reaches us and passes inspection, we refund to your original payment method through Paystack. Banks typically take 5 to 10 working days to post the funds.",
            "Refunds cover the price of the returned items. Original delivery charges are refunded only where the return is our fault — a damaged, faulty or incorrect item.",
          ],
        },
        {
          heading: "Cancelling an order",
          body: [
            "If your order has not yet been dispatched, contact us and we will cancel it and refund you in full. Once a parcel is with the courier it has to run its course, and you can return it under the terms above.",
          ],
        },
      ]}
    />
  );
}

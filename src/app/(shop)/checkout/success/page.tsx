import React, { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { OrderConfirmation } from "@/components/shop/OrderConfirmation";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Order received",
  robots: { index: false, follow: false },
};

/**
 * Deliberately a static shell.
 *
 * Request-time page rendering is currently failing on the Railway deployment —
 * every dynamic page returned 500 while static and prerendered pages served fine.
 * The order status is fetched client-side from /api/orders/status (route handlers
 * are unaffected), which keeps the confirmation screen working and is faster.
 */
export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-20 w-full flex items-center justify-center">
        <Suspense
          fallback={
            <div className="w-full rounded-[2rem] bg-[#FAF8F5] border border-[#E2E6E3] p-14 text-center">
              <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin mx-auto" />
            </div>
          }
        >
          <OrderConfirmation />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

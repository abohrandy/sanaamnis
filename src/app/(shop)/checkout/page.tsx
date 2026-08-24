import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CheckoutClient } from "@/components/shop/CheckoutClient";
import { getDistributors } from "@/lib/distributors";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const distributors = await getDistributors();

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />
      <CheckoutClient distributors={distributors} />
      <Footer />
    </div>
  );
}

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AccountClient } from "@/components/account/AccountClient";

export const revalidate = 0;

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full space-y-12">
        {/* Intro Banner */}
        <div className="max-w-2xl space-y-3">
          <span className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-[#C9A227]">
            SANCTUARY PROFILE
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-[#161A17]">
            My Collector Account
          </h1>
          <p className="text-xs text-[#676E6A] font-sans">
            Manage your saved formulations, delivery destinations, order tracking archives, and Glass Circle privilege points.
          </p>
        </div>

        {/* Tabbed Account Sanctuary Dashboard */}
        <AccountClient />
      </main>

      <Footer />
    </div>
  );
}


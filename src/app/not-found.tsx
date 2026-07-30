import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#F3EFE8] border border-[#E2E6E3] flex items-center justify-center mx-auto">
            <Leaf className="w-7 h-7 text-[#C9A227] stroke-[1.4]" />
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A227]">
            404
          </p>

          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#161A17] tracking-tight">
            We could not find that page
          </h1>

          <p className="text-sm text-[#676E6A] leading-relaxed">
            It may have moved, or the link may be out of date. Everything we sell is a
            click away below.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/shop">
              <Button variant="botanical" size="lg" className="flex items-center gap-2">
                Shop all products <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">
                Back to home
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

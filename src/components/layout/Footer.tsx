import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#161A17] text-[#FAF8F5] border-t border-gold-hairline">
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Brand & Ethos */}
        <div className="col-span-1 md:col-span-4 space-y-6">
          <Link href="/" className="block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo_long.png"
              alt="Sana Amnis Sanctuary"
              className="h-12 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <p className="text-xs leading-relaxed text-[#FAF8F5]/70 font-sans max-w-sm">
            Elevating daily wellness rituals with cold-pressed organic elixirs, sustainably harvested from pristine Nigerian groves.
          </p>

          <div className="flex items-center gap-4 text-[10px] font-sans uppercase tracking-[0.2em] text-[#C9A227] pt-2">
            <span className="flex items-center gap-1.5"><Leaf className="w-3.5 h-3.5" /> 100% Pure Organic</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Sustainably Sourced</span>
          </div>
        </div>

        {/* Explore Links */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-semibold font-sans">
            Selection
          </h4>
          <ul className="space-y-3 text-xs font-sans text-[#FAF8F5]/80">
            <li><Link href="/shop" className="hover:text-[#C9A227] transition-colors">All Formulations</Link></li>
            <li><Link href="/collections" className="hover:text-[#C9A227] transition-colors">Curated Collections</Link></li>
            <li><Link href="/recipes" className="hover:text-[#C9A227] transition-colors">Botanical Guides</Link></li>
            <li><Link href="/about" className="hover:text-[#C9A227] transition-colors">Our Ethos</Link></li>
          </ul>
        </div>

        {/* Client Care */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-semibold font-sans">
            Client Care
          </h4>
          <ul className="space-y-3 text-xs font-sans text-[#FAF8F5]/80">
            <li><Link href="/contact" className="hover:text-[#C9A227] transition-colors">Concierge</Link></li>
            <li><Link href="/shipping" className="hover:text-[#C9A227] transition-colors">Shipping Protocol</Link></li>
            <li><Link href="/returns" className="hover:text-[#C9A227] transition-colors">Returns & Guarantee</Link></li>
            <li><Link href="/faq" className="hover:text-[#C9A227] transition-colors">Frequently Asked</Link></li>
          </ul>
        </div>

        {/* Sourcing & Location */}
        <div className="col-span-1 md:col-span-4 space-y-4">
          <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-semibold font-sans flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Sanctuary Headquarters
          </h4>
          <p className="text-xs leading-relaxed text-[#FAF8F5]/70 font-sans">
            Sana Amnis Estate, Victoria Island, Lagos, Nigeria.  
            Direct Enquiries: concierge@sanaamnis.com
          </p>
          <div className="pt-2 text-[10px] font-sans uppercase tracking-[0.2em] text-[#FAF8F5]/50">
            Encrypted Checkout via Paystack
          </div>
        </div>
      </div>

      {/* Legal Footer Bottom */}
      <div className="border-t border-[#FAF8F5]/10 py-8 px-6 bg-[#121412]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#FAF8F5]/50 font-sans">
          <span>&copy; 2026 SANA AMNIS ORGANIC LIFESTYLE. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/policies" className="hover:text-[#FAF8F5] transition-colors">Privacy Policy</Link>
            <Link href="/policies" className="hover:text-[#FAF8F5] transition-colors">Terms of Service</Link>
            <Link href="/policies" className="hover:text-[#FAF8F5] transition-colors">Ethical Sourcing</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


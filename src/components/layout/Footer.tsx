import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto bg-neutral-950 text-neutral-400 border-t border-neutral-800">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20 py-16 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Brand info */}
        <div className="col-span-1 md:col-span-4 space-y-6">
          <span className="font-serif text-xl font-bold tracking-widest text-white">SANA AMNIS</span>
          <p className="text-xs leading-relaxed max-w-xs text-neutral-500 font-sans">
            Elevating daily rituals with the purest organic coconut products, sustainably sourced from the heart of Nigeria.
          </p>
        </div>

        {/* Explore Links */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-white font-semibold font-sans">Explore</h4>
          <ul className="space-y-3 text-xs font-medium">
            <li><Link href="/catalog" className="hover:text-white transition-colors">Shop</Link></li>
            <li><Link href="/collections" className="hover:text-white transition-colors">Collections</Link></li>
            <li><Link href="/recipes" className="hover:text-white transition-colors">Recipes</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-white font-semibold font-sans">Support</h4>
          <ul className="space-y-3 text-xs font-medium">
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping</Link></li>
            <li><Link href="/returns" className="hover:text-white transition-colors">Returns</Link></li>
            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
          </ul>
        </div>

        {/* Join Community Newsletter (Matches Stitch specification) */}
        <div className="col-span-1 md:col-span-4 space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-white font-semibold font-sans">Join Our Community</h4>
          <p className="text-xs text-neutral-500">Subscribe for exclusive offers, recipes, and wellness tips.</p>
          <form className="flex flex-col sm:flex-row gap-2 pt-2">
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full bg-neutral-900 border border-neutral-800 rounded-full px-5 py-3 text-xs text-white focus:outline-none focus:border-[#1d4626] transition-colors"
            />
            <button
              type="submit"
              className="bg-[#1d4626] hover:bg-[#355e3b] text-white rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Legal Footer Info */}
      <div className="border-t border-neutral-900 py-8 px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-widest text-neutral-600 font-medium">
          <span>&copy; 2026 SANA AMNIS. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/policies" className="hover:text-neutral-400 transition-colors">Privacy Policy</Link>
            <Link href="/policies" className="hover:text-neutral-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

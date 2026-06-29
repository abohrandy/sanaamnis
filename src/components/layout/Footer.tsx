import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto bg-neutral-950 text-neutral-400 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-4">
          <span className="font-serif text-xl font-bold tracking-widest text-white">SANA AMNIS</span>
          <p className="text-xs leading-relaxed max-w-xs text-neutral-500 font-sans">
            Crafting premium, sustainable, luxury garments and accessories for the modern minimalist since 2026.
          </p>
        </div>

        {/* Catalog */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-white font-semibold">Collections</h4>
          <ul className="space-y-2 text-xs font-medium">
            <li><Link href="/catalog?category=coats" className="hover:text-white transition-colors">Outerwear & Coats</Link></li>
            <li><Link href="/catalog?category=knitwear" className="hover:text-white transition-colors">Premium Knitwear</Link></li>
            <li><Link href="/catalog?category=accessories" className="hover:text-white transition-colors">Essentials & Accessories</Link></li>
          </ul>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-white font-semibold">Company</h4>
          <ul className="space-y-2 text-xs font-medium">
            <li><Link href="/about" className="hover:text-white transition-colors">Our Heritage</Link></li>
            <li><Link href="/sustainability" className="hover:text-white transition-colors">Sustainability Code</Link></li>
            <li><Link href="/journal" className="hover:text-white transition-colors">The Amnis Journal</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-white font-semibold">Support</h4>
          <ul className="space-y-2 text-xs font-medium">
            <li><Link href="/contact" className="hover:text-white transition-colors">Client Services</Link></li>
            <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link></li>
          </ul>
        </div>
      </div>

      {/* Legal */}
      <div className="border-t border-neutral-900 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[10px] uppercase tracking-widest text-neutral-600 font-medium">
          <span>&copy; 2026 SANA AMNIS. ALL RIGHTS RESERVED.</span>
          <span className="mt-2 sm:mt-0">DESIGNED BY LEAD SOFTWARE ARCHITECT</span>
        </div>
      </div>
    </footer>
  );
}

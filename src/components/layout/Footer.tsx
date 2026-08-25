import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Leaf, ShieldCheck, Mail, MapPin } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog";

const SHOP_LINKS = [
  { href: "/shop", label: "All products" },
  { href: "/bundles", label: "Bundles" },
  ...Object.values(CATEGORIES).map((c) => ({
    href: `/shop?category=${c.slug}`,
    label: c.name,
  })),
];

const CARE_LINKS = [
  { href: "/contact", label: "Contact us" },
  { href: "/shipping", label: "Delivery" },
  { href: "/distributors", label: "Pickup locations" },
  { href: "/returns", label: "Returns" },
  { href: "/faq", label: "FAQs" },
];

const ABOUT_LINKS = [
  { href: "/about", label: "Our story" },
  { href: "/sustainability", label: "Sustainability" },
  { href: "/recipes", label: "Recipes" },
  { href: "/blog", label: "Blog" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#161A17] text-[#FAF8F5] border-t border-gold-hairline">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 xl:grid-cols-12 gap-10 md:gap-12">
        <div className="col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-4 space-y-6">
          <Link href="/" className="block w-fit" aria-label="Sana Amnis home">
            <Image
              src="/logo3.png"
              alt="Sana Amnis"
              width={329}
              height={217}
              className="h-20 w-auto object-contain brightness-0 invert"
            />
          </Link>

          <p className="text-xs leading-relaxed text-[#FAF8F5]/70 max-w-sm">
            Coconut water, milk powder, oils and kitchen staples, made in Nigeria from
            home-grown coconuts.
          </p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.18em] text-[#C9A227] pt-1">
            <li className="flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5" aria-hidden="true" /> No preservatives
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" /> Sourced direct
            </li>
          </ul>
        </div>

        <nav className="col-span-1 md:col-span-1 xl:col-span-2 space-y-4" aria-labelledby="footer-shop">
          <h2
            id="footer-shop"
            className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-semibold"
          >
            Shop
          </h2>
          <ul className="space-y-3 text-xs text-[#FAF8F5]/80">
            {SHOP_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-[#C9A227] transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="col-span-1 md:col-span-1 xl:col-span-2 space-y-4" aria-labelledby="footer-care">
          <h2
            id="footer-care"
            className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-semibold"
          >
            Help
          </h2>
          <ul className="space-y-3 text-xs text-[#FAF8F5]/80">
            {CARE_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-[#C9A227] transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="col-span-1 md:col-span-1 xl:col-span-2 space-y-4" aria-labelledby="footer-about">
          <h2
            id="footer-about"
            className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-semibold"
          >
            About
          </h2>
          <ul className="space-y-3 text-xs text-[#FAF8F5]/80">
            {ABOUT_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-[#C9A227] transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-1 sm:col-span-2 md:col-span-2 xl:col-span-2 space-y-4">
          <h2 className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
            Get in touch
          </h2>
          <address className="not-italic space-y-2.5 text-xs text-[#FAF8F5]/70 leading-relaxed">
            <p className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
              Plot 506, Cadastral Zone, Dakibiyu, Jabi, Abuja, FCT, Nigeria
            </p>
            <p className="flex items-start gap-2">
              <Mail className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
              <span className="min-w-0 flex-1 space-y-1">
                <a href="mailto:communitymart@gmail.com" className="block whitespace-nowrap hover:text-[#C9A227] transition-colors">
                  communitymart@gmail.com
                </a>
                <a href="mailto:info@sanaamniscoconut.com" className="block whitespace-nowrap hover:text-[#C9A227] transition-colors">
                  info@sanaamniscoconut.com
                </a>
              </span>
            </p>
          </address>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#FAF8F5]/45 pt-1">
            Secure payment via Paystack
          </p>
        </div>
      </div>

      <div className="border-t border-[#FAF8F5]/10 py-7 px-6 bg-[#121412]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.18em] text-[#FAF8F5]/50">
          <span>&copy; {new Date().getFullYear()} Sana Amnis. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/policies" className="hover:text-[#FAF8F5] transition-colors">
              Privacy
            </Link>
            <Link href="/policies" className="hover:text-[#FAF8F5] transition-colors">
              Terms
            </Link>
            <Link href="/sustainability" className="hover:text-[#FAF8F5] transition-colors">
              Sourcing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

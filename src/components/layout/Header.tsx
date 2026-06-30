"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useHydrated } from "@/hooks/useHydratedStore";
import CartDrawer from "../shop/CartDrawer";
import { ShoppingBag, User, Search, Menu, X } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isHydrated = useHydrated();
  const rawCount = useCartStore((state) => state.getTotalItems)();
  const cartItemsCount = isHydrated ? rawCount : 0;
  const { data: session } = useSession();

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-[#1a1c1a] dark:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo_long Image */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo_long.png"
              alt="Sana Amnis Premium Coconuts"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-[#222222] dark:text-neutral-100">
            <Link href="/shop" className="hover:text-[#1d4626] dark:hover:text-white transition-colors">
              Shop
            </Link>
            <Link href="/recipes" className="hover:text-[#1d4626] dark:hover:text-white transition-colors">
              Recipes
            </Link>
            <Link href="/about" className="hover:text-[#1d4626] dark:hover:text-white transition-colors">
              About Us
            </Link>
            {(session?.user as any)?.role === "admin" && (
              <Link href="/admin" className="text-[#cea62c] hover:text-[#755b00] transition-colors">
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 text-[#1d4626] dark:text-white">
            <Link href="/search" className="p-2 hover:text-[#cea62c] transition-colors">
              <Search className="w-5 h-5" />
            </Link>

            {/* User Session Action */}
            {session ? (
              <div className="flex items-center gap-2">
                <Link href="/account" className="hidden lg:inline text-[10px] font-bold uppercase tracking-widest text-[#424941] dark:text-neutral-400">
                  {session.user.name.split(" ")[0]}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2 hover:text-[#cea62c] transition-colors"
                  title="Sign Out"
                >
                  <User className="w-5 h-5 text-[#cea62c]" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 hover:text-[#cea62c] transition-colors"
                title="Sign In"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 relative hover:text-[#cea62c] transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#cea62c] text-white text-[9px] font-bold rounded-full flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col gap-4 text-xs font-semibold uppercase tracking-widest text-[#424941] dark:text-neutral-300">
            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#1d4626] py-2 border-b border-neutral-100">
              Shop
            </Link>
            <Link href="/recipes" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#1d4626] py-2 border-b border-neutral-100">
              Recipes
            </Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#1d4626] py-2 border-b border-neutral-100">
              About Us
            </Link>
            {(session?.user as any)?.role === "admin" && (
              <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-[#cea62c] py-2">
                Admin Panel
              </Link>
            )}
          </nav>
        )}
      </header>

      {/* Persistent Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

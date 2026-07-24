"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useHydrated } from "@/hooks/useHydratedStore";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import CartDrawer from "../shop/CartDrawer";
import { SearchModal } from "../shop/SearchModal";
import { WishlistDrawer } from "../shop/WishlistDrawer";
import { MegaMenu } from "./MegaMenu";
import { AccountDropdown } from "./AccountDropdown";
import { MobileNav } from "./MobileNav";
import { ShoppingBag, User, Search, Menu, X, Heart, ChevronDown } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<"selection" | "collections" | "recipes" | "journal" | null>(null);

  const { isScrolled } = useScrollPosition();

  // Keyboard hotkey listeners: Cmd/Ctrl + K -> Search, Esc -> Close drawers
  useKeyboardShortcuts({
    onSearch: () => setIsSearchOpen(true),
    onEscape: () => {
      setIsCartOpen(false);
      setIsSearchOpen(false);
      setIsWishlistOpen(false);
      setIsMobileMenuOpen(false);
      setIsAccountOpen(false);
      setActiveMegaMenu(null);
    },
  });

  const isHydrated = useHydrated();
  const cartItemsCount = useCartStore((state) =>
    isHydrated ? state.items.reduce((sum, item) => sum + item.quantity, 0) : 0
  );
  const { data: session } = useSession();

  return (
    <>
      {/* Editorial Top Announcement Bar */}
      <div className="bg-[#1C3322] text-[#FAF8F5] text-[10px] font-sans font-semibold uppercase tracking-[0.25em] py-2.5 text-center border-b border-gold-hairline px-4 flex items-center justify-center gap-2 z-50 relative">
        <span>Complimentary Express Shipping on Orders Above ₦50,000</span>
        <span className="hidden md:inline text-[#C9A227]">|</span>
        <span className="hidden md:inline text-[#C9A227]">Press CMD+K for Instant Search</span>
      </div>

      {/* Main Adaptive Header Shell (Transparent -> Frosted Glass on Scroll) */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-500 ease-out",
          isScrolled
            ? "glass-alabaster dark:glass-obsidian shadow-ambient-md py-3 border-b border-[#E2E6E3]"
            : "bg-transparent py-5 border-b border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-[#161A17] dark:text-[#FAF8F5] hover:text-[#1C3322] transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo_long.png"
              alt="Sana Amnis Luxury Organic"
              className="h-10 md:h-12 w-auto object-contain transition-all duration-300"
            />
          </Link>

          {/* Desktop Links with Hover Mega Menu Triggers */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-sans uppercase font-bold tracking-[0.2em] text-[#161A17]">
            <Link href="/" className="hover:text-[#C9A227] transition-colors py-2">
              Home
            </Link>

            <div
              className="relative py-2 cursor-pointer"
              onMouseEnter={() => setActiveMegaMenu("selection")}
            >
              <Link href="/shop" className="hover:text-[#C9A227] transition-colors inline-flex items-center gap-1">
                Selection <ChevronDown className="w-3 h-3 text-[#C9A227]" />
              </Link>
            </div>

            <div
              className="relative py-2 cursor-pointer"
              onMouseEnter={() => setActiveMegaMenu("recipes")}
            >
              <Link href="/recipes" className="hover:text-[#C9A227] transition-colors inline-flex items-center gap-1">
                Recipes <ChevronDown className="w-3 h-3 text-[#C9A227]" />
              </Link>
            </div>

            <div
              className="relative py-2 cursor-pointer"
              onMouseEnter={() => setActiveMegaMenu("journal")}
            >
              <Link href="/blog" className="hover:text-[#C9A227] transition-colors inline-flex items-center gap-1">
                Journal <ChevronDown className="w-3 h-3 text-[#C9A227]" />
              </Link>
            </div>

            <Link href="/about" className="hover:text-[#C9A227] transition-colors py-2">
              Ethos
            </Link>
          </nav>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-full hover:bg-[#F3EFE8] dark:hover:bg-white/10 text-[#161A17] dark:text-[#FAF8F5] hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
              title="Search (CMD+K)"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline text-[9px] font-sans font-bold uppercase tracking-[0.18em] text-[#676E6A] bg-[#F3EFE8] dark:bg-[#1C1C1E] px-2 py-0.5 rounded-full border border-[#E2E6E3]/60">
                ⌘K
              </span>
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-2.5 rounded-full hover:bg-[#F3EFE8] dark:hover:bg-white/10 text-[#161A17] dark:text-[#FAF8F5] hover:text-[#C9A227] transition-colors hidden sm:block"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>

            {/* Account Trigger & Dropdown */}
            <div className="relative">
              {session ? (
                <button
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="p-2.5 rounded-full hover:bg-[#F3EFE8] text-[#C9A227] transition-colors flex items-center gap-2"
                  title="Account Details"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden lg:inline text-[10px] font-sans uppercase font-bold tracking-[0.18em] text-[#161A17] dark:text-[#FAF8F5]">
                    {session.user.name.split(" ")[0]}
                  </span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="p-2.5 rounded-full hover:bg-[#F3EFE8] text-[#161A17] dark:text-[#FAF8F5] hover:text-[#C9A227] transition-colors"
                  title="Sign In"
                >
                  <User className="w-4 h-4" />
                </Link>
              )}

              <AccountDropdown
                isOpen={isAccountOpen}
                onClose={() => setIsAccountOpen(false)}
                session={session}
              />
            </div>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 rounded-full bg-[#1C3322] text-[#FAF8F5] relative hover:bg-[#2D4E35] transition-all duration-300 shadow-ambient-sm cursor-pointer ml-1"
              aria-label={`Shopping bag with ${cartItemsCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A227] text-[#FAF8F5] text-[9px] font-bold rounded-full flex items-center justify-center border border-[#FAF8F5]">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Hover Mega Menu Overlay */}
        {activeMegaMenu && (
          <MegaMenu type={activeMegaMenu} onClose={() => setActiveMegaMenu(null)} />
        )}
      </header>

      {/* Drawers & Modals */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        cartCount={cartItemsCount}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        session={session}
      />
    </>
  );
}

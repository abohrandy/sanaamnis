"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
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

type MegaMenuId = "selection" | "collections" | "recipes" | "journal";

const MEGA_MENU_LINKS: Array<{ id: MegaMenuId; href: string; label: string }> = [
  { id: "selection", href: "/shop", label: "Shop" },
  { id: "recipes", href: "/recipes", label: "Recipes" },
  { id: "journal", href: "/blog", label: "Journal" },
];

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<MegaMenuId | null>(null);
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);

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
      setIsContactMenuOpen(false);
    },
  });

  const isHydrated = useHydrated();
  const cartItemsCount = useCartStore((state) =>
    isHydrated ? state.items.reduce((sum, item) => sum + item.quantity, 0) : 0
  );
  const { data: session } = useSession();

  return (
    <>
      {/* Main Adaptive Header Shell (Transparent -> Frosted Glass on Scroll) */}
      <header
        // The mega menu opens on hover but had no matching leave handler, so moving
        // the pointer sideways off the nav left it stuck open until you pressed
        // Escape. Closing on leaving the whole header covers every exit path.
        onMouseLeave={() => {
          setActiveMegaMenu(null);
          setIsContactMenuOpen(false);
        }}
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
          <Link href="/" className="flex items-center gap-3" aria-label="Sana Amnis home">
            <Image
              src="/logo_long.png"
              alt="Sana Amnis"
              width={240}
              height={56}
              priority
              className="h-10 md:h-12 w-auto object-contain transition-all duration-300"
            />
          </Link>

          {/* Desktop Links with Hover Mega Menu Triggers */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-sans uppercase font-bold tracking-[0.2em] text-[#161A17]">
            <Link href="/" className="hover:text-[#C9A227] transition-colors py-2">
              Home
            </Link>

            {MEGA_MENU_LINKS.map(({ id, href, label }) => (
              <div
                key={id}
                className="relative py-2"
                onMouseEnter={() => setActiveMegaMenu(id)}
                onFocusCapture={() => setActiveMegaMenu(id)}
              >
                <Link
                  href={href}
                  className="hover:text-[#C9A227] transition-colors inline-flex items-center gap-1"
                  aria-expanded={activeMegaMenu === id}
                  aria-haspopup="true"
                >
                  {label}
                  <ChevronDown
                    className={cn(
                      "w-3 h-3 text-[#C9A227] transition-transform duration-300",
                      activeMegaMenu === id && "rotate-180"
                    )}
                  />
                </Link>
              </div>
            ))}

            <Link href="/about" className="hover:text-[#C9A227] transition-colors py-2">
              About
            </Link>

            <div
              className="relative py-2"
              onMouseEnter={() => setIsContactMenuOpen(true)}
              onFocusCapture={() => setIsContactMenuOpen(true)}
            >
              <Link
                href="/contact"
                className="hover:text-[#C9A227] transition-colors inline-flex items-center gap-1"
                aria-expanded={isContactMenuOpen}
                aria-haspopup="true"
              >
                Contact Us
                <ChevronDown
                  className={cn(
                    "w-3 h-3 text-[#C9A227] transition-transform duration-300",
                    isContactMenuOpen && "rotate-180"
                  )}
                />
              </Link>

              <AnimatePresence>
                {isContactMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-0 top-full mt-1 w-56 rounded-[1rem] border border-[#E2E6E3] bg-[#FAF8F5] glass-alabaster shadow-ambient-md p-2 z-50 normal-case tracking-normal font-normal"
                  >
                    <Link
                      href="/contact"
                      onClick={() => setIsContactMenuOpen(false)}
                      className="block p-3 rounded-[0.5rem] text-[11px] font-bold uppercase tracking-[0.16em] text-[#161A17] hover:bg-[#F3EFE8] hover:text-[#1C3322] transition-colors"
                    >
                      Contact Us
                    </Link>
                    <Link
                      href="/distributors"
                      onClick={() => setIsContactMenuOpen(false)}
                      className="block p-3 rounded-[0.5rem] text-[11px] font-bold uppercase tracking-[0.16em] text-[#161A17] hover:bg-[#F3EFE8] hover:text-[#1C3322] transition-colors"
                    >
                      Distributors
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
        <AnimatePresence>
          {activeMegaMenu && (
            <MegaMenu
              key={activeMegaMenu}
              type={activeMegaMenu}
              onClose={() => setActiveMegaMenu(null)}
            />
          )}
        </AnimatePresence>
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

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
  const { data: session, isPending } = useSession();


  return (
    <>
      <header className="sticky top-0 z-40 w-full glass border-b border-border/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-foreground"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-[0.15em] text-foreground hover:text-primary transition-colors">
              SANA AMNIS
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/catalog" className="hover:text-foreground transition-colors">
              Catalog
            </Link>
            {(session?.user as any)?.role === "admin" && (
              <Link href="/admin" className="text-primary hover:text-primary/80 transition-colors">
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-foreground hover:text-primary transition-colors hidden sm:block">
              <Search className="w-5 h-5" />
            </button>

            {/* User Session Action */}
            {session ? (
              <div className="flex items-center gap-3">
                <span className="hidden lg:inline text-xs font-medium text-muted-foreground">
                  Hello, {session.user.name.split(" ")[0]}
                </span>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-foreground hover:text-primary transition-colors"
                  title="Sign Out"
                >
                  <User className="w-5 h-5 text-primary" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 text-foreground hover:text-primary transition-colors"
                title="Sign In"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 relative text-foreground hover:text-primary transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-border/40 bg-card p-6 flex flex-col gap-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground py-2 border-b border-border/10">
              Home
            </Link>
            <Link href="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground py-2 border-b border-border/10">
              Catalog
            </Link>
            {(session?.user as any)?.role === "admin" && (
              <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-primary hover:text-primary/80 py-2">
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

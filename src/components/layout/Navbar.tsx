"use client";

import React from "react";
import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  className?: string;
  cartCount?: number;
  onCartToggle?: () => void;
  userSession?: any;
}

export function Navbar({ className, cartCount = 0, onCartToggle, userSession }: NavbarProps) {
  return (
    <nav className={cn("w-full h-20 glass border-b border-border/40 flex items-center justify-between px-6 z-40 sticky top-0", className)}>
      {/* Brand */}
      <Link href="/" className="font-serif text-xl font-bold tracking-[0.2em] text-foreground">
        SANA AMNIS
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <Link href="/catalog" className="hover:text-foreground transition-colors">Catalog</Link>
        <Link href="/sustainability" className="hover:text-foreground transition-colors">Ethics</Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 text-foreground">
        <button className="p-2 hover:text-primary transition-colors">
          <Search className="w-4 h-4" />
        </button>

        {userSession ? (
          <Link href="/dashboard" className="p-2 hover:text-primary transition-colors">
            <User className="w-4 h-4 text-primary" />
          </Link>
        ) : (
          <Link href="/login" className="p-2 hover:text-primary transition-colors">
            <User className="w-4 h-4" />
          </Link>
        )}

        <button onClick={onCartToggle} className="p-2 relative hover:text-primary transition-colors">
          <ShoppingBag className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-primary text-primary-foreground text-[8px] font-bold rounded-full flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}

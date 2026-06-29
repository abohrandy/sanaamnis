"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, User, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  className?: string;
  cartCount?: number;
}

export function MobileNav({ className, cartCount = 0 }: MobileNavProps) {
  const pathname = usePathname() || "";

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/catalog", icon: ShoppingBag, badge: false },
    { label: "Saved", href: "/favorites", icon: Heart },
    { label: "Account", href: "/login", icon: User },
  ];

  return (
    <div className={cn("md:hidden fixed bottom-0 left-0 right-0 h-16 glass border-t border-border/40 flex items-center justify-around z-40 bg-card/85 backdrop-blur-md px-4", className)}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-[9px] uppercase tracking-widest font-semibold w-16 h-full transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="relative">
              <Icon className="w-4 h-4" />
              {item.label === "Shop" && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-primary text-primary-foreground text-[8px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

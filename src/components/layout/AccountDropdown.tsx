"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Package, Heart, LogOut, ShieldCheck } from "lucide-react";
import { signOut } from "@/lib/auth-client";

export interface AccountDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
}

export function AccountDropdown({ isOpen, onClose, session }: AccountDropdownProps) {
  if (!session) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-0 top-full mt-3 w-72 rounded-[1.25rem] border border-[#E2E6E3] bg-[#FAF8F5] glass-alabaster shadow-ambient-md p-4 z-50 overflow-hidden"
          onMouseLeave={onClose}
        >
          {/* User Information */}
          <div className="p-3 border-b border-[#E2E6E3]/60 mb-2">
            <p className="font-serif text-sm font-medium text-[#161A17] leading-snug">
              {session.user.name}
            </p>
            <p className="text-xs text-[#676E6A] font-sans truncate">
              {session.user.email}
            </p>
            <div className="mt-2 inline-flex items-center gap-1 text-[9px] font-sans uppercase font-bold tracking-[0.2em] text-[#C9A227]">
              <ShieldCheck className="w-3 h-3" /> Certified Client
            </div>
          </div>

          {/* Links */}
          <div className="space-y-1 text-xs font-sans font-semibold uppercase tracking-[0.18em] text-[#161A17]">
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center gap-2.5 p-2.5 rounded-[0.5rem] hover:bg-[#F3EFE8] hover:text-[#1C3322] transition-colors"
            >
              <User className="w-4 h-4 text-[#1C3322]" /> Account Dashboard
            </Link>

            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center gap-2.5 p-2.5 rounded-[0.5rem] hover:bg-[#F3EFE8] hover:text-[#1C3322] transition-colors"
            >
              <Package className="w-4 h-4 text-[#1C3322]" /> Order History
            </Link>

            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex items-center gap-2.5 p-2.5 rounded-[0.5rem] hover:bg-[#F3EFE8] hover:text-[#1C3322] transition-colors"
            >
              <Heart className="w-4 h-4 text-[#C9A227]" /> Saved Wishlist
            </Link>
          </div>

          {/* Sign Out Action */}
          <div className="pt-2 mt-2 border-t border-[#E2E6E3]/60">
            <button
              onClick={() => {
                onClose();
                signOut();
              }}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-[0.5rem] text-[#DC2626] hover:bg-[#DC2626]/10 text-xs font-sans font-semibold uppercase tracking-[0.18em] transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import React from "react";
import { useCartStore } from "@/store/cartStore";
import { useHydrated } from "@/hooks/useHydratedStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const isHydrated = useHydrated();
  const rawItems = useCartStore((state) => state.items);
  const items = isHydrated ? rawItems : [];
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totalAmount = useCartStore((state) => state.getTotalAmount)();


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed left-0 top-0 bottom-0 w-full sm:w-[450px] bg-card border-r border-border z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/40">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <span className="font-serif text-xl font-medium text-foreground">Your Selection</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted transition-colors rounded-full">
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground stroke-1" />
                  <p className="text-muted-foreground font-sans">Your shopping cart is currently empty.</p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border border-border text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-all duration-300"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 pb-6 border-b border-border/20 last:border-0">
                    <div className="w-20 h-20 bg-muted overflow-hidden border border-border/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-sans font-medium text-foreground text-sm line-clamp-1">{item.title}</h4>
                          <span className="text-xs text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="font-serif font-semibold text-primary text-sm">₦{item.price}</span>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1 hover:bg-muted transition-colors"
                          >
                            <Minus className="w-3 h-3 text-muted-foreground" />
                          </button>
                          <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-1 hover:bg-muted transition-colors"
                          >
                            <Plus className="w-3 h-3 text-muted-foreground" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border/40 bg-muted/30">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-sans text-sm text-muted-foreground">Order Total</span>
                  <span className="font-serif text-xl font-bold text-primary">₦{totalAmount}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full block py-4 text-center bg-primary text-primary-foreground font-semibold uppercase tracking-widest text-xs hover:bg-primary/90 transition-all duration-300 shadow-lg"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

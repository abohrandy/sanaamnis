"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

/**
 * Empties the bag once an order is confirmed paid.
 *
 * Checkout deliberately leaves the cart intact when handing off to Paystack, so a
 * declined or abandoned payment does not cost the customer their bag. Clearing
 * belongs here, after the order status has been verified server-side.
 */
export function ClearCartOnSuccess() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}

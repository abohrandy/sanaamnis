/**
 * Order pricing.
 *
 * Both the checkout screen and the order API import this, so what a customer is
 * shown and what they are charged are produced by the same code.
 *
 * Pickup is free. Delivery is either a known flat fee for an address inside one
 * of DELIVERY_ZONES (src/lib/deliveryZones.ts), added to the total here, or —
 * for an address outside those zones — quoted separately after checkout and
 * settled with the customer before the order ships (deliveryFee stays 0).
 */

export interface PricedLine {
  variantId: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderTotals {
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export function computeTotals(lines: PricedLine[], deliveryFee: number = 0): OrderTotals {
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const fee = round2(deliveryFee);
  return {
    subtotal: round2(subtotal),
    deliveryFee: fee,
    total: round2(subtotal + fee),
  };
}

/** Money must not carry floating-point dust into Paystack or the database. */
export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Paystack works in kobo. */
export function toKobo(naira: number): number {
  return Math.round(naira * 100);
}

/**
 * Order pricing.
 *
 * Both the checkout screen and the order API import this, so what a customer is
 * shown and what they are charged are produced by the same code. They used to be
 * calculated separately and disagreed: the page added a ₦1,500 express delivery
 * fee that the API never charged.
 */

export const VAT_RATE = 0.075;
export const FREE_SHIPPING_THRESHOLD = 50_000;
export const EXPRESS_SURCHARGE = 1_500;

export type DeliverySpeed = "standard" | "express";

/** Base courier rate by destination. */
const BASE_SHIPPING: Record<string, number> = {
  Lagos: 2_500,
};
const DEFAULT_SHIPPING = 5_000;

export interface PricedLine {
  variantId: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderTotals {
  subtotal: number;
  vat: number;
  shipping: number;
  total: number;
  freeShippingApplied: boolean;
}

export function shippingFee(
  state: string,
  speed: DeliverySpeed,
  subtotal: number
): { fee: number; free: boolean } {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    // The promise is free delivery, not free upgrades: express still costs extra.
    return {
      fee: speed === "express" ? EXPRESS_SURCHARGE : 0,
      free: true,
    };
  }

  const base = BASE_SHIPPING[state] ?? DEFAULT_SHIPPING;
  return {
    fee: speed === "express" ? base + EXPRESS_SURCHARGE : base,
    free: false,
  };
}

export function computeTotals(
  lines: PricedLine[],
  state: string,
  speed: DeliverySpeed
): OrderTotals {
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const { fee, free } = shippingFee(state, speed, subtotal);
  const vat = round2(subtotal * VAT_RATE);
  return {
    subtotal: round2(subtotal),
    vat,
    shipping: fee,
    total: round2(subtotal + vat + fee),
    freeShippingApplied: free,
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

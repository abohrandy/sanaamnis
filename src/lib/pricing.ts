/**
 * Order pricing.
 *
 * Both the checkout screen and the order API import this, so what a customer is
 * shown and what they are charged are produced by the same code.
 *
 * Delivery is not priced here: checkout charges for products (+ VAT) only.
 * Pickup is free; a delivery quote is worked out separately per address and
 * settled with the customer before the order ships (see checkout copy).
 */

export const VAT_RATE = 0.075;

export interface PricedLine {
  variantId: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderTotals {
  subtotal: number;
  vat: number;
  total: number;
}

export function computeTotals(lines: PricedLine[]): OrderTotals {
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const vat = round2(subtotal * VAT_RATE);
  return {
    subtotal: round2(subtotal),
    vat,
    total: round2(subtotal + vat),
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

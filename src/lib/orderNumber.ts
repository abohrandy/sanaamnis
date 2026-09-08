import { sql } from "drizzle-orm";
import { db } from "@/db";

const COMBINING_MARKS = /[̀-ͯ]/g;

/**
 * Turns a free-text location (delivery zone area, pickup location, or a raw
 * address line) into the short, order-number-safe fragment used as the
 * location segment — e.g. "Thomas Estate" -> "THOMAS-ESTATE".
 */
export function orderLocationCode(raw: string): string {
  const cleaned = raw
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "") // strip accents split out by NFKD
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .toUpperCase()
    .split(/[\s-]+/)
    .filter(Boolean)
    .join("-");

  return cleaned.slice(0, 24) || "NG";
}

/**
 * Order numbers are `SA-<LOCATION>-<SERIAL>`, e.g. "SA-THOMAS-ESTATE-000123".
 * The serial comes from a Postgres sequence (order_serial_seq, see migration
 * 0007) so it is strictly increasing and unique even under concurrent
 * checkouts — no read-then-write race like counting existing rows would have.
 */
export async function generateOrderNumber(locationLabel: string): Promise<string> {
  const result = await db.execute<{ nextval: string }>(sql`SELECT nextval('order_serial_seq') AS nextval`);
  const serial = String(result.rows[0].nextval).padStart(6, "0");
  return `SA-${orderLocationCode(locationLabel)}-${serial}`;
}

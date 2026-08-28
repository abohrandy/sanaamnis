import { eq } from "drizzle-orm";
import { db } from "@/db";
import { settings } from "@/db/schema";

/** Looks up an admin-configurable setting from the DB (see /admin/settings).
 * Falls back to null on a lookup failure or missing key so callers can chain
 * their own env-var/placeholder fallback without this throwing. */
export async function getSetting(key: string): Promise<string | null> {
  try {
    const row = await db.query.settings.findFirst({ where: eq(settings.id, key) });
    return row?.value?.trim() || null;
  } catch (error) {
    console.error(`[settings] lookup failed for "${key}":`, error);
    return null;
  }
}

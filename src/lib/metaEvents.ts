import crypto from "crypto";
import { getSetting } from "@/lib/settings";

// Same pixel as the client-side base code in src/app/layout.tsx — the
// Conversions API and the browser pixel report to the same Meta pixel, just
// from two directions, so results de-duplicate on `event_id` in Events Manager.
const META_PIXEL_ID = "28070160635956900";
const META_GRAPH_VERSION = "v21.0";

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/** Nigerian numbers are usually given with a leading 0 instead of +234 — same
 *  normalization used for wa.me links in src/app/(shop)/distributors/page.tsx. */
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const withCountryCode = digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
  return withCountryCode;
}

export interface MetaEventContext {
  /** Full page URL the event happened on. */
  url: string;
  ip?: string | null;
  userAgent?: string | null;
  email?: string | null;
  phone?: string | null;
  /** A stable ID for the customer, e.g. the order ID — hashed before sending. */
  externalId?: string | null;
}

export interface MetaEventProperties {
  value?: number;
  currency?: string;
  contentIds?: string[];
  contentName?: string;
  contentType?: string;
}

/**
 * Sends one server-side event to Meta's Conversions API.
 *
 * Requires an access token generated in Meta Events Manager (the pixel's
 * Settings tab > Conversions API > Generate access token), saved under
 * Settings > Marketing in the admin, or the META_CONVERSIONS_API_ACCESS_TOKEN
 * environment variable as a fallback.
 *
 * Never throws — a marketing pixel must never be able to break checkout,
 * payment confirmation, or webhook processing. Silently skips (no log spam)
 * when no token is configured yet; logs and swallows any request failure.
 *
 * Pass the same `eventId` used by the browser pixel's fbq('track', ...) call
 * for the same conversion (e.g. the order number) so Meta de-duplicates the
 * two reports of one real-world event instead of double-counting it.
 */
export async function sendMetaEvent(
  eventName: string,
  eventId: string,
  context: MetaEventContext,
  properties?: MetaEventProperties
): Promise<void> {
  try {
    const accessToken =
      (await getSetting("meta-conversions-api-token")) || process.env.META_CONVERSIONS_API_ACCESS_TOKEN;
    if (!accessToken) return;

    const userData: Record<string, string | string[]> = {};
    if (context.email) userData.em = [sha256(context.email)];
    if (context.phone) userData.ph = [sha256(normalizePhone(context.phone))];
    if (context.externalId) userData.external_id = [sha256(context.externalId)];
    if (context.ip) userData.client_ip_address = context.ip;
    if (context.userAgent) userData.client_user_agent = context.userAgent;

    const url = `https://graph.facebook.com/${META_GRAPH_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(accessToken)}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            event_source_url: context.url,
            action_source: "website",
            user_data: userData,
            custom_data: properties && {
              value: properties.value,
              currency: properties.currency ?? "NGN",
              content_ids: properties.contentIds,
              content_name: properties.contentName,
              content_type: properties.contentType ?? "product",
            },
          },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[meta-events] ${eventName} rejected (${res.status}): ${body}`);
    }
  } catch (error) {
    console.error(`[meta-events] ${eventName} failed:`, error);
  }
}

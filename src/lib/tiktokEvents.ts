import crypto from "crypto";
import { getSetting } from "@/lib/settings";

// Same pixel as the client-side base code in src/app/layout.tsx — the Events
// API and the browser pixel report to the same TikTok pixel, just from two
// directions, so results de-duplicate on `event_id` in TikTok Events Manager.
const TIKTOK_PIXEL_ID = "DAFJKD3C77UBCVGL3S5G";
const TIKTOK_EVENTS_API_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/";

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/** Nigerian numbers are usually given with a leading 0 instead of +234 — same
 *  normalization used for wa.me links in src/app/(shop)/distributors/page.tsx. */
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const withCountryCode = digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
  return `+${withCountryCode}`;
}

export interface TikTokEventContext {
  /** Full page URL the event happened on. */
  url: string;
  ip?: string | null;
  userAgent?: string | null;
  email?: string | null;
  phone?: string | null;
  /** A stable ID for the customer, e.g. the order ID — hashed before sending. */
  externalId?: string | null;
}

export interface TikTokEventProperties {
  value?: number;
  currency?: string;
  contentId?: string;
  contentType?: string;
  contentName?: string;
  quantity?: number;
}

/**
 * Sends one server-side event to TikTok's Events API.
 *
 * Requires an access token generated in TikTok Events Manager (Assets >
 * Events > Web Events > Sana Amnis Pixels > Events API > Generate Access
 * Token), saved under Settings > Marketing in the admin, or the
 * TIKTOK_EVENTS_API_ACCESS_TOKEN environment variable as a fallback.
 *
 * Never throws — a marketing pixel must never be able to break checkout,
 * payment confirmation, or webhook processing. Silently skips (no log spam)
 * when no token is configured yet; logs and swallows any request failure.
 *
 * Pass the same `eventId` used by the browser pixel's ttq.track() call for
 * the same conversion (e.g. the order number) so TikTok de-duplicates the
 * two reports of one real-world event instead of double-counting it.
 */
export async function sendTikTokEvent(
  eventName: string,
  eventId: string,
  context: TikTokEventContext,
  properties?: TikTokEventProperties
): Promise<void> {
  try {
    const accessToken =
      (await getSetting("tiktok-events-api-token")) || process.env.TIKTOK_EVENTS_API_ACCESS_TOKEN;
    if (!accessToken) return;

    const user: Record<string, string> = {};
    if (context.email) user.email = sha256(context.email);
    if (context.phone) user.phone_number = sha256(normalizePhone(context.phone));
    if (context.externalId) user.external_id = sha256(context.externalId);
    if (context.ip) user.ip = context.ip;
    if (context.userAgent) user.user_agent = context.userAgent;

    const res = await fetch(TIKTOK_EVENTS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": accessToken,
      },
      body: JSON.stringify({
        event_source: "web",
        event_source_id: TIKTOK_PIXEL_ID,
        data: [
          {
            event: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            user,
            properties: properties && {
              value: properties.value,
              currency: properties.currency ?? "NGN",
              content_id: properties.contentId,
              content_type: properties.contentType ?? "product",
              content_name: properties.contentName,
              quantity: properties.quantity,
            },
            page: { url: context.url },
          },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[tiktok-events] ${eventName} rejected (${res.status}): ${body}`);
    }
  } catch (error) {
    console.error(`[tiktok-events] ${eventName} failed:`, error);
  }
}

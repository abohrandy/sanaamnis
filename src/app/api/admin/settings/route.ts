import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// Free-form key/value updates — new keys (e.g. "seo-title") are created on
// first write, existing ones (contact-email, contact-phone, site-name, seeded
// by src/db/seed.ts) are updated in place.
const updateSettingsSchema = z.record(
  z.string().min(1).max(80),
  z.string().max(2000)
);

export async function GET() {
  const { deny } = await requireAdmin("edit:settings");
  if (deny) return deny;

  try {
    const rows = await db.query.settings.findMany();
    // { "site-name": "Sana Amnis", ... } — easier for the admin form to consume
    // than an array of { id, value } rows.
    const map = Object.fromEntries(rows.map((r) => [r.id, r.value]));
    return NextResponse.json({ settings: map });
  } catch (error) {
    console.error("[admin/settings] list failed:", error);
    return NextResponse.json({ error: "Could not load settings." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { deny } = await requireAdmin("edit:settings");
  if (deny) return deny;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const parsed = updateSettingsSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid settings payload." }, { status: 400 });
  }

  const entries = Object.entries(parsed.data);
  if (entries.length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    for (const [key, value] of entries) {
      await db
        .insert(settings)
        .values({ id: key, value, updatedAt: new Date() })
        .onConflictDoUpdate({ target: settings.id, set: { value, updatedAt: new Date() } });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/settings] update failed:", error);
    return NextResponse.json({ error: "Could not save settings." }, { status: 500 });
  }
}

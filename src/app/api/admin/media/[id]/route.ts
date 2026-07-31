import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { media } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function cloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

/**
 * The `media` table has no column for Cloudinary's public_id — every upload
 * this app makes produces a predictable URL shape
 * (".../upload/v<version>/<public_id>.<ext>"), so it's recovered from the
 * stored URL rather than adding a column just for delete.
 */
function publicIdFromUrl(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { deny } = await requireAdmin(["edit:catalog", "edit:pages"]);
  if (deny) return deny;

  const { id } = await params;

  try {
    const [row] = await db.select().from(media).where(eq(media.id, id)).limit(1);
    if (!row) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const config = cloudinaryConfig();
    const publicId = row.provider === "cloudinary" ? publicIdFromUrl(row.url) : null;

    // Best-effort: removing the DB row is what matters for the admin UI and the
    // storefront; a failed or skipped Cloudinary cleanup just leaves an orphaned
    // file in storage, which is not user-visible anywhere.
    if (config && publicId) {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const toSign = `public_id=${publicId}&timestamp=${timestamp}${config.apiSecret}`;
      const signature = createHash("sha1").update(toSign).digest("hex");

      const body = new FormData();
      body.set("public_id", publicId);
      body.set("api_key", config.apiKey);
      body.set("timestamp", timestamp);
      body.set("signature", signature);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/destroy`, {
        method: "POST",
        body,
      }).catch((error) => {
        console.warn(`[admin/media/${id}] Cloudinary cleanup request failed:`, error);
        return null;
      });

      if (res && !res.ok) {
        console.warn(`[admin/media/${id}] Cloudinary cleanup responded ${res.status}`);
      }
    }

    await db.delete(media).where(eq(media.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/media/${id}] delete failed:`, error);
    return NextResponse.json({ error: "Could not delete the file." }, { status: 500 });
  }
}

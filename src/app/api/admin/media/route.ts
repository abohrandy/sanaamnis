import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { media } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const UPLOAD_FOLDER = "sana-amnis";

function cloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

/**
 * Cloudinary's signed-upload signature: every parameter that will be sent
 * *except* file, api_key, signature and cloud_name, sorted alphabetically,
 * joined as key=value&key=value, with the api secret appended, then SHA1'd.
 * Whatever is signed here must be exactly what's sent below — a mismatch is
 * Cloudinary's most common "Invalid Signature" cause.
 */
function signParams(params: Record<string, string>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

export async function GET() {
  const { deny } = await requireAdmin(["edit:catalog", "edit:pages"]);
  if (deny) return deny;

  try {
    const rows = await db.query.media.findMany({ orderBy: [desc(media.createdAt)], limit: 200 });
    return NextResponse.json({ media: rows });
  } catch (error) {
    console.error("[admin/media] list failed:", error);
    return NextResponse.json({ error: "Could not load media." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { deny } = await requireAdmin(["edit:catalog", "edit:pages"]);
  if (deny) return deny;

  const config = cloudinaryConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Media storage isn't configured yet — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET." },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Malformed upload." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP or AVIF images are allowed." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 8MB." }, { status: 400 });
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signedParams = { folder: UPLOAD_FOLDER, timestamp };
    const signature = signParams(signedParams, config.apiSecret);

    const bytes = await file.arrayBuffer();
    const uploadBody = new FormData();
    uploadBody.set("file", new Blob([bytes], { type: file.type }), file.name);
    uploadBody.set("api_key", config.apiKey);
    uploadBody.set("timestamp", timestamp);
    uploadBody.set("folder", UPLOAD_FOLDER);
    uploadBody.set("signature", signature);

    const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
      method: "POST",
      body: uploadBody,
    });

    const result = await cloudinaryRes.json();
    if (!cloudinaryRes.ok) {
      console.error("[admin/media] Cloudinary upload rejected:", result);
      return NextResponse.json({ error: result?.error?.message || "Upload was rejected by the storage provider." }, { status: 502 });
    }

    const [created] = await db
      .insert(media)
      .values({
        filename: file.name,
        url: result.secure_url,
        provider: "cloudinary",
        bytes: result.bytes ?? file.size,
        width: result.width ?? null,
        height: result.height ?? null,
      })
      .returning();

    return NextResponse.json({ media: created }, { status: 201 });
  } catch (error) {
    console.error("[admin/media] upload failed:", error);
    return NextResponse.json({ error: "Could not upload the file." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { bundles, bundleItems } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// See the matching comment in ../route.ts — local /public paths must stay valid, not just full URLs.
const imageUrlSchema = z
  .string()
  .trim()
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//i.test(v), {
    message: "Enter a path starting with / or a full https:// URL",
  });

const bundleItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(100),
});

const updateBundleSchema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  tagline: z.string().trim().max(300).nullable().optional(),
  description: z.string().trim().max(4000).nullable().optional(),
  price: z.number().positive().optional(),
  regularValue: z.number().positive().nullable().optional(),
  badge: z.string().trim().max(60).nullable().optional(),
  heroImageUrl: imageUrlSchema.nullable().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  // When present, replaces the bundle's contents wholesale — bundles are small,
  // fixed sets edited together, unlike product variants which get individually
  // priced/stocked after creation and so get their own dedicated endpoints.
  items: z.array(bundleItemSchema).min(1).max(20).optional(),
});

async function getSlug(id: string): Promise<string | undefined> {
  const row = await db.query.bundles.findFirst({ where: eq(bundles.id, id), columns: { slug: true } });
  return row?.slug;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { deny } = await requireAdmin("edit:catalog");
  if (deny) return deny;

  const { id } = await params;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const parsed = updateBundleSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the bundle details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const { items, ...fields } = parsed.data;

  const patch: Record<string, unknown> = {};
  if (fields.title !== undefined) patch.title = fields.title;
  if (fields.tagline !== undefined) patch.tagline = fields.tagline || null;
  if (fields.description !== undefined) patch.description = fields.description || null;
  if (fields.price !== undefined) patch.price = fields.price.toFixed(2);
  if (fields.regularValue !== undefined) patch.regularValue = fields.regularValue ? fields.regularValue.toFixed(2) : null;
  if (fields.badge !== undefined) patch.badge = fields.badge || null;
  if (fields.heroImageUrl !== undefined) patch.heroImageUrl = fields.heroImageUrl || null;
  if (fields.isPublished !== undefined) patch.isPublished = fields.isPublished;
  if (fields.sortOrder !== undefined) patch.sortOrder = fields.sortOrder;

  if (Object.keys(patch).length === 0 && !items) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    const slug = await getSlug(id);
    if (!slug) {
      return NextResponse.json({ error: "Bundle not found." }, { status: 404 });
    }

    await db.transaction(async (tx) => {
      if (Object.keys(patch).length > 0) {
        await tx.update(bundles).set(patch).where(eq(bundles.id, id));
      }
      if (items) {
        await tx.delete(bundleItems).where(eq(bundleItems.bundleId, id));
        for (const item of items) {
          await tx.insert(bundleItems).values({ bundleId: id, variantId: item.variantId, quantity: item.quantity });
        }
      }
    });

    revalidatePath("/");
    revalidatePath("/bundles");
    revalidatePath(`/bundles/${slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/bundles/${id}] update failed:`, error);
    return NextResponse.json({ error: "Could not update the bundle." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { deny } = await requireAdmin("edit:catalog");
  if (deny) return deny;

  const { id } = await params;

  try {
    const [deleted] = await db.delete(bundles).where(eq(bundles.id, id)).returning({ slug: bundles.slug });
    if (!deleted) {
      return NextResponse.json({ error: "Bundle not found." }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath("/bundles");
    revalidatePath(`/bundles/${deleted.slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/bundles/${id}] delete failed:`, error);
    return NextResponse.json({ error: "Could not delete the bundle." }, { status: 500 });
  }
}

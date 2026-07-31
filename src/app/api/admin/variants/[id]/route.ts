import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { productVariants, products, orderItems } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const updateVariantSchema = z.object({
  sku: z.string().trim().min(2).max(60).optional(),
  name: z.string().trim().min(1).max(120).optional(),
  price: z.number().positive().max(10_000_000).optional(),
  stock: z.number().int().min(0).max(1_000_000).optional(),
  imageUrl: z.union([z.string().trim().url(), z.literal("")]).nullable().optional(),
  isActive: z.boolean().optional(),
});

async function variantProductSlug(variantId: string): Promise<string | undefined> {
  const row = await db
    .select({ slug: products.slug })
    .from(productVariants)
    .innerJoin(products, eq(productVariants.productId, products.id))
    .where(eq(productVariants.id, variantId))
    .limit(1);
  return row[0]?.slug;
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

  const parsed = updateVariantSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the variant details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { price, ...rest } = parsed.data;
  const patch: Record<string, unknown> = { ...rest };
  if (price !== undefined) patch.price = price.toFixed(2);
  if (patch.imageUrl === "") patch.imageUrl = null;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    const slug = await variantProductSlug(id);
    if (!slug) {
      return NextResponse.json({ error: "Variant not found." }, { status: 404 });
    }

    await db.update(productVariants).set(patch).where(eq(productVariants.id, id));

    revalidatePath("/shop");
    revalidatePath(`/products/${slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/variants/${id}] update failed:`, error);
    return NextResponse.json({ error: "Could not update the variant." }, { status: 500 });
  }
}

/**
 * Hard-deletes only if nothing ordered it. A variant with order history can't be
 * removed (orderItems.variantId is onDelete: restrict) — the client should
 * archive it via PATCH { isActive: false } instead, and this route says so.
 */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { deny } = await requireAdmin("edit:catalog");
  if (deny) return deny;

  const { id } = await params;

  try {
    const slug = await variantProductSlug(id);
    if (!slug) {
      return NextResponse.json({ error: "Variant not found." }, { status: 404 });
    }

    const referenced = await db
      .select({ id: orderItems.id })
      .from(orderItems)
      .where(eq(orderItems.variantId, id))
      .limit(1);

    if (referenced.length > 0) {
      return NextResponse.json(
        { error: "This variant has order history and can't be deleted — archive it instead." },
        { status: 409 }
      );
    }

    await db.delete(productVariants).where(eq(productVariants.id, id));

    revalidatePath("/shop");
    revalidatePath(`/products/${slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/variants/${id}] delete failed:`, error);
    return NextResponse.json({ error: "Could not delete the variant." }, { status: 500 });
  }
}

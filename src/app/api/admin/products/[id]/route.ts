import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const updateProductSchema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  description: z.string().trim().max(4000).nullable().optional(),
  categoryId: z.string().uuid().optional(),
  // Archiving a product with order history is the safe removal — see the
  // DELETE handler below for when a real hard delete is actually possible.
  isActive: z.boolean().optional(),
});

async function getSlug(id: string): Promise<string | undefined> {
  const row = await db.query.products.findFirst({
    where: eq(products.id, id),
    columns: { slug: true },
  });
  return row?.slug;
}

/**
 * Hard delete. Blocked by the DB itself (order_items.variantId is onDelete:
 * restrict) for any product that has ever been ordered — that's caught below
 * and surfaced as a clear 409 rather than a raw constraint-violation 500, so
 * the admin UI can tell the difference between "gone" and "archive it instead."
 */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { deny } = await requireAdmin("edit:catalog");
  if (deny) return deny;

  const { id } = await params;

  try {
    const existing = await db.query.products.findFirst({
      where: eq(products.id, id),
      columns: { slug: true, title: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    await db.delete(products).where(eq(products.id, id));

    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath(`/products/${existing.slug}`);

    return NextResponse.json({ success: true, title: existing.title });
  } catch (error) {
    // drizzle-orm wraps the real pg driver error under `.cause` rather than
    // throwing it directly, so both the code and message live one level down.
    // Deleting a variant with order history hits Postgres's ON DELETE RESTRICT
    // path, which is code 23001 (restrict_violation) — NOT 23503
    // (foreign_key_violation, which is for INSERT/UPDATE-side violations).
    // Confirmed empirically against a live restrict violation rather than
    // assumed, since drizzle's wrapping isn't documented.
    const cause = error instanceof Error ? error.cause : undefined;
    const code = typeof cause === "object" && cause !== null ? (cause as { code?: string }).code : undefined;
    const message = cause instanceof Error ? cause.message : error instanceof Error ? error.message : "";
    const isOrderHistory = code === "23001" || code === "23503" || /restrict|foreign key constraint/i.test(message);

    if (isOrderHistory) {
      return NextResponse.json(
        { error: "This product has order history and can't be deleted — archive it instead." },
        { status: 409 }
      );
    }

    console.error(`[admin/products/${id}] delete failed:`, error);
    return NextResponse.json({ error: "Could not delete the product." }, { status: 500 });
  }
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

  const parsed = updateProductSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the product details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    const slug = await getSlug(id);
    if (!slug) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    await db.update(products).set(parsed.data).where(eq(products.id, id));

    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath(`/products/${slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/products/${id}] update failed:`, error);
    return NextResponse.json({ error: "Could not update the product." }, { status: 500 });
  }
}

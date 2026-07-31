import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const updateCategorySchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  imageUrl: z.union([z.string().trim().url(), z.literal("")]).nullable().optional(),
});

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

  const parsed = updateCategorySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the category details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const patch = { ...parsed.data };
  if (patch.imageUrl === "") patch.imageUrl = null;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    await db.update(categories).set(patch).where(eq(categories.id, id));
    revalidatePath("/shop");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/categories/${id}] update failed:`, error);
    return NextResponse.json({ error: "Could not update the category." }, { status: 500 });
  }
}

/**
 * Safe to hard-delete: products.categoryId is onDelete: set null, so removing a
 * category un-categorises its products rather than touching them destructively.
 */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { deny } = await requireAdmin("edit:catalog");
  if (deny) return deny;

  const { id } = await params;

  try {
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath("/shop");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/categories/${id}] delete failed:`, error);
    return NextResponse.json({ error: "Could not delete the category." }, { status: 500 });
  }
}

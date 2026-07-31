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
  // The only "delete" a product gets. Hard-deleting would cascade into variants
  // that may be referenced by order history (orderItems.variantId is onDelete:
  // restrict), so archiving is the only safe removal.
  isActive: z.boolean().optional(),
});

async function getSlug(id: string): Promise<string | undefined> {
  const row = await db.query.products.findFirst({
    where: eq(products.id, id),
    columns: { slug: true },
  });
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

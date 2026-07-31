import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { products, productVariants } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const createVariantSchema = z.object({
  sku: z.string().trim().min(2).max(60),
  name: z.string().trim().min(1).max(120),
  price: z.number().positive().max(10_000_000),
  stock: z.number().int().min(0).max(1_000_000),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { deny } = await requireAdmin("edit:catalog");
  if (deny) return deny;

  const { id: productId } = await params;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const parsed = createVariantSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the variant details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const input = parsed.data;

  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
      columns: { slug: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const [created] = await db
      .insert(productVariants)
      .values({
        productId,
        sku: input.sku,
        name: input.name,
        price: input.price.toFixed(2),
        stock: input.stock,
        imageUrl: input.imageUrl || null,
      })
      .returning({ id: productVariants.id });

    revalidatePath("/shop");
    revalidatePath(`/products/${product.slug}`);

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (error) {
    console.error(`[admin/products/${productId}/variants] create failed:`, error);
    const message =
      error instanceof Error && error.message.includes("unique")
        ? "That SKU is already in use."
        : "Could not add the variant.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

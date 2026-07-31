import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { products, productVariants } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const createProductSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  description: z.string().trim().max(4000).optional(),
  categoryId: z.string().uuid(),
  // First variant is required — a product with zero variants is invisible to the
  // storefront (src/lib/products.ts filters those out), so there is no useful
  // state for a product to exist without at least one.
  variant: z.object({
    sku: z.string().trim().min(2).max(60),
    name: z.string().trim().min(1).max(120),
    price: z.number().positive().max(10_000_000),
    stock: z.number().int().min(0).max(1_000_000),
    imageUrl: z.string().trim().url().optional().or(z.literal("")),
  }),
});

/** Every admin product row, including inactive ones and every variant regardless of stock. */
export async function GET() {
  const { deny } = await requireAdmin("edit:catalog");
  if (deny) return deny;

  try {
    const rows = await db.query.products.findMany({
      with: { category: true, variants: true },
      orderBy: (products, { desc }) => [desc(products.createdAt)],
    });
    return NextResponse.json({ products: rows });
  } catch (error) {
    console.error("[admin/products] list failed:", error);
    return NextResponse.json({ error: "Could not load products." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { deny } = await requireAdmin("edit:catalog");
  if (deny) return deny;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const parsed = createProductSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the product details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const input = parsed.data;

  try {
    const productId = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(products)
        .values({
          title: input.title,
          slug: input.slug,
          description: input.description || null,
          categoryId: input.categoryId,
          isActive: true,
        })
        .returning({ id: products.id });

      await tx.insert(productVariants).values({
        productId: created.id,
        sku: input.variant.sku,
        name: input.variant.name,
        price: input.variant.price.toFixed(2),
        stock: input.variant.stock,
        imageUrl: input.variant.imageUrl || null,
      });

      return created.id;
    });

    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath(`/products/${input.slug}`);

    return NextResponse.json({ id: productId }, { status: 201 });
  } catch (error) {
    console.error("[admin/products] create failed:", error);
    const message =
      error instanceof Error && error.message.includes("unique")
        ? "That slug or SKU is already in use."
        : "Could not create the product.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

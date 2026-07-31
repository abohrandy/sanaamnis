import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
});

export async function GET() {
  const { deny } = await requireAdmin("edit:catalog");
  if (deny) return deny;

  try {
    const rows = await db.query.categories.findMany({
      with: { products: { columns: { id: true } } },
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });
    return NextResponse.json({
      categories: rows.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        imageUrl: c.imageUrl,
        productCount: c.products.length,
      })),
    });
  } catch (error) {
    console.error("[admin/categories] list failed:", error);
    return NextResponse.json({ error: "Could not load categories." }, { status: 500 });
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

  const parsed = createCategorySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the category details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const input = parsed.data;

  try {
    const [created] = await db
      .insert(categories)
      .values({ name: input.name, slug: input.slug, imageUrl: input.imageUrl || null })
      .returning({ id: categories.id });

    revalidatePath("/shop");
    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (error) {
    console.error("[admin/categories] create failed:", error);
    const message =
      error instanceof Error && error.message.includes("unique")
        ? "That slug is already in use."
        : "Could not create the category.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

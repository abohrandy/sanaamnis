import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { recipes } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const updateRecipeSchema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  excerpt: z.string().trim().max(400).nullable().optional(),
  imageUrl: z.union([z.string().trim().url(), z.literal("")]).nullable().optional(),
  difficulty: z.enum(["Easy", "Simple", "Takes practice"]).optional(),
  durationLabel: z.string().trim().min(1).max(40).optional(),
  servingsLabel: z.string().trim().min(1).max(40).optional(),
  ingredients: z.array(z.string().trim().min(1)).min(1).max(30).optional(),
  steps: z.array(z.string().trim().min(1)).min(1).max(20).optional(),
  tip: z.string().trim().max(400).nullable().optional(),
  usesProductSlugs: z.array(z.string()).max(10).optional(),
  isPublished: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { deny } = await requireAdmin("edit:pages");
  if (deny) return deny;

  const { id } = await params;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const parsed = updateRecipeSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the recipe details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { steps, ...rest } = parsed.data;
  const patch: Record<string, unknown> = { ...rest };
  if (steps) patch.instructions = steps.join("\n");
  if (patch.imageUrl === "") patch.imageUrl = null;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    const existing = await db.query.recipes.findFirst({ where: eq(recipes.id, id), columns: { slug: true } });
    if (!existing) {
      return NextResponse.json({ error: "Recipe not found." }, { status: 404 });
    }

    await db.update(recipes).set(patch).where(eq(recipes.id, id));

    revalidatePath("/recipes");
    revalidatePath(`/recipes/${existing.slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/recipes/${id}] update failed:`, error);
    return NextResponse.json({ error: "Could not update the recipe." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { deny } = await requireAdmin("edit:pages");
  if (deny) return deny;

  const { id } = await params;

  try {
    const [deleted] = await db.delete(recipes).where(eq(recipes.id, id)).returning({ slug: recipes.slug });
    if (!deleted) {
      return NextResponse.json({ error: "Recipe not found." }, { status: 404 });
    }

    revalidatePath("/recipes");
    revalidatePath(`/recipes/${deleted.slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/recipes/${id}] delete failed:`, error);
    return NextResponse.json({ error: "Could not delete the recipe." }, { status: 500 });
  }
}

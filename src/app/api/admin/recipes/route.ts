import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { recipes } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const createRecipeSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  excerpt: z.string().trim().max(400).optional(),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
  difficulty: z.enum(["Easy", "Simple", "Takes practice"]).default("Easy"),
  durationLabel: z.string().trim().min(1).max(40).default("30 mins"),
  servingsLabel: z.string().trim().min(1).max(40).default("Serves 4"),
  ingredients: z.array(z.string().trim().min(1)).min(1).max(30),
  // One step per line in the form; sent already split from the client.
  steps: z.array(z.string().trim().min(1)).min(1).max(20),
  tip: z.string().trim().max(400).optional(),
  usesProductSlugs: z.array(z.string()).max(10).default([]),
  isPublished: z.boolean().default(true),
});

export async function GET() {
  const { deny } = await requireAdmin("edit:pages");
  if (deny) return deny;

  try {
    const rows = await db.query.recipes.findMany({
      orderBy: (recipes, { desc }) => [desc(recipes.createdAt)],
    });
    return NextResponse.json({ recipes: rows });
  } catch (error) {
    console.error("[admin/recipes] list failed:", error);
    return NextResponse.json({ error: "Could not load recipes." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { deny } = await requireAdmin("edit:pages");
  if (deny) return deny;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const parsed = createRecipeSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the recipe details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const input = parsed.data;

  try {
    const [created] = await db
      .insert(recipes)
      .values({
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt || null,
        imageUrl: input.imageUrl || null,
        difficulty: input.difficulty,
        durationLabel: input.durationLabel,
        servingsLabel: input.servingsLabel,
        ingredients: input.ingredients,
        instructions: input.steps.join("\n"),
        tip: input.tip || null,
        usesProductSlugs: input.usesProductSlugs,
        isPublished: input.isPublished,
      })
      .returning({ id: recipes.id });

    revalidatePath("/recipes");
    revalidatePath(`/recipes/${input.slug}`);

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (error) {
    console.error("[admin/recipes] create failed:", error);
    const message =
      error instanceof Error && error.message.includes("unique")
        ? "That slug is already in use."
        : "Could not create the recipe.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

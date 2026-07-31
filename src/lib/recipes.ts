/**
 * Server-side recipe access — same DB-first-with-fallback shape as
 * src/lib/products.ts. Database rows win when they exist; src/lib/content.ts's
 * RECIPES backstops an empty or unreachable database.
 *
 * Server components only — this imports the database client.
 */
import { db } from "@/db";
import { RECIPES, type Recipe } from "@/lib/content";

type DbRecipeRow = {
  title: string;
  slug: string;
  excerpt: string | null;
  imageUrl: string | null;
  difficulty: string;
  durationLabel: string;
  servingsLabel: string;
  ingredients: unknown;
  instructions: string | null;
  tip: string | null;
  usesProductSlugs: unknown;
};

function fromDb(row: DbRecipeRow): Recipe {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    duration: row.durationLabel,
    difficulty: (["Easy", "Simple", "Takes practice"] as const).includes(
      row.difficulty as Recipe["difficulty"]
    )
      ? (row.difficulty as Recipe["difficulty"])
      : "Easy",
    serves: row.servingsLabel,
    image: row.imageUrl || "/products/placeholder.jpg",
    usesProducts: Array.isArray(row.usesProductSlugs) ? (row.usesProductSlugs as string[]) : [],
    ingredients: Array.isArray(row.ingredients) ? (row.ingredients as string[]) : [],
    // One step per line, matching how the admin form collects them.
    steps: (row.instructions ?? "").split("\n").map((s) => s.trim()).filter(Boolean),
    tip: row.tip ?? undefined,
  };
}

export async function getRecipes(): Promise<Recipe[]> {
  try {
    const rows = await db.query.recipes.findMany({
      where: (recipes, { eq }) => eq(recipes.isPublished, true),
      orderBy: (recipes, { desc }) => [desc(recipes.createdAt)],
    });
    if (rows.length > 0) {
      return (rows as unknown as DbRecipeRow[]).map(fromDb);
    }
  } catch (error) {
    console.error("[recipes] database unavailable, serving content fallback:", error);
  }
  return RECIPES;
}

export async function getRecipe(slug: string): Promise<Recipe | undefined> {
  try {
    const row = await db.query.recipes.findFirst({
      where: (recipes, { eq, and }) => and(eq(recipes.slug, slug), eq(recipes.isPublished, true)),
    });
    if (row) return fromDb(row as unknown as DbRecipeRow);
  } catch (error) {
    console.error(`[recipes] database unavailable for "${slug}", serving content fallback:`, error);
  }
  return RECIPES.find((r) => r.slug === slug);
}

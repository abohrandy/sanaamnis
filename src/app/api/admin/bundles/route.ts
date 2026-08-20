import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { bundles, bundleItems } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// Local /public paths (e.g. "/bundles/rice-don-set.jpg") must stay valid, not just full URLs —
// see the matching comment in src/app/api/admin/recipes/route.ts.
const imageUrlSchema = z
  .string()
  .trim()
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//i.test(v), {
    message: "Enter a path starting with / or a full https:// URL",
  });

const bundleItemSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(100),
});

const createBundleSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  tagline: z.string().trim().max(300).optional(),
  description: z.string().trim().max(4000).optional(),
  price: z.number().positive(),
  regularValue: z.number().positive().optional(),
  badge: z.string().trim().max(60).optional(),
  heroImageUrl: imageUrlSchema.optional(),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  items: z.array(bundleItemSchema).min(1).max(20),
});

export async function GET() {
  const { deny } = await requireAdmin("edit:catalog");
  if (deny) return deny;

  try {
    const rows = await db.query.bundles.findMany({
      orderBy: (bundles, { asc }) => [asc(bundles.sortOrder), asc(bundles.createdAt)],
      with: { items: { with: { variant: { with: { product: true } } } } },
    });
    return NextResponse.json({ bundles: rows });
  } catch (error) {
    console.error("[admin/bundles] list failed:", error);
    return NextResponse.json({ error: "Could not load bundles." }, { status: 500 });
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

  const parsed = createBundleSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the bundle details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const input = parsed.data;

  try {
    const bundleId = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(bundles)
        .values({
          title: input.title,
          slug: input.slug,
          tagline: input.tagline || null,
          description: input.description || null,
          price: input.price.toFixed(2),
          regularValue: input.regularValue ? input.regularValue.toFixed(2) : null,
          badge: input.badge || null,
          heroImageUrl: input.heroImageUrl || null,
          isPublished: input.isPublished,
          sortOrder: input.sortOrder,
        })
        .returning({ id: bundles.id });

      for (const item of input.items) {
        await tx.insert(bundleItems).values({
          bundleId: created.id,
          variantId: item.variantId,
          quantity: item.quantity,
        });
      }

      return created.id;
    });

    revalidatePath("/");
    revalidatePath("/bundles");
    revalidatePath(`/bundles/${input.slug}`);

    return NextResponse.json({ id: bundleId }, { status: 201 });
  } catch (error) {
    console.error("[admin/bundles] create failed:", error);
    const message =
      error instanceof Error && error.message.includes("unique")
        ? "That slug is already in use."
        : "Could not create the bundle.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

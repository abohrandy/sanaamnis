import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { distributors } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const createDistributorSchema = z.object({
  region: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  areasCovered: z.string().trim().max(300).optional(),
  contactName: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(120).optional(),
  whatsapp: z.string().trim().max(60).optional(),
  address: z.string().trim().max(400).optional(),
  notes: z.string().trim().max(400).optional(),
  isPublished: z.boolean().default(true),
});

export async function GET() {
  const { deny } = await requireAdmin("edit:pages");
  if (deny) return deny;

  try {
    const rows = await db.query.distributors.findMany({
      orderBy: (distributors, { asc }) => [asc(distributors.sortOrder)],
    });
    return NextResponse.json({ distributors: rows });
  } catch (error) {
    console.error("[admin/distributors] list failed:", error);
    return NextResponse.json({ error: "Could not load distributors." }, { status: 500 });
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

  const parsed = createDistributorSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the distributor details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const input = parsed.data;

  try {
    const count = await db.$count(distributors);

    const [created] = await db
      .insert(distributors)
      .values({
        region: input.region,
        slug: input.slug,
        areasCovered: input.areasCovered || null,
        contactName: input.contactName || null,
        phone: input.phone || null,
        whatsapp: input.whatsapp || null,
        address: input.address || null,
        notes: input.notes || null,
        isPublished: input.isPublished,
        sortOrder: count,
      })
      .returning({ id: distributors.id });

    revalidatePath("/distributors");
    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (error) {
    console.error("[admin/distributors] create failed:", error);
    const message =
      error instanceof Error && error.message.includes("unique")
        ? "That slug is already in use."
        : "Could not create the distributor entry.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

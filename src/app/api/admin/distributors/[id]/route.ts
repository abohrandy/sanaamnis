import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { distributors } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const updateDistributorSchema = z.object({
  region: z.string().trim().min(2).max(120).optional(),
  areasCovered: z.string().trim().max(300).nullable().optional(),
  contactName: z.string().trim().max(120).nullable().optional(),
  phone: z.string().trim().max(120).nullable().optional(),
  whatsapp: z.string().trim().max(60).nullable().optional(),
  address: z.string().trim().max(400).nullable().optional(),
  notes: z.string().trim().max(400).nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
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

  const parsed = updateDistributorSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the distributor details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    await db.update(distributors).set(parsed.data).where(eq(distributors.id, id));
    revalidatePath("/distributors");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/distributors/${id}] update failed:`, error);
    return NextResponse.json({ error: "Could not update the distributor entry." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { deny } = await requireAdmin("edit:pages");
  if (deny) return deny;

  const { id } = await params;

  try {
    await db.delete(distributors).where(eq(distributors.id, id));
    revalidatePath("/distributors");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/distributors/${id}] delete failed:`, error);
    return NextResponse.json({ error: "Could not delete the distributor entry." }, { status: 500 });
  }
}

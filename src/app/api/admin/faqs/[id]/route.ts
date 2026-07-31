import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { faqs } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const updateFaqSchema = z.object({
  question: z.string().trim().min(5).max(300).optional(),
  answer: z.string().trim().min(5).max(2000).optional(),
  category: z.string().trim().min(2).max(60).optional(),
  sortOrder: z.number().int().min(0).optional(),
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

  const parsed = updateFaqSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the FAQ details.", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    await db.update(faqs).set(parsed.data).where(eq(faqs.id, id));
    revalidatePath("/faq");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/faqs/${id}] update failed:`, error);
    return NextResponse.json({ error: "Could not update the FAQ." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { deny } = await requireAdmin("edit:pages");
  if (deny) return deny;

  const { id } = await params;

  try {
    await db.delete(faqs).where(eq(faqs.id, id));
    revalidatePath("/faq");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/faqs/${id}] delete failed:`, error);
    return NextResponse.json({ error: "Could not delete the FAQ." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { deny } = await requireAdmin("view:customers");
  if (deny) return deny;

  const { id } = await params;

  try {
    await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/newsletter/${id}] delete failed:`, error);
    return NextResponse.json({ error: "Could not remove the subscriber." }, { status: 500 });
  }
}

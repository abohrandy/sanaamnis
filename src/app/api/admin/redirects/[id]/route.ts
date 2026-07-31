import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { redirectRules } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { deny } = await requireAdmin("edit:settings");
  if (deny) return deny;

  const { id } = await params;

  try {
    await db.delete(redirectRules).where(eq(redirectRules.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/redirects/${id}] delete failed:`, error);
    return NextResponse.json({ error: "Could not delete the redirect." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { deny } = await requireAdmin("view:customers");
  if (deny) return deny;

  try {
    const rows = await db.query.newsletterSubscribers.findMany({
      orderBy: (s) => [desc(s.createdAt)],
      limit: 500,
    });
    return NextResponse.json({ subscribers: rows });
  } catch (error) {
    console.error("[admin/newsletter] list failed:", error);
    return NextResponse.json({ error: "Could not load subscribers." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, desc, isNull } from "drizzle-orm";
import { db } from "@/db";
import { emailFailures } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const resolveSchema = z.object({ id: z.uuid() });

/** Unresolved rows from src/lib/resend.ts's failure log — surfaced on the admin
 * dashboard so a rejected/misconfigured Resend send doesn't go unnoticed. */
export async function GET() {
  const { deny } = await requireAdmin("view:analytics");
  if (deny) return deny;

  try {
    const rows = await db.query.emailFailures.findMany({
      where: isNull(emailFailures.resolvedAt),
      orderBy: [desc(emailFailures.createdAt)],
      limit: 50,
    });
    return NextResponse.json({ failures: rows });
  } catch (error) {
    console.error("[admin/email-failures] list failed:", error);
    return NextResponse.json({ error: "Could not load email failures." }, { status: 500 });
  }
}

/** Marks one failure as reviewed/handled so it drops off the dashboard alert. */
export async function PATCH(request: Request) {
  const { deny } = await requireAdmin("view:analytics");
  if (deny) return deny;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const parsed = resolveSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  try {
    await db.update(emailFailures).set({ resolvedAt: new Date() }).where(eq(emailFailures.id, parsed.data.id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/email-failures] resolve failed:", error);
    return NextResponse.json({ error: "Could not update email failure." }, { status: 500 });
  }
}

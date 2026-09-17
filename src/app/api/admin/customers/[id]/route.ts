import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { logActivity } from "@/lib/audit";
import type { UserRole } from "@/lib/rbac";

export const dynamic = "force-dynamic";

const ASSIGNABLE_ROLES: UserRole[] = [
  "customer",
  "editor",
  "content_manager",
  "store_manager",
  "sales",
  "admin",
  "super_admin",
];

const updateRoleSchema = z.object({
  role: z.enum(ASSIGNABLE_ROLES as [UserRole, ...UserRole[]]),
});

/**
 * Changes a registered account's role. Gated on "edit:roles", which only
 * super_admin's wildcard permission grants — no other role, including plain
 * admin, can hand out roles (itself included).
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, deny } = await requireAdmin("edit:roles");
  if (deny) return deny;

  const { id } = await params;

  // A super_admin changing their own role could lock themselves out of the
  // very screen they're using to do it.
  if (session?.userId === id) {
    return NextResponse.json({ error: "You cannot change your own role." }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const parsed = updateRoleSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  try {
    const existing = await db.query.user.findFirst({
      where: eq(user.id, id),
      columns: { email: true, role: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    const [updated] = await db
      .update(user)
      .set({ role: parsed.data.role })
      .where(eq(user.id, id))
      .returning({ id: user.id });

    if (!updated) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    void logActivity({
      userId: session?.userId ?? null,
      action: "update:role",
      entityName: "user",
      entityId: id,
      details: { targetEmail: existing.email, from: existing.role, to: parsed.data.role },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/customers/${id}] role update failed:`, error);
    return NextResponse.json({ error: "Could not update the role." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { session, user, auditLogs } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/**
 * Super_admin-only: "view:audit_log" isn't listed for any role in
 * src/lib/rbac.ts, so only super_admin's "*" wildcard satisfies it — every
 * other role gets a 403 from requireAdmin, same as delete:orders/edit:roles.
 */
export async function GET() {
  const { deny } = await requireAdmin("view:audit_log");
  if (deny) return deny;

  try {
    const [logins, actions] = await Promise.all([
      db
        .select({
          id: session.id,
          userId: session.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          createdAt: session.createdAt,
        })
        .from(session)
        .innerJoin(user, eq(session.userId, user.id))
        .orderBy(desc(session.createdAt))
        .limit(300),
      db
        .select({
          id: auditLogs.id,
          userId: auditLogs.userId,
          name: user.name,
          email: user.email,
          action: auditLogs.action,
          entityName: auditLogs.entityName,
          entityId: auditLogs.entityId,
          details: auditLogs.details,
          createdAt: auditLogs.createdAt,
        })
        .from(auditLogs)
        .leftJoin(user, eq(auditLogs.userId, user.id))
        .orderBy(desc(auditLogs.createdAt))
        .limit(300),
    ]);

    return NextResponse.json({ logins, actions });
  } catch (error) {
    console.error("[admin/audit-log] list failed:", error);
    return NextResponse.json({ error: "Could not load the activity log." }, { status: 500 });
  }
}

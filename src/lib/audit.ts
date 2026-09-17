import { db } from "@/db";
import { auditLogs } from "@/db/schema";

/**
 * Records a sensitive admin action for the super_admin-only activity log
 * (see /admin/audit-log). Never throws — a logging failure must not block
 * the action it's describing, so errors are swallowed after being logged
 * to the server console.
 */
export async function logActivity(entry: {
  userId: string | null;
  action: string;
  entityName: string;
  entityId?: string | null;
  details?: Record<string, unknown> | null;
}): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      userId: entry.userId,
      action: entry.action,
      entityName: entry.entityName,
      entityId: entry.entityId ?? null,
      details: entry.details ?? null,
    });
  } catch (error) {
    console.error("[audit] failed to record activity:", error);
  }
}

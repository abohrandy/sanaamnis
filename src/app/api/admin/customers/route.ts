import { NextResponse } from "next/server";
import { sql, desc } from "drizzle-orm";
import { db } from "@/db";
import { user, orders } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/**
 * Two honest views rather than one fabricated customer list.
 *
 * "Registered accounts" and "people who have ordered" are genuinely different
 * things here — checkout never requires an account, so most orders belong to no
 * user row at all. Conflating them (as the old mock data did, inventing named
 * "customers" with order counts and spend that didn't exist) would misrepresent
 * how many people have actually signed up versus actually bought something.
 */
export async function GET() {
  const { deny } = await requireAdmin("view:customers");
  if (deny) return deny;

  try {
    const accounts = await db.query.user.findMany({
      columns: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: (user) => [desc(user.createdAt)],
      limit: 200,
    });

    // Grouped by email since guest checkout means most orders have no userId.
    // Excludes payment_failed/cancelled from both the count and the spend total —
    // those never represent real money moved or genuine order intent fulfilled.
    const activity = await db
      .select({
        email: orders.customerEmail,
        name: sql<string>`max(${orders.customerName})`,
        orderCount: sql<number>`count(*)::int`,
        totalSpent: sql<string>`coalesce(sum(${orders.totalAmount}), 0)`,
        lastOrderAt: sql<string>`max(${orders.createdAt})`,
      })
      .from(orders)
      .where(
        sql`${orders.customerEmail} is not null and ${orders.status} not in ('payment_failed', 'cancelled')`
      )
      .groupBy(orders.customerEmail)
      .orderBy(sql`max(${orders.createdAt}) desc`)
      .limit(200);

    return NextResponse.json({
      accounts: accounts.map((a) => ({
        id: a.id,
        name: a.name,
        email: a.email,
        role: a.role,
        createdAt: a.createdAt,
      })),
      orderActivity: activity.map((row) => ({
        email: row.email,
        name: row.name || "—",
        orderCount: row.orderCount,
        totalSpent: Number(row.totalSpent),
        lastOrderAt: row.lastOrderAt,
      })),
    });
  } catch (error) {
    console.error("[admin/customers] load failed:", error);
    return NextResponse.json({ error: "Could not load customers." }, { status: 500 });
  }
}

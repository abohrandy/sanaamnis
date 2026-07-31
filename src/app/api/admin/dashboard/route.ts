import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, newsletterSubscribers } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/** Orders that represent real, completed money — not pending/failed/cancelled. */
const PAID_STATUSES = sql`(${orders.status} in ('paid', 'shipped', 'delivered'))`;

export async function GET() {
  const { deny } = await requireAdmin("view:analytics");
  if (deny) return deny;

  try {
    const [totals] = await db
      .select({
        grossRevenue: sql<string>`coalesce(sum(case when ${PAID_STATUSES} then ${orders.totalAmount} else 0 end), 0)`,
        paidOrders: sql<number>`count(*) filter (where ${PAID_STATUSES})::int`,
        pendingOrders: sql<number>`count(*) filter (where ${orders.status} = 'pending')::int`,
        totalOrders: sql<number>`count(*)::int`,
      })
      .from(orders);

    const [subscriberRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(newsletterSubscribers)
      .where(sql`${newsletterSubscribers.isActive} = true`);

    const monthly = await db
      .select({
        month: sql<string>`to_char(date_trunc('month', ${orders.createdAt}), 'Mon')`,
        value: sql<string>`sum(${orders.totalAmount})`,
      })
      .from(orders)
      .where(sql`${PAID_STATUSES} and ${orders.createdAt} >= now() - interval '6 months'`)
      .groupBy(sql`date_trunc('month', ${orders.createdAt})`)
      .orderBy(sql`date_trunc('month', ${orders.createdAt})`);

    const recentOrders = await db.query.orders.findMany({
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      limit: 5,
      columns: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerEmail: true,
        totalAmount: true,
        status: true,
      },
    });

    return NextResponse.json({
      grossRevenue: Number(totals?.grossRevenue ?? 0),
      paidOrders: totals?.paidOrders ?? 0,
      pendingOrders: totals?.pendingOrders ?? 0,
      totalOrders: totals?.totalOrders ?? 0,
      activeSubscribers: subscriberRow?.count ?? 0,
      monthlyRevenue: monthly.map((m) => ({ label: m.month, value: Number(m.value) })),
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customer: o.customerName || o.customerEmail || "Guest",
        total: Number(o.totalAmount),
        status: o.status,
      })),
    });
  } catch (error) {
    console.error("[admin/dashboard] aggregate failed:", error);
    return NextResponse.json({ error: "Could not load dashboard data." }, { status: 500 });
  }
}
